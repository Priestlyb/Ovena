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
}

const AppDataContext = createContext<AppDataContextValue>({
  data: null, loading: true, error: null, refresh: async () => {},
});

const CACHE_KEY = "ovena_appdata_cache_v2"; // bumped so old shape doesn't cause crashes

export const AppDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData]       = useState<AllAppData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // 1. Serve stale cache immediately so screens aren't blank
      const cached = await AsyncStorage.getItem(CACHE_KEY);
      if (cached) {
        setData(JSON.parse(cached));
        setLoading(false);
      }

      // 2. Fetch fresh data if a token is available
      const token = await AsyncStorage.getItem("accessToken");
      if (!token) { setLoading(false); return; }

      const fresh = await fetchAllAppData(token);
      setData(fresh);
      await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(fresh));
    } catch (err: any) {
      console.warn("AppDataContext load error:", err.message);
      setError(err.message ?? "Failed to load app data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, []);

  return (
    <AppDataContext.Provider value={{ data, loading, error, refresh: load }}>
      {children}
    </AppDataContext.Provider>
  );
};

export const useAppData = () => useContext(AppDataContext);