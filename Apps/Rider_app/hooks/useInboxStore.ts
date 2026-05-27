// hooks/useInboxStore.ts
//
// Single source of truth for inbox messages.
//
// Responsibilities:
//   • Persist messages to AsyncStorage (key: "inbox_messages") on every change
//   • Load persisted messages on mount so history survives app restarts
//   • Track per-message read/unread state (field: `read: boolean`)
//   • Expose addMessage, markAllRead, deleteAll, markRead, and the derived unreadCount
//
// HomeScreen calls addMessage() from both WS callbacks; InboxScreen receives
// the rest of the API through props passed down from HomeScreen.

import { useState, useEffect, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

// ── Types ─────────────────────────────────────────────────────────────────────

export interface InboxMessage {
  id:      string;
  sender:  string;
  message: string;
  time:    string;
  read:    boolean;   // false = unread (shows dot + counts toward badge)
}

const STORAGE_KEY = "inbox_messages";

// ── Hook ──────────────────────────────────────────────────────────────────────

export function useInboxStore() {
  const [messages, setMessages] = useState<InboxMessage[]>([]);
  const [loaded,   setLoaded]   = useState(false);

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
      console.warn("[InboxStore] Failed to persist messages:", err)
    );
  }, [messages, loaded]);

  // Prepend a new unread message, deduplicating by id
  const addMessage = useCallback((msg: Omit<InboxMessage, "read">) => {
    setMessages((prev) => {
      if (prev.some((m) => m.id === msg.id)) return prev;
      return [{ ...msg, read: false }, ...prev];
    });
  }, []);

  const markAllRead = useCallback(() => {
    setMessages((prev) => prev.map((m) => ({ ...m, read: true })));
  }, []);

  const markRead = useCallback((id: string) => {
    setMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, read: true } : m))
    );
  }, []);

  // Clears both state and the AsyncStorage entry
  const deleteAll = useCallback(() => {
    setMessages([]);
    AsyncStorage.removeItem(STORAGE_KEY).catch((err) =>
      console.warn("[InboxStore] Failed to clear inbox storage:", err)
    );
  }, []);

  const unreadCount = messages.filter((m) => !m.read).length;

  return { messages, unreadCount, loaded, addMessage, markAllRead, markRead, deleteAll };
}