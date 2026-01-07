import * as SecureStore from "expo-secure-store";

export const debugSecureStore = async () => {
  if (!__DEV__) return;

  const keys = [
    "access_token",
    "refresh_token",
    "token_expiry",
    "phone_number",
    "is_new_user",
    "otp_verified",
  ];

  console.log("🔐 SecureStore dump ↓↓↓");

  for (const key of keys) {
    const value = await SecureStore.getItemAsync(key);
    console.log(`${key}:`, value);
  }

  console.log("🔐 End dump ↑↑↑");
};
