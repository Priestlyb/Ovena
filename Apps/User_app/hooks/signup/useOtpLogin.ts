
import { useEffect, useRef, useState } from "react";
import { TextInput, Alert } from "react-native";
import { useRouter } from "expo-router";

import { useAuth } from "@/context/AuthContext";

type TimerId = ReturnType<typeof setInterval>;

const BASE_URL =
  "https://ovena-backend-production.up.railway.app/api";

type UseOtpProps = {
  length?: number;
  phone: string;
  pinId?: string;
  onVerified?: () => void;
  onComplete?: (code: string) => void;
};

export function useOtpLogin({
  length = 6,
  phone,
  pinId: initialPinId = "",
  onVerified,
  onComplete,
}: UseOtpProps) {
  /* =========================================================
     STATE
  ========================================================= */

  const [otp, setOtp] = useState<string[]>(
    Array(length).fill("")
  );

  const [focusedIndex, setFocusedIndex] = useState(0);

  const inputs = useRef<Array<TextInput | null>>([]);

  const [pinId, setPinId] = useState(initialPinId);

  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  const timerRef = useRef<TimerId | null>(null);

  /*
   * Prevent auto verification from being triggered
   * multiple times for the same OTP.
   */
  const verificationStartedRef = useRef(false);

  const router = useRouter();

  const { loginWithOtp } = useAuth();

  const isComplete = otp.every((digit) => digit !== "");

  /* =========================================================
     PHONE FORMAT
  ========================================================= */

  const formatPhoneWithPlus = (input: string) => {
    let formatted = input.trim();

    if (formatted.startsWith("+234")) {
      return formatted;
    }

    if (formatted.startsWith("234")) {
      return `+${formatted}`;
    }

    if (formatted.startsWith("0")) {
      return `+234${formatted.slice(1)}`;
    }

    return `+234${formatted}`;
  };

  /* =========================================================
     SAFE RESPONSE PARSER
  ========================================================= */

  const parseResponse = async (res: Response) => {
    const text = await res.text();

    try {
      return JSON.parse(text);
    } catch (error) {
      console.log("NON-JSON RESPONSE:", text);

      throw new Error(
        text || "The server returned an invalid response."
      );
    }
  };

  /* =========================================================
     SEND OTP
  ========================================================= */

  const sendOtp = async () => {
    try {
      setSending(true);

      const formattedPhone =
        formatPhoneWithPlus(phone);

      const res = await fetch(
        `${BASE_URL}/accounts/send-otp/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            phone_number: formattedPhone,
          }),
        }
      );

      const data = await parseResponse(res);

      if (!res.ok) {
        throw new Error(
          data?.detail ||
          data?.message ||
          "Failed to send OTP"
        );
      }

      if (!data?.pin_id) {
        throw new Error(
          "Missing pin_id from server"
        );
      }

      setPinId(data.pin_id);

      setCooldown(60);

      /*
       * Navigate to the OTP screen.
       *
       * OTP itself is still a public route, so this
       * navigation is fine.
       */
      router.push({
        pathname: "/otp",
        params: {
          phone: formattedPhone,
          pin_id: String(data.pin_id),
        },
      });
    } catch (err: any) {
      console.log(
        "SEND OTP ERROR:",
        err?.message
      );

      Alert.alert(
        "Error",
        err?.message ||
        "Failed to send OTP"
      );
    } finally {
      setSending(false);
    }
  };

  /* =========================================================
     VERIFY OTP
  ========================================================= */

  const verifyOtp = async () => {
    /*
     * Prevent multiple verification requests.
     */
    if (verifying) {
      return;
    }

    try {
      setVerifying(true);

      if (!pinId) {
        throw new Error("Missing pin ID");
      }

      const code = otp.join("");

      if (code.length !== length) {
        throw new Error(
          `Please enter the ${length}-digit OTP`
        );
      }

      const formattedPhone =
        formatPhoneWithPlus(phone);

      const res = await fetch(
        `${BASE_URL}/accounts/verify-otp/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            phone_number: formattedPhone,
            pin_id: pinId,
            pin: code,
          }),
        }
      );

      const data = await parseResponse(res);

      console.log(
        "VERIFY RESPONSE:",
        data
      );

      if (!res.ok) {
        throw new Error(
          data?.detail ||
          data?.message ||
          "Invalid OTP"
        );
      }

      console.log(
        "VERIFY SUCCESS:",
        data
      );

      if (!data?.access) {
        throw new Error(
          "Missing access token"
        );
      }

      /*
       * Save the authenticated session.
       *
       * loginWithOtp() should update authStatus:
       *
       * new user  -> "otp_signup"
       * old user  -> "authenticated"
       */
      await loginWithOtp(
        data.access,
        data.refresh || null,
        data.is_new_user || false
      );

      /*
       * If the caller supplied its own callback,
       * let it control what happens next.
       */
      if (onVerified) {
        onVerified();
        return;
      }

      /*
       * IMPORTANT:
       *
       * We do NOT navigate to otpSignUpForm here.
       *
       * AuthContext changes authStatus to:
       *
       * "otp_signup"
       *
       * RootLayout/RouteState sees that state and
       * redirects to:
       *
       * /otpSignUpForm
       */
      if (!data.is_new_user) {
        router.replace("/home");
      }
    } catch (err: any) {
      console.log(
        "VERIFY ERROR:",
        err?.message
      );

      Alert.alert(
        "Verification Failed",
        err?.message ||
        "Unable to verify OTP"
      );

      /*
       * Reset OTP after failed verification.
       */
      setOtp(Array(length).fill(""));

      /*
       * Allow another verification attempt.
       */
      verificationStartedRef.current = false;

      /*
       * Focus the first OTP input.
       */
      setTimeout(() => {
        inputs.current[0]?.focus();
      }, 100);
    } finally {
      setVerifying(false);
    }
  };

  /* =========================================================
     RESEND OTP
  ========================================================= */

  const resendOtp = async () => {
    /*
     * Prevent resend while cooldown is active.
     */
    if (cooldown > 0 || sending) {
      return;
    }

    try {
      setSending(true);

      const formattedPhone =
        formatPhoneWithPlus(phone);

      const res = await fetch(
        `${BASE_URL}/accounts/send-otp/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            phone_number: formattedPhone,
          }),
        }
      );

      const data = await parseResponse(res);

      if (!res.ok) {
        throw new Error(
          data?.detail ||
          data?.message ||
          "Failed to resend OTP"
        );
      }

      if (!data?.pin_id) {
        throw new Error(
          "Missing pin_id"
        );
      }

      /*
       * Replace the old pin ID with the new one.
       */
      setPinId(data.pin_id);

      /*
       * Start a new cooldown.
       */
      setCooldown(60);

      /*
       * Reset the OTP fields.
       */
      setOtp(Array(length).fill(""));

      verificationStartedRef.current = false;

      Alert.alert(
        "Success",
        "OTP resent"
      );
    } catch (err: any) {
      console.log(
        "RESEND ERROR:",
        err?.message
      );

      Alert.alert(
        "Error",
        err?.message ||
        "Failed to resend OTP"
      );
    } finally {
      setSending(false);
    }
  };

  /* =========================================================
     AUTO VERIFY
  ========================================================= */

  useEffect(() => {
    /*
     * OTP is not complete yet.
     */
    if (!isComplete) {
      verificationStartedRef.current = false;
      return;
    }

    /*
     * Prevent duplicate verification calls.
     */
    if (verificationStartedRef.current) {
      return;
    }

    /*
     * Do not start another verification while
     * one is already running.
     */
    if (verifying) {
      return;
    }

    const code = otp.join("");

    /*
     * Mark verification as started before
     * calling the verification function.
     */
    verificationStartedRef.current = true;

    if (onComplete) {
      onComplete(code);
      return;
    }

    verifyOtp();
  }, [
    otp,
    isComplete,
    verifying,
    onComplete,
  ]);

  /* =========================================================
     TIMER
  ========================================================= */

  useEffect(() => {
    /*
     * Clear any existing timer first.
     */
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    if (cooldown <= 0) {
      return;
    }

    timerRef.current = setInterval(() => {
      setCooldown((previous) => {
        if (previous <= 1) {
          if (timerRef.current) {
            clearInterval(
              timerRef.current
            );

            timerRef.current = null;
          }

          return 0;
        }

        return previous - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(
          timerRef.current
        );

        timerRef.current = null;
      }
    };
  }, [cooldown]);

  /* =========================================================
     CLEANUP
  ========================================================= */

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(
          timerRef.current
        );

        timerRef.current = null;
      }
    };
  }, []);

  /* =========================================================
     RETURN
  ========================================================= */

  return {
    otp,
    setOtp,

    inputs,

    focusedIndex,
    setFocusedIndex,

    isComplete,

    /* =====================================================
       OTP CHANGE
    ===================================================== */

    handleChange: (
      text: string,
      index: number
    ) => {
      /*
       * Only allow numbers.
       */
      if (!/^\d*$/.test(text)) {
        return;
      }

      /*
       * Handle pasted OTP.
       */
      if (text.length > 1) {
        const pasted = text
          .slice(0, length)
          .split("");

        const newOtp = [...otp];

        pasted.forEach(
          (digit, i) => {
            if (i < length) {
              newOtp[i] = digit;
            }
          }
        );

        setOtp(newOtp);

        return;
      }

      /*
       * Handle normal single-digit input.
       */
      const newOtp = [...otp];

      newOtp[index] = text;

      setOtp(newOtp);
    },

    /* =====================================================
       BACKSPACE
    ===================================================== */

    handleBackspace: (
      index: number
    ) => {
      const newOtp = [...otp];

      newOtp[index] = "";

      setOtp(newOtp);

      verificationStartedRef.current =
        false;
    },

    /* =====================================================
       RESET OTP
    ===================================================== */

    resetOtp: () => {
      setOtp(
        Array(length).fill("")
      );

      verificationStartedRef.current =
        false;
    },

    /* =====================================================
       ACTIONS
    ===================================================== */

    sendOtp,
    verifyOtp,
    resendOtp,

    /* =====================================================
       STATUS
    ===================================================== */

    sending,
    verifying,

    cooldown,

    canResend:
      cooldown === 0 &&
      !sending,

    pinId,
  };
}