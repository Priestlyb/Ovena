import * as SecureStore from "expo-secure-store";

export const debugSecureStore = async () => {
  if (!__DEV__) return;

  console.log("🔐 ================= SECURE STORE DEBUG =================");

  const raw = await SecureStore.getItemAsync("auth_state");

  if (!raw) {
    console.log("❌ auth_state: <empty>");
    console.log("🔐 ================= END =================");
    return;
  }

  try {
    const state = JSON.parse(raw);

    console.log("🛡️ accessToken:", state.accessToken ? "✅ present" : "❌ empty");
    console.log("🔄 refreshToken:", state.refreshToken ? "✅ present" : "❌ empty");
    console.log("📞 phoneNumber:", state.phoneNumber);
    console.log("🆕 isNewUser:", state.isNewUser);
    console.log("🔐 otpVerified:", state.isOtpVerified);
  } catch (err) {
    console.log("❌ auth_state corrupted");
  }

  console.log("🔐 ================= END =================");
};
