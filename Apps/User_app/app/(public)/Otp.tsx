import { useEffect, useRef, useState } from "react";
import { TextInput, Alert } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useAuth } from "@/context/AuthContext";
import OtpScreen from "@/components/OtpScreen";

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
  const [otp, setOtp] = useState<string[]>(Array(length).fill(""));
  const [focusedIndex, setFocusedIndex] = useState<number>(0);
  const inputs = useRef<Array<TextInput | null>>([]);
  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const router = useRouter();
  const isComplete = otp.every((digit) => digit !== "");

  const { loginWithOtp, logout } = useAuth();

  /* =========================
     PHONE FORMATTERS
  ========================= */
  const formatPhoneWithPlus = (input: string) => {
    let formatted = input.trim();
    if (formatted.startsWith("+234")) return formatted;
    if (formatted.startsWith("234")) return `+${formatted}`;
    if (formatted.startsWith("0")) return `+234${formatted.slice(1)}`;
    return `+234${formatted}`;
  };

  const formatPhoneNoPlus = (input: string) => {
    let formatted = input.trim();
    if (formatted.startsWith("+234")) return formatted.slice(1);
    if (formatted.startsWith("0")) return `234${formatted.slice(1)}`;
    if (!formatted.startsWith("234")) return `234${formatted}`;
    return formatted;
  };

  /* =========================
     AUTO FOCUS
  ========================= */
  useEffect(() => {
    inputs.current[0]?.focus();
  }, []);

  /* =========================
     AUTO VERIFY WHEN COMPLETE
  ========================= */
  useEffect(() => {
    if (isComplete) {
      const code = otp.join("");
      if (onComplete) onComplete(code);
      else verifyOtp();
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
    if (text && index < length - 1) inputs.current[index + 1]?.focus();
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

    // If server returned HTML, bail out
    if (text.startsWith("<")) {
      throw new Error(`Server returned non-JSON response: ${res.status}`);
    }

    try {
      return JSON.parse(text);
    } catch (err) {
      throw new Error("Failed to parse JSON response");
    }
  };

  /* =========================
     SEND OTP
  ========================= */
  const sendOtp = async () => {
    try {
      setSending(true);
      const formattedPhone = formatPhoneWithPlus(phone);
      const res = await fetch(`${BASE_URL}/accounts/send-otp/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone_number: formattedPhone }),
      });

      const data = await parseResponse(res);
      if (!res.ok) throw new Error(data?.message || "Failed to send OTP");

      setCooldown(60);
      router.push({ pathname: "/otp", params: { phone: formattedPhone } });
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
      const res = await fetch(`${BASE_URL}/accounts/verify-otp/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone_number: formattedPhone,
          otp_code: otp.join(""),
        }),
      });

      const data = await parseResponse(res);
      if (!res.ok)
        throw new Error(data?.detail || data?.message || "Invalid OTP");

      console.log("VERIFY SUCCESS:", data);
      await loginWithOtp(
        data.access,
        data.refresh ?? null,
        data.is_new_user ?? true,
      );
      onVerified?.();
    } catch (err: any) {
      console.log("VERIFY ERROR:", err.message);
      Alert.alert("Verification Failed", err.message);
      resetOtp();
    } finally {
      setVerifying(false);
    }
  };

  /* =========================
     RESEND OTP
  ========================= */
  const resendOtp = async () => {
    try {
      const formattedPhone = formatPhoneWithPlus(phone);
      const res = await fetch(`${BASE_URL}/accounts/send-otp/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone_number: formattedPhone }),
      });

      const data = await parseResponse(res);
      if (!res.ok) throw new Error(data?.message || "Failed to resend OTP");
      setCooldown(60);
      console.log("RESEND SUCCESS:", data);
    } catch (err: any) {
      console.log("RESEND ERROR:", err.message);
      Alert.alert("Error", err.message);
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
    resendOtp,
    sending,
    verifying,
    cooldown,
    canResend: cooldown === 0,
  };
}

/* =========================
   OTP PAGE COMPONENT
========================= */
export default function OtpPage() {
  const { phone: rawPhone } = useLocalSearchParams<{ phone: string }>();
  const { logout } = useAuth();

  const phone =
    rawPhone && rawPhone.startsWith("+")
      ? rawPhone
      : rawPhone
        ? `+${rawPhone}`
        : null;

  if (!phone) {
    Alert.alert("Session error", "Missing phone number", [
      { text: "OK", onPress: logout },
    ]);
    return null;
  }

  const {
    otp,
    inputs,
    focusedIndex,
    handleChange,
    handleBackspace,
    resetOtp,
    verifyOtp,
    resendOtp,
    sending,
    verifying,
    cooldown,
    canResend,
  } = useOtpLogin({ phone });

  return (
    <OtpScreen
      phone={phone}
      otp={otp}
      inputs={inputs}
      focusedIndex={focusedIndex}
      onChange={handleChange}
      onBackspace={handleBackspace}
      onReset={resetOtp}
      onVerify={verifyOtp}
      onResend={resendOtp}
      sending={sending}
      verifying={verifying}
      cooldown={cooldown}
      canResend={canResend}
    />
  );
}
