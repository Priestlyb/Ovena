// hooks/useInboxStore.ts
//
// Single source of truth for inbox messages.
//
// Responsibilities:
//   • Persist messages to AsyncStorage (key: "inbox_messages") on every change
//   • Load persisted messages on mount so history survives app restarts
//   • Track per-message read/unread state (field: `read: boolean`)
//   • Expose addMessage, markAllRead, deleteAll, markRead, and the derived unreadCount
//   • Sync read/read-all actions to the backend (POST /mark_read/, /read_all/)
//     for messages that carry backend notification fields — WS-originated
//     messages without a numeric backendId are updated locally only.
//
// HomeScreen calls addMessage() from both WS callbacks; InboxScreen receives
// the rest of the API through props passed down from HomeScreen.
//
// IMPORTANT: this hook now takes the driver's access token as an argument.
// The caller (HomeScreen) must be updated to call useInboxStore(token)
// instead of useInboxStore() — see file-level note in InboxScreen.tsx.

import { useState, useEffect, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  markNotificationRead,
  markAllNotificationsRead,
  DriverActionsApiError,
} from "../services/driverActionsApi";
import { NotificationType } from "../types/driverActions";

// ── Types ─────────────────────────────────────────────────────────────────────

export interface InboxMessage {
  id:      string;
  sender:  string;
  message: string;
  time:    string;
  read:    boolean;   // false = unread (shows dot + counts toward badge)

  // ── Backend notification fields — OPTIONAL ──────────────────────────────
  // Populated only when this message originated from a backend notification
  // (i.e. addMessage() was called with these present). Messages without a
  // `backendId` (e.g. purely client-side/local messages, if any ever exist)
  // can only be marked read locally — there's no backend record to sync to.
  backendId?:          number;
  notification_type?:  NotificationType;
  title?:              string;
  payload_json?:       string;
  created_at?:         string;
}

const STORAGE_KEY = "inbox_messages";
const LOG_TAG      = "[InboxStore]";

// ── Hook ──────────────────────────────────────────────────────────────────────

export function useInboxStore(token: string | null) {
  const [messages, setMessages] = useState<InboxMessage[]>([]);
  const [loaded,   setLoaded]   = useState(false);
  const [syncing,  setSyncing]  = useState(false); // true while a mark-read API call is in flight

  // Load from storage on mount
  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => {
        if (raw) {
          try {
            const parsed: InboxMessage[] = JSON.parse(raw);
            // Backfill `read` for messages saved before this field existed
            setMessages(parsed.map((m) => ({ ...m, read: m.read ?? false })));
          } catch {
            setMessages([]);
          }
        }
      })
      .finally(() => setLoaded(true));
  }, []);

  // Persist to storage whenever messages change (after initial load)
  useEffect(() => {
    if (!loaded) return;
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(messages)).catch((err) =>
      console.warn(`${LOG_TAG} ⚠️ Failed to persist messages:`, err)
    );
  }, [messages, loaded]);

  // Prepend a new unread message, deduplicating by id
  const addMessage = useCallback((msg: Omit<InboxMessage, "read">) => {
    setMessages((prev) => {
      if (prev.some((m) => m.id === msg.id)) return prev;
      return [{ ...msg, read: false }, ...prev];
    });
  }, []);

  // ── Mark one message read — syncs to backend when possible ─────────────────
  const markRead = useCallback(async (id: string) => {
    const target = messages.find((m) => m.id === id);

    if (!target) {
      console.warn(`${LOG_TAG} ⚠️ markRead() called for unknown id:`, id);
      return;
    }
    if (target.read) {
      console.log(`${LOG_TAG} ℹ️ markRead() — message ${id} already read, skipping`);
      return;
    }

    // Optimistic local update — UI responds instantly regardless of network.
    setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, read: true } : m)));

    const canSync = target.backendId != null && !!token;
    if (!canSync) {
      console.log(
        `${LOG_TAG} ℹ️ markRead() — message ${id} has no backendId/token, ` +
        `updated locally only (not synced to backend)`,
      );
      return;
    }

    try {
      console.log(`${LOG_TAG} 🔄 Syncing mark_read to backend for notification`, target.backendId);
      const result = await markNotificationRead(
        {
          id:                 target.backendId!,
          notification_type:  target.notification_type ?? "generic",
          title:              target.title ?? target.sender,
          body:               target.body ?? target.message,
          payload_json:       target.payload_json ?? "",
          is_read:            true,
          read_at:            new Date().toISOString(),
        },
        token!,
      );
      console.log(`${LOG_TAG} ✅ mark_read synced for notification ${target.backendId}:`, result);
    } catch (err) {
      const message = err instanceof DriverActionsApiError ? err.message : (err as Error).message;
      console.error(`${LOG_TAG} ❌ mark_read failed for notification ${target.backendId}:`, message);
      // Deliberately NOT rolling back the local `read: true` — the message
      // is still logically read from the driver's perspective even if the
      // backend sync failed. The failure is logged for diagnosis; it will
      // simply retry as part of the next read_all() call, if any.
    }
  }, [messages, token]);

  // ── Mark all messages read — syncs to backend, then applies locally ────────
  const markAllRead = useCallback(async () => {
    const hadUnread = messages.some((m) => !m.read);
    if (!hadUnread) {
      console.log(`${LOG_TAG} ℹ️ markAllRead() — nothing unread, skipping`);
      return;
    }

    // Optimistic local update first.
    setMessages((prev) => prev.map((m) => ({ ...m, read: true })));

    if (!token) {
      console.log(`${LOG_TAG} ℹ️ markAllRead() — no token available, updated locally only`);
      return;
    }

    setSyncing(true);
    try {
      console.log(`${LOG_TAG} 🔄 Syncing read_all to backend`);
      const result = await markAllNotificationsRead(token);
      console.log(`${LOG_TAG} ✅ read_all synced:`, result);
    } catch (err) {
      const message = err instanceof DriverActionsApiError ? err.message : (err as Error).message;
      console.error(`${LOG_TAG} ❌ read_all failed:`, message);
      // Local state stays marked read regardless — see note in markRead().
    } finally {
      setSyncing(false);
    }
  }, [messages, token]);

  // Clears both state and the AsyncStorage entry
  const deleteAll = useCallback(() => {
    // No backend "delete notifications" endpoint currently exists —
    // this remains local/device-only, same as before.
    setMessages([]);
    AsyncStorage.removeItem(STORAGE_KEY).catch((err) =>
      console.warn(`${LOG_TAG} ⚠️ Failed to clear inbox storage:`, err)
    );
  }, []);

  const unreadCount = messages.filter((m) => !m.read).length;

  return { messages, unreadCount, loaded, syncing, addMessage, markAllRead, markRead, deleteAll };
}