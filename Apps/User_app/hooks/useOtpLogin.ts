import { useEffect, useRef, useState } from "react";
import { TextInput, Alert } from "react-native";
import { useRouter } from "expo-router";

const BASE_URL = "https://ovena-backend-production.up.railway.app/api";

type UseOtpProps = {
  length?: number;
  phone: string;
  onVerified?: () => void;
  onComplete?: (code: string) => void;
};

export function useOtpLogin({
  length = 6,
  phone,
  onVerified,
  onComplete,
}: UseOtpProps) {
  /* =========================
     OTP INPUT STATE
  ========================= */
  const [otp, setOtp] = useState<string[]>(Array(length).fill(""));
  const [focusedIndex, setFocusedIndex] = useState<number>(0);
  const inputs = useRef<Array<TextInput | null>>([]);

  const isComplete = otp.every((digit) => digit !== "");

  /* =========================
     LOADING STATES
  ========================= */
  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);

  /* =========================
     RESEND TIMER
  ========================= */
  const [cooldown, setCooldown] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const router = useRouter();

  /* =========================
     PHONE FORMATTERS
  ========================= */

  // For SEND OTP → +234...
  const formatPhoneWithPlus = (input: string) => {
    let formatted = input.trim();

    if (formatted.startsWith("+234")) return formatted;

    if (formatted.startsWith("234")) return `+${formatted}`;

    if (formatted.startsWith("0")) {
      return `+234${formatted.slice(1)}`;
    }

    return `+234${formatted}`;
  };

  // For VERIFY OTP → 234...
  const formatPhoneNoPlus = (input: string) => {
    let formatted = input.trim();

    if (formatted.startsWith("+234")) {
      return formatted.slice(1);
    }

    if (formatted.startsWith("0")) {
      return `234${formatted.slice(1)}`;
    }

    if (!formatted.startsWith("234")) {
      return `234${formatted}`;
    }

    return formatted;
  };

  useEffect(() => {
    inputs.current[0]?.focus();
  }, []);

  /* =========================
     AUTO VERIFY WHEN COMPLETE
  ========================= */
  useEffect(() => {
    if (isComplete) {
      const code = otp.join("");

      if (onComplete) {
        onComplete(code);
      } else {
        verifyOtp();
      }
    }
  }, [otp]);

  /* =========================
     TIMER COUNTDOWN
  ========================= */
  useEffect(() => {
    if (cooldown <= 0) return;

    timerRef.current = setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [cooldown]);

  /* =========================
     INPUT HANDLERS
  ========================= */
  const handleChange = (text: string, index: number) => {
    if (!/^\d*$/.test(text)) return;

    if (text.length > 1) {
      const pasted = text.slice(0, length).split("");
      const newOtp = [...otp];

      pasted.forEach((digit, i) => {
        if (i < length) newOtp[i] = digit;
      });

      setOtp(newOtp);
      inputs.current[Math.min(pasted.length - 1, length - 1)]?.focus();
      return;
    }

    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    if (text && index < length - 1) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleBackspace = (index: number) => {
    if (otp[index] === "" && index > 0) {
      inputs.current[index - 1]?.focus();
    }

    const newOtp = [...otp];
    newOtp[index] = "";
    setOtp(newOtp);
  };

  const resetOtp = () => {
    setOtp(Array(length).fill(""));
    inputs.current[0]?.focus();
  };

  /* =========================
     SAFE JSON PARSER
  ========================= */
  const parseResponse = async (res: Response) => {
    const text = await res.text();
    console.log("RAW RESPONSE:", text);

    try {
      return JSON.parse(text);
    } catch {
      throw new Error("Server returned invalid response");
    }
  };

  /* =========================
     SEND OTP
  ========================= */
  const sendOtp = async () => {
    try {
      setSending(true);

      const formattedPhone = formatPhoneWithPlus(phone);
      console.log("Sending OTP to:", formattedPhone);

      const res = await fetch(`${BASE_URL}/accounts/send-otp/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone_number: formattedPhone,
        }),
      });

      const data = await parseResponse(res);
      console.log("OTP response:", data);

      if (!res.ok) {
        throw new Error(data?.message || "Failed to send OTP");
      }

      setCooldown(60);

      router.push({
        pathname: "/otp",
        params: { phone: formattedPhone },
      });
    } catch (err: any) {
      console.error("OTP error:", err.message);
      Alert.alert("Error", err.message);
    } finally {
      setSending(false);
    }
  };

  /* =========================
     VERIFY OTP
  ========================= */
  const verifyOtp = async () => {
    try {
      setVerifying(true);

      const formattedPhone = formatPhoneNoPlus(phone);
      console.log("Verifying OTP for:", formattedPhone);

      const res = await fetch(`${BASE_URL}/accounts/verify-otp/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone_number: formattedPhone,
          otp_code: otp.join(""),
        }),
      });

      const data = await parseResponse(res);

      if (!res.ok) {
        throw new Error(data?.message || "Invalid OTP");
      }

      console.log("VERIFY SUCCESS:", data);

      onVerified?.();
    } catch (err: any) {
      console.log("VERIFY ERROR:", err.message);
      Alert.alert("Verification Failed", err.message);
      resetOtp();
    } finally {
      setVerifying(false);
    }
  };

  return {
    otp,
    setOtp,
    inputs,
    focusedIndex,
    setFocusedIndex,
    isComplete,

    handleChange,
    handleBackspace,
    resetOtp,

    sendOtp,
    verifyOtp,

    sending,
    verifying,
    cooldown,
    canResend: cooldown === 0,
  };
}