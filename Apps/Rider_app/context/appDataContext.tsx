// context/appDataContext.tsx
import React, {
  createContext, useContext, useState,
  useEffect, useCallback,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { fetchAllAppData, AllAppData } from "../services/appDataApi";

interface AppDataContextValue {
  data:    AllAppData | null;
  loading: boolean;
  error:   string | null;
  refresh: () => Promise<void>;
  // Wipes the cached app data (and resets in-memory state) without
  // attempting a fetch. Call this from wherever sign-out happens — right
  // after the access token itself is removed — so the next person to open
  // the app on this device never sees a flash of the previous user's data.
  clearCache: () => Promise<void>;
}

const AppDataContext = createContext<AppDataContextValue>({
  data: null, loading: true, error: null,
  refresh: async () => {}, clearCache: async () => {},
});

const CACHE_KEY = "ovena_appdata_cache_v2"; // bumped so old shape doesn't cause crashes

export const AppDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData]       = useState<AllAppData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState<string | null>(null);

  // Removes the cached payload from disk and clears it from memory. Safe to
  // call any time — used both by sign-out and by load() itself whenever it
  // finds no signed-in user.
  const clearCache = useCallback(async () => {
    await AsyncStorage.removeItem(CACHE_KEY);
    setData(null);
    setError(null);
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Check for a signed-in user FIRST. If there isn't one, there's no
      // legitimate reason to have any cached data sitting around — clear it
      // and stop, rather than serving a stale, possibly-stale-user payload.
      const token = await AsyncStorage.getItem("accessToken");
      if (!token) {
        await clearCache();
        setLoading(false);
        return;
      }

      // 1. Serve stale cache immediately so screens aren't blank while the
      //    fresh fetch is in flight — only reached once we know a token
      //    actually exists, so this can't leak a previous user's data into
      //    a logged-out state.
      const cached = await AsyncStorage.getItem(CACHE_KEY);
      if (cached) {
        setData(JSON.parse(cached));
        setLoading(false);
      }

      // 2. Fetch fresh data for the current token
      const fresh = await fetchAllAppData(token);
      setData(fresh);
      await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(fresh));
    } catch (err: any) {
      console.warn("AppDataContext load error:", err.message);
      setError(err.message ?? "Failed to load app data");
    } finally {
      setLoading(false);
    }
  }, [clearCache]);

  useEffect(() => { load(); }, []);

  return (
    <AppDataContext.Provider value={{ data, loading, error, refresh: load, clearCache }}>
      {children}
    </AppDataContext.Provider>
  );
};

export const useAppData = () => useContext(AppDataContext);