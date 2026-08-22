/**
 * hooks/useAdminUsers.ts
 *
 * Paginated admin users list — mirrors useSupportTickets' shape.
 *
 * DEDUPE ON APPEND: offset-based pagination against a live-changing user
 * list can produce overlapping pages — if a user is created or removed
 * between fetching page N and page N+1, everything after that point
 * shifts by one row, and a user can appear in both the previous and the
 * newly-fetched page. Left unhandled, that duplicate id breaks FlatList's
 * keyExtractor uniqueness assumption ("Encountered two children with the
 * same key"). mergeUsers() below filters out any id already present in
 * state before appending, so this can't happen regardless of why the
 * overlap occurred.
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import { AdminAppUser } from '@/types/appData';
import { fetchAdminUsers, AdminUsersApiError } from '@/services/adminUsersApi';

const LOG_TAG = '[useAdminUsers]';

function mergeUsers(existing: AdminAppUser[], incoming: AdminAppUser[]): AdminAppUser[] {
  const seen = new Set(existing.map((u) => u.id));
  const deduped = incoming.filter((u) => {
    if (seen.has(u.id)) return false;
    seen.add(u.id);
    return true;
  });
  const skipped = incoming.length - deduped.length;
  if (skipped > 0) {
    console.warn(`${LOG_TAG} ⚠️ Skipped ${skipped} duplicate user(s) from an overlapping page (offset-pagination shift — list likely changed between fetches)`);
  }
  return [...existing, ...deduped];
}

export function useAdminUsers() {
  const { tokens, isAuthenticated } = useAuth();

  const [users, setUsers] = useState<AdminAppUser[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);

  const inFlightRef = useRef(false);

  const load = useCallback(async (offset: number, append: boolean) => {
    if (!isAuthenticated || !tokens?.accessToken) {
      console.log(`${LOG_TAG} ⏸️ Not authenticated — skipping fetch`);
      return;
    }
    if (inFlightRef.current) return;
    inFlightRef.current = true;

    append ? setLoadingMore(true) : setLoading(true);
    setError(null);

    try {
      console.log(`${LOG_TAG} 🌐 Fetching offset=${offset}`);
      const page = await fetchAdminUsers(offset, tokens.accessToken);

      setUsers((prev) => (append ? mergeUsers(prev, page.results) : page.results));
      setTotalCount(page.count);
      setHasMore(page.next !== null);

      console.log(`${LOG_TAG} ✅ Loaded ${page.results.length} users (offset=${offset}, total=${page.count}, hasMore=${page.next !== null})`);
    } catch (err) {
      const message = err instanceof AdminUsersApiError ? err.message : 'Failed to load users';
      console.error(`${LOG_TAG} ❌`, message);
      setError(message);
    } finally {
      append ? setLoadingMore(false) : setLoading(false);
      inFlightRef.current = false;
    }
  }, [isAuthenticated, tokens]);

  useEffect(() => {
    load(0, false);
  }, [load]);

  // NOTE: offset is derived from users.length, which is why a dedup-only
  // fix (rather than also changing how offset is computed) is sufficient —
  // even if this offset occasionally re-requests a row or two the client
  // already has, mergeUsers() silently drops the repeat instead of
  // duplicating it. Switching to cursor-based pagination would be the
  // more robust long-term fix if the backend ever offers a cursor param,
  // since it eliminates the shift-on-insert problem entirely rather than
  // just tolerating it — but this endpoint currently only exposes
  // limit/offset.
  const loadMore = useCallback(() => {
    if (!hasMore || loadingMore || loading) return;
    load(users.length, true);
  }, [hasMore, loadingMore, loading, users.length, load]);

  const refresh = useCallback(() => {
    load(0, false);
  }, [load]);

  return { users, totalCount, loading, loadingMore, error, hasMore, loadMore, refresh };
}