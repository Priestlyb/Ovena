/**
 * hooks/useTicketMessages.ts
 *
 * Drives a single ticket's chat thread against supportActionsApi's
 * fetchTicketMessages / sendTicketMessage.
 *
 * Direction (requester vs. support) is read directly off `sender_type`:
 * confirmed real value for our side is the literal string "support" —
 * NOT "admin", and NOT inferred by comparing sender_id to the ticket's
 * owner_id (that was a workaround from before this value was confirmed;
 * it's no longer needed and has been removed).
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { fetchTicketMessages, sendTicketMessage } from '@/services/actionsApi';
import { TicketMessage } from '@/types/appData';

const LOG_TAG = '[useTicketMessages]';

export interface OptimisticMessage extends TicketMessage {
  pending?: boolean;
  failed?:  boolean;
}

export function useTicketMessages(ticketId: string | undefined) {
  const { tokens } = useAuth();

  
  const [messages, setMessages] = useState<OptimisticMessage[]>([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState<string | null>(null);
  const [sending, setSending]   = useState(false);

  const tempIdRef = useRef(0);

  const load = useCallback(async () => {
    if (!ticketId || !tokens?.accessToken) return;
    setLoading(true);
    setError(null);
    try {
      console.log(`${LOG_TAG} 🌐 Loading messages for ticket ${ticketId}`);
      const fetched = await fetchTicketMessages(ticketId, tokens.accessToken);
      const sorted = [...fetched].sort(
        (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      );
      setMessages(sorted);
    } catch (err: any) {
      console.error(`${LOG_TAG} ❌ Failed to load messages:`, err.message ?? err);
      setError(err.message ?? 'Failed to load messages');
    } finally {
      setLoading(false);
    }
  }, [ticketId, tokens]);

  useEffect(() => {
    load();
  }, [load]);

  const sendMessage = useCallback(async (text: string, attachmentIds: string[] = []) => {
    const trimmed = text.trim();
    if ((!trimmed && attachmentIds.length === 0) || !ticketId || !tokens?.accessToken) return;

    const tempId = `temp_${++tempIdRef.current}`;
    // Optimistic message: sender_type "support" is the confirmed real value
    // for our side, so it renders correctly on the admin side immediately,
    // consistent with what the server will echo back.
    const optimistic: OptimisticMessage = {
      id: tempId,
      sender_type: 'support',
      sender_id: 0, // placeholder — real admin/agent id not available client-side; overwritten once server responds
      message: trimmed,
      attachments: [], // optimistic render can't show real attachment objects pre-upload-confirmation
      created_at: new Date().toISOString(),
      pending: true,
    };

    setMessages(prev => [...prev, optimistic]);
    setSending(true);

    try {
      const saved = await sendTicketMessage(ticketId, { message: trimmed, attachments: attachmentIds }, tokens.accessToken);
      setMessages(prev => prev.map(m => (m.id === tempId ? { ...saved, pending: false } : m)));
    } catch (err: any) {
      console.error(`${LOG_TAG} ❌ Send failed for temp message ${tempId}:`, err.message ?? err);
      setMessages(prev => prev.map(m => (m.id === tempId ? { ...m, pending: false, failed: true } : m)));
    } finally {
      setSending(false);
    }
  }, [ticketId, tokens]);

  const retryMessage = useCallback((tempId: string) => {
    const msg = messages.find(m => m.id === tempId);
    if (!msg) return;
    setMessages(prev => prev.filter(m => m.id !== tempId));
    sendMessage(msg.message);
  }, [messages, sendMessage]);

  // "support" sender_type is our side; everything else (customer, driver,
  // business_admin, business_staff) is the requester's side.
  const isFromRequester = useCallback(
    (msg: OptimisticMessage) => msg.sender_type !== 'support',
    []
  );

  return { messages, loading, error, sending, sendMessage, retryMessage, refresh: load, isFromRequester };
}