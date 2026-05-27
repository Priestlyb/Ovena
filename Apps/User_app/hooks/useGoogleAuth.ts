// import { useEffect } from "react";
// import * as Google from "expo-auth-session/providers/google";
// import * as WebBrowser from "expo-web-browser";
// import { Alert } from "react-native";

// WebBrowser.maybeCompleteAuthSession();

// /* =========================
//    CONSTANTS
// ========================= */
// const GOOGLE_EXPO_CLIENT_ID =
//   "456377512712-q3575fiuvstk9kd1tr3hhqmp55j42jkj.apps.googleusercontent.com";

// /* =========================
//    GOOGLE AUTH HOOK (FIXED)
// ========================= */
// export function useGoogleAuth(
//   onSuccess: (idToken: string) => void,
//   onFinish?: () => void
// ) {
//   const [request, response, promptAsync] = Google.useAuthRequest({
//     clientId: GOOGLE_EXPO_CLIENT_ID, // ✅ FIXED
//     scopes: ["profile", "email"],
//   });

//   useEffect(() => {
//     console.log("📡 Google response:", response);

//     if (response?.type === "success") {
//       const idToken = response.authentication?.idToken;

//       console.log("🔑 ID TOKEN:", idToken ? "FOUND" : "MISSING");

//       if (!idToken) {
//         Alert.alert("Google Login Error", "No ID token returned");
//         onFinish?.();
//         return;
//       }

//       console.log("✅ Sending token to backend...");
//       onSuccess(idToken);
//       onFinish?.();
//     }

//     if (response?.type === "error") {
//       console.log("❌ Google Auth Error:", response.error);
//       Alert.alert("Google Login Error", "Authentication failed");
//       onFinish?.();
//     }
//   }, [response]);

//   return {
//     request,
//     signIn: async () => {
//       console.log("🚀 Launching Google Sign-In...");
//       await promptAsync();
//     },
//   };
// }
