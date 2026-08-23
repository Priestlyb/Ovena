// hooks/useDriverTicketMessages.ts
import { useState, useCallback, useEffect, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  fetchTicketMessages,
  sendTicketMessage,
} from '../services/driverHelpApi';
import { TicketMessage } from '../types/driverHelp';

export interface OptimisticMessage extends TicketMessage {
  pending?: boolean;
  failed?: boolean;
}

const POLL_MS = 8000;

export function useDriverTicketMessages(ticketId: string | undefined) {
  const [messages, setMessages] = useState<OptimisticMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const getToken = async () => {
    const token = await AsyncStorage.getItem('accessToken');
    if (!token) throw new Error('Not signed in');
    return token;
  };

  const load = useCallback(async (silent = false) => {
    if (!ticketId) return;
    if (!silent) setLoading(true);
    try {
      const token = await getToken();
      const res = await fetchTicketMessages(ticketId, token);
      setMessages(prev => {
        // Keep any still-pending optimistic messages that haven't been
        // confirmed by the server yet, so a silent refresh doesn't blow
        // away a message the user just sent.
        const pendingOnes = prev.filter(m => m.pending || m.failed);
        return [...res.results.data, ...pendingOnes];
      });
      setError(null);
    } catch (err: any) {
      if (!silent) setError(err.message ?? 'Failed to load messages');
      console.warn('[useDriverTicketMessages] load error:', err.message);
    } finally {
      if (!silent) setLoading(false);
    }
  }, [ticketId]);

  useEffect(() => {
    load(false);
    pollRef.current = setInterval(() => load(true), POLL_MS);
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [load]);

  const sendMessage = useCallback(async (text: string) => {
    if (!ticketId) return;
    const tempId = `temp-${Date.now()}`;
    const optimistic: OptimisticMessage = {
      id: tempId,
      sender_type: 'driver',
      sender_id: -1,
      message: text,
      attachments: [],
      created_at: new Date().toISOString(),
      pending: true,
    };
    setMessages(prev => [...prev, optimistic]);
    setSending(true);

    try {
      const token = await getToken();
      const real = await sendTicketMessage(
        ticketId,
        { id: ticketId, message: text, attachments: [] },
        token,
      );
      setMessages(prev => prev.map(m => (m.id === tempId ? real : m)));
    } catch (err: any) {
      console.warn('[useDriverTicketMessages] send error:', err.message);
      setMessages(prev =>
        prev.map(m => (m.id === tempId ? { ...m, pending: false, failed: true } : m))
      );
    } finally {
      setSending(false);
    }
  }, [ticketId]);

  const retryMessage = useCallback((id: string) => {
    const target = messages.find(m => m.id === id);
    if (!target) return;
    setMessages(prev => prev.filter(m => m.id !== id));
    sendMessage(target.message);
  }, [messages, sendMessage]);

  const isFromDriver = useCallback((m: TicketMessage) => m.sender_type === 'driver', []);

  return { messages, loading, error, sending, sendMessage, retryMessage, isFromDriver, refresh: () => load(false) };
}