/**
 * hooks/useSupportTickets.ts
 *
 * Drives the Support Hub inbox against supportActionsApi.fetchSupportTickets.
 *
 * Two distinct refresh paths:
 *  - refresh()       → full reset (pull-to-refresh): loading spinner,
 *                       offset back to 0, list replaced entirely.
 *  - silentRefresh()  → background poll (every 60s): re-fetches page 0
 *                       ONLY, merges any new/changed rows into the existing
 *                       list by id, and never touches loading state or the
 *                       nextOffsetRef pagination cursor — so it can't yank
 *                       the list out from under someone scrolled further
 *                       down or reset their loaded pages.
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { fetchSupportTickets } from '@/services/actionsApi';
import { SupportTicket, OwnerRole } from '@/types/appData';

const PAGE_SIZE = 20;
const MIN_VISIBLE_WHEN_FILTERED = 10;
const SILENT_REFRESH_INTERVAL_MS = 60_000; // 1 minute
const LOG_TAG = '[useSupportTickets]';

export type OwnerRoleFilter = 'all' | OwnerRole;

export function useSupportTickets() {
  const { tokens } = useAuth();

  const [tickets, setTickets]                 = useState<SupportTicket[]>([]);
  const [ownerRoleFilter, setOwnerRoleFilter]  = useState<OwnerRoleFilter>('all');
  const [loading, setLoading]                 = useState(true);
  const [loadingMore, setLoadingMore]         = useState(false);
  const [error, setError]                     = useState<string | null>(null);
  const [totalCount, setTotalCount]           = useState(0);
  const [hasMore, setHasMore]                 = useState(true);

  const nextOffsetRef = useRef(0);
  const hasMoreRef    = useRef(true);
  const inFlightRef   = useRef(false);

  const fetchPage = useCallback(async (offset: number, replace: boolean) => {
    if (!tokens?.accessToken) return;
    inFlightRef.current = true;
    try {
      console.log(`${LOG_TAG} 🌐 Fetching tickets — limit=${PAGE_SIZE} offset=${offset}`);
      const page = await fetchSupportTickets(tokens.accessToken, { limit: PAGE_SIZE, offset });

      hasMoreRef.current = !!page.next;
      setHasMore(hasMoreRef.current);
      nextOffsetRef.current = offset + PAGE_SIZE;
      setTotalCount(page.count);

      setTickets(prev => {
        const base = replace ? [] : prev;
        const seen = new Set(base.map(t => t.id));
        const merged = [...base];
        for (const t of page.results) {
          if (!seen.has(t.id)) {
            merged.push(t);
            seen.add(t.id);
          }
        }
        return merged;
      });

      console.log(`${LOG_TAG} ✅ Page loaded (${page.results.length} rows, hasMore=${hasMoreRef.current})`);
      setError(null);
    } catch (err: any) {
      console.error(`${LOG_TAG} ❌ Failed to load tickets:`, err.message ?? err);
      setError(err.message ?? 'Failed to load support tickets');
    } finally {
      inFlightRef.current = false;
    }
  }, [tokens]);

  // Initial load
  useEffect(() => {
    if (!tokens?.accessToken) return;
    setLoading(true);
    nextOffsetRef.current = 0;
    hasMoreRef.current = true;
    fetchPage(0, true).finally(() => setLoading(false));
  }, [tokens, fetchPage]);

  const loadMore = useCallback(async () => {
    if (inFlightRef.current || !hasMoreRef.current || loading) return;
    setLoadingMore(true);
    await fetchPage(nextOffsetRef.current, false);
    setLoadingMore(false);
  }, [fetchPage, loading]);

  const refresh = useCallback(async () => {
    setLoading(true);
    nextOffsetRef.current = 0;
    hasMoreRef.current = true;
    await fetchPage(0, true);
    setLoading(false);
  }, [fetchPage]);

  /**
   * Background poll — fetches page 0 and merges new rows in WITHOUT
   * resetting loading state, offset cursor, or dropping already-loaded
   * pages. New tickets that arrived since the last fetch get appended;
   * existing ones are left as-is (their content isn't re-merged/patched
   * here, since the ticket list endpoint doesn't return per-row change
   * timestamps to diff against).
   */
  const silentRefresh = useCallback(async () => {
    if (!tokens?.accessToken || inFlightRef.current) return;
    inFlightRef.current = true;
    try {
      console.log(`${LOG_TAG} 🔁 Silent refresh (background poll)`);
      const page = await fetchSupportTickets(tokens.accessToken, { limit: PAGE_SIZE, offset: 0 });
      setTotalCount(page.count);

      setTickets(prev => {
        const seen = new Set(prev.map(t => t.id));
        const newOnes = page.results.filter(t => !seen.has(t.id));
        if (newOnes.length === 0) return prev;
        console.log(`${LOG_TAG} 🆕 Silent refresh found ${newOnes.length} new ticket(s)`);
        return [...newOnes, ...prev];
      });
    } catch (err: any) {
      // Silent by design — a failed background poll shouldn't surface an
      // error banner over whatever the admin is currently looking at.
      console.warn(`${LOG_TAG} ⚠️ Silent refresh failed (ignored):`, err.message ?? err);
    } finally {
      inFlightRef.current = false;
    }
  }, [tokens]);

  // 1-minute background refresh
  useEffect(() => {
    if (!tokens?.accessToken) return;
    const interval = setInterval(() => {
      silentRefresh();
    }, SILENT_REFRESH_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [tokens, silentRefresh]);

  const filteredTickets = ownerRoleFilter === 'all'
    ? tickets
    : tickets.filter(t => t.owner_role === ownerRoleFilter);

  useEffect(() => {
    if (loading || loadingMore || inFlightRef.current) return;
    if (!hasMoreRef.current) return;
    if (ownerRoleFilter === 'all') return;
    if (filteredTickets.length >= MIN_VISIBLE_WHEN_FILTERED) return;

    console.log(`${LOG_TAG} 🔎 Filter "${ownerRoleFilter}" has thin results (${filteredTickets.length}) — auto-loading more`);
    loadMore();
  }, [ownerRoleFilter, filteredTickets.length, loading, loadingMore, loadMore]);

  return {
    tickets: filteredTickets,
    totalCount,
    ownerRoleFilter,
    setOwnerRoleFilter,
    loading,
    loadingMore,
    error,
    hasMore,
    loadMore,
    refresh,
    silentRefresh,
  };
}