/**
 * context/AppDataContext.tsx
 *
 * Provides the aggregated dashboard payload (stats, logistics, support,
 * coupons) to every screen, backed by a stale-while-revalidate cache.
 *
 * Behaviour:
 *  - On mount, immediately serves whatever was cached from the last
 *    successful fetch so screens are never blank on a cold start.
 *  - If an access token is available (from AuthContext / AsyncStorage),
 *    fetches fresh data in the background and overwrites both state and
 *    cache once it lands.
 *  - If no token is available yet, the loader exits early and waits —
 *    `refresh()` can be called again once auth completes.
 *  - Automatically reloads when the authenticated user changes, and clears
 *    all cached data on logout so the next admin's session never sees a
 *    previous admin's data.
 *
 * Every step of this flow is logged to the console (cache hit/miss, token
 * presence, fetch start/success/failure, cache writes, logout clears) so
 * a stuck loading state or stale-data bug can be diagnosed just by reading
 * the Metro log in order — no need to add temporary console.logs to debug.
 *
 * Usage:
 *   // Wrap inside AuthProvider, since it depends on the access token:
 *   <AuthProvider>
 *     <AppDataProvider>
 *       ...
 *     </AppDataProvider>
 *   </AuthProvider>
 *
 *   // Consume anywhere:
 *   const { data, loading, error, refresh } = useAppData();
 */

import React, {
  createContext, useContext, useState,
  useEffect, useCallback,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetchAllAppData, AllAppData } from '../services/appDataApi';
import { useAuth } from './AuthContext';

interface AppDataContextValue {
  data:    AllAppData | null;
  loading: boolean;
  error:   string | null;
  refresh: () => Promise<void>;
}

const AppDataContext = createContext<AppDataContextValue>({
  data: null, loading: true, error: null, refresh: async () => {},
});

const CACHE_KEY = 'ovena_appdata_cache_v2'; // bumped so old shape doesn't cause crashes
const LOG_TAG   = '[AppDataContext]';

export const AppDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { tokens, isAuthenticated } = useAuth();

  const [data, setData]       = useState<AllAppData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState<string | null>(null);

  const load = useCallback(async () => {
    console.log(`${LOG_TAG} 🔄 load() starting`);
    setLoading(true);
    setError(null);

    try {
      // 1. Serve stale cache immediately so screens aren't blank
      console.log(`${LOG_TAG} 📦 Checking cache (key: ${CACHE_KEY})`);
      const cached = await AsyncStorage.getItem(CACHE_KEY);

      if (cached) {
        console.log(`${LOG_TAG} ✅ Cache hit — serving stale data immediately`);
        try {
          setData(JSON.parse(cached));
        } catch {
          console.warn(`${LOG_TAG} ⚠️ Cached data was not valid JSON — ignoring cache`, cached.slice(0, 200));
        }
        setLoading(false);
      } else {
        console.log(`${LOG_TAG} ℹ️ Cache miss — no stale data to show`);
      }

      // 2. Fetch fresh data if a token is available
      const token = tokens?.accessToken ?? (await AsyncStorage.getItem('accessToken'));

      if (!token) {
        console.log(`${LOG_TAG} ⏸️ No access token available yet — skipping fresh fetch. ` +
          `Call refresh() again once auth completes.`);
        setLoading(false);
        return;
      }

      console.log(`${LOG_TAG} 🌐 Fetching fresh dashboard data (token present)`);
      const fresh = await fetchAllAppData(token);

      console.log(`${LOG_TAG} ✅ Fresh data received — updating state + cache`);
      setData(fresh);

      await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(fresh));
      console.log(`${LOG_TAG} 💾 Cache written successfully`);
    } catch (err: any) {
      console.error(`${LOG_TAG} ❌ load() failed:`, err.message ?? err);
      setError(err.message ?? 'Failed to load app data');
    } finally {
      setLoading(false);
      console.log(`${LOG_TAG} 🏁 load() finished`);
    }
  }, [tokens]);

  // Initial load + reload whenever the authenticated session changes
  useEffect(() => {
    console.log(`${LOG_TAG} 🚀 Effect fired — auth/token state changed, reloading`);
    load();
  }, [load]);

  // Wipe cached data the moment the admin logs out, so the next login
  // never briefly flashes the previous admin's dashboard
  useEffect(() => {
    if (!isAuthenticated) {
      console.log(`${LOG_TAG} 🔒 Not authenticated — clearing in-memory data and cache`);
      setData(null);
      AsyncStorage.removeItem(CACHE_KEY)
        .then(() => console.log(`${LOG_TAG} 🗑️ Cache cleared`))
        .catch((err) => console.warn(`${LOG_TAG} ⚠️ Failed to clear cache:`, err.message ?? err));
    }
  }, [isAuthenticated]);

  return (
    <AppDataContext.Provider value={{ data, loading, error, refresh: load }}>
      {children}
    </AppDataContext.Provider>
  );
};

export const useAppData = () => useContext(AppDataContext);