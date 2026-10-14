// hooks/useDriverTickets.ts
import { useState, useCallback, useEffect, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  fetchDriverTickets,
  createDriverTicket,
} from '../services/driverHelpApi';
import { SupportTicket, CreateTicketPayload } from '../types/driverHelp';

const SILENT_REFRESH_MS = 20000;

export function useDriverTickets() {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const getToken = async () => {
    const token = await AsyncStorage.getItem('accessToken');
    if (!token) throw new Error('Not signed in');
    return token;
  };

  const load = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const token = await getToken();
      const res = await fetchDriverTickets(token);
      setTickets(res.results);
      setError(null);
    } catch (err: any) {
      if (!silent) setError(err.message ?? 'Failed to load tickets');
      console.warn('[useDriverTickets] load error:', err.message);
    } finally {
      if (!silent) setLoading(false);
    }
  }, []);

  const refresh = useCallback(async () => {
    setRefreshing(true);
    await load(false);
    setRefreshing(false);
  }, [load]);

  const createTicket = useCallback(async (payload: CreateTicketPayload) => {
    setCreating(true);
    try {
      const token = await getToken();
      const res = await createDriverTicket(payload, token);
      await load(true); // pick up the new ticket in the list
      return res;
    } finally {
      setCreating(false);
    }
  }, [load]);

  // Initial load + silent background polling, same pattern used elsewhere
  // in the codebase for the admin Support Hub inbox.
  useEffect(() => {
    load(false);
    intervalRef.current = setInterval(() => load(true), SILENT_REFRESH_MS);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [load]);

  return { tickets, loading, refreshing, error, creating, refresh, createTicket };
}