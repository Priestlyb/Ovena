import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from "react-native";

import { useRouter } from "expo-router";
import { ArrowLeft } from "lucide-react-native";

import { Spacer } from "@/components/atoms/Spacer";
import { Text } from "@/components/atoms/Text";
import { styles } from "@/constants/styles";

import { useAuthRedirect } from "@/hooks/loginPage/useAuthRedirect";
import { useDeviceId } from "@/hooks/loginPage/useDeviceId";
import { useLogin } from "@/hooks/loginPage/useLogin";

import FeedbackModal from "@/components/FeedbackModal";
import { AdminLoginForm } from "@/components/login-page/AdminLoginForm";
import { LoginToggle } from "@/components/login-page/LoginToggle";
import { ResetPasswordModal } from "@/components/login-page/ResetPasswordModal";
import { VendorApprovalForm } from "@/components/login-page/VendorApprovalForm";

type Variant = "success" | "error" | "warning" | "info";

type Errors = {
  phone?: string;
  password?: string;
  otp?: string;
  username?: string;
  general?: string;
};

export default function LoginPage() {
  const router = useRouter();

  useAuthRedirect();
  const deviceId = useDeviceId();

  // ----------------------
  // FEEDBACK STATE
  // ----------------------
  const [feedback, setFeedback] = useState<{
    visible: boolean;
    message: string;
    variant: Variant;
  }>({
    visible: false,
    message: "",
    variant: "info",
  });

  const showFeedback = (message: string, variant: Variant = "error") => {
    setFeedback({
      visible: true,
      message,
      variant,
    });
  };

  const {
    loading,
    handleLogin,
    handleStaffLogin,
    handleVendorApproval,
    handleResetPassword,
  } = useLogin(deviceId, showFeedback);

  // ----------------------
  // FORM STATE
  // ----------------------
  const [loginAs, setLoginAs] = useState<"admin" | "vendor">("admin");
  const [showVendorUI, setShowVendorUI] = useState(false);

  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const [otp, setOtp] = useState("");
  const [vendorPhone, setVendorPhone] = useState("");
  const [username, setUsername] = useState("");

  const [resetVisible, setResetVisible] = useState(false);
  const [resetPhone, setResetPhone] = useState("");

  const [errors, setErrors] = useState<Errors>({});

  // ----------------------
  // HANDLERS
  // ----------------------
  const onLoginPress = async () => {
    const res = await handleLogin(phone, password, loginAs);

    if (!res.success) {
      setErrors(res.errors || {});
    } else {
      setErrors({});
    }
  };

  const onVendorSubmit = async () => {
    const res = await handleVendorApproval(otp, vendorPhone, username);

    if (!res.success) {
      setErrors(res.errors || {});
    } else {
      setErrors({});
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView style={styles.container}>
          <TouchableOpacity onPress={() => router.push("/")}>
            <ArrowLeft size={24} />
          </TouchableOpacity>

          <Spacer size="lg" />

          <Text align="center" variant="h2">
            Welcome back
          </Text>

          <Spacer size="lg" />

          <LoginToggle
            loginAs={loginAs}
            setLoginAs={setLoginAs}
            onVendorPress={async () => {
              setLoginAs("vendor");

              const res = await handleStaffLogin();
              setShowVendorUI(!res.success);
            }}
          />

          <Spacer size="xl" />

          {loginAs === "admin" && (
            <AdminLoginForm
              phone={phone}
              setPhone={(val: string) => {
                setPhone(val);
                setErrors((prev) => ({ ...prev, phone: undefined }));
              }}
              password={password}
              setPassword={(val: string) => {
                setPassword(val);
                setErrors((prev) => ({ ...prev, password: undefined }));
              }}
              loading={loading}
              errors={errors}
              onLogin={onLoginPress}
              onReset={() =>
                phone ? handleResetPassword(phone) : setResetVisible(true)
              }
            />
          )}

          {loginAs === "vendor" && showVendorUI && (
            <VendorApprovalForm
              otp={otp}
              setOtp={(val: string) => {
                setOtp(val);
                setErrors((prev) => ({ ...prev, otp: undefined }));
              }}
              phone={vendorPhone}
              setPhone={(val: string) => {
                setVendorPhone(val);
                setErrors((prev) => ({ ...prev, phone: undefined }));
              }}
              username={username}
              setUsername={(val: string) => {
                setUsername(val);
                setErrors((prev) => ({ ...prev, username: undefined }));
              }}
              loading={loading}
              onSubmit={onVendorSubmit}
              errors={errors}
            />
          )}

          {/* RESET MODAL 851147 */}
          <ResetPasswordModal
            visible={resetVisible}
            phone={resetPhone}
            setPhone={setResetPhone}
            onSubmit={() => handleResetPassword(resetPhone)}
            onClose={() => setResetVisible(false)}
          />

          <FeedbackModal
            visible={feedback.visible}
            message={feedback.message}
            variant={feedback.variant}
            onClose={() => setFeedback((prev) => ({ ...prev, visible: false }))}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
