import AsyncStorage from "@react-native-async-storage/async-storage";

const ACCESS = "access";
const REFRESH = "refresh";

/* ================================
   Save tokens
================================ */
export const saveAuth = async (access: string, refresh: string) => {
  await AsyncStorage.setItem(ACCESS, access);
  await AsyncStorage.setItem(REFRESH, refresh);
};

/* ================================
   Get access token
================================ */
export const getAccessToken = async (): Promise<string | null> => {
  return AsyncStorage.getItem(ACCESS);
};

/* ================================
   Get refresh token
================================ */
export const getRefreshToken = async (): Promise<string | null> => {
  return AsyncStorage.getItem(REFRESH);
};

/* ================================
   Clear auth
================================ */
export const clearAuth = async () => {
  await AsyncStorage.removeItem(ACCESS);
  await AsyncStorage.removeItem(REFRESH);
};