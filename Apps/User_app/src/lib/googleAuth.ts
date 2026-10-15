import { GoogleSignin } from "@react-native-google-signin/google-signin";

/* =========================================================
   GOOGLE SIGN-IN CONFIGURATION
========================================================= */

GoogleSignin.configure({
  webClientId:
    "759419359264-l64jb3cv965csakroir36hqska36vrpf.apps.googleusercontent.com",

  /*
   * Allows the app to obtain a refresh token when required.
   */
  offlineAccess: true,

  /*
   * Forces Google to return a new authorization code
   * when refreshing the user's Google credentials.
   */
  forceCodeForRefreshToken: true,
});

export default GoogleSignin;