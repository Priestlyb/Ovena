import React, { useEffect, useState } from "react";

import { ActivityIndicator, Modal, TouchableOpacity, View } from "react-native";

import { CustomInput } from "@/components/CustomInput";
import { Spacer } from "@/components/atoms/Spacer";
import { Text } from "@/components/atoms/Text";
import { Card } from "@/components/molecules/Card";
import { styles } from "@/constants/styles";

type Result = {
  success: boolean;
  errors?: Record<string, string>;
};

type Props = {
  visible: boolean;
  loading: boolean;
  onSendOtp: (email: string) => Promise<Result>;
  onResetPassword: (
    email: string,
    otp: string,
    password: string,
  ) => Promise<Result>;
  onClose: () => void;
};

export const ResetPasswordModal = ({
  visible,
  loading,
  onSendOtp,
  onResetPassword,
  onClose,
}: Props) => {
  const [step, setStep] = useState<1 | 2>(1);

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");

  const [errors, setErrors] = useState<Record<string, string | undefined>>({});

  useEffect(() => {
    if (!visible) {
      resetState();
    }
  }, [visible]);

  const resetState = () => {
    setStep(1);

    setEmail("");
    setOtp("");
    setPassword("");

    setErrors({});
  };

  const handleSendOtp = async () => {
    const res = await onSendOtp(email.trim());

    if (res.success) {
      setErrors({});
      setStep(2);
    } else {
      setErrors(res.errors || {});
    }
  };

  const handleResetPassword = async () => {
    const res = await onResetPassword(email.trim(), otp.trim(), password);

    if (res.success) {
      resetState();
      onClose();
    } else {
      setErrors(res.errors || {});
    }
  };

  const handleClose = () => {
    resetState();
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={handleClose}
    >
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          padding: 20,
          backgroundColor: "#fff",
        }}
      >
        <Card>
          <Text variant="h3" align="center">
            {step === 1 ? "Reset Password" : "Verify OTP"}
          </Text>

          <Spacer size="sm" />

          <Text align="center" color="secondary">
            {step === 1
              ? "Enter the email associated with your account to receive an OTP."
              : "Enter the OTP sent to your email and your new password."}
          </Text>

          <Spacer size="xl" />

          {step === 1 ? (
            <>
              <CustomInput
                label="Email Address"
                placeholder="Enter your email"
                value={email}
                onChange={(value) => {
                  setEmail(value);
                  setErrors((prev) => {
                    const next = { ...prev };
                    delete next.email;
                    return next;
                  });
                }}
                type="email"
              />

              {!!errors.email && (
                <>
                  <Spacer size="xs" />
                  <Text color="error">{errors.email}</Text>
                </>
              )}

              <Spacer size="xl" />

              <TouchableOpacity
                style={styles.continueBtn}
                onPress={handleSendOtp}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.continueBtnText}>Send OTP</Text>
                )}
              </TouchableOpacity>
            </>
          ) : (
            <>
              <Text align="center" style={{ fontSize: 16, fontWeight: "bold" }}>
                {email}
              </Text>

              <Spacer size="lg" />

              <CustomInput
                label="OTP Code"
                placeholder="Enter OTP"
                value={otp}
                onChange={(value) => {
                  setOtp(value);
                  setErrors((prev) => ({
                    ...prev,
                    otp: undefined,
                  }));
                }}
                type="number"
              />

              {!!errors.otp && (
                <>
                  <Spacer size="xs" />
                  <Text color="error">{errors.otp}</Text>
                </>
              )}

              <Spacer size="md" />

              <CustomInput
                label="New Password"
                placeholder="Enter new password"
                value={password}
                onChange={(value) => {
                  setPassword(value);
                  setErrors((prev) => ({
                    ...prev,
                    password: undefined,
                  }));
                }}
                type="password"
              />

              {!!errors.password && (
                <>
                  <Spacer size="xs" />
                  <Text color="error">{errors.password}</Text>
                </>
              )}

              <Spacer size="xl" />

              <TouchableOpacity
                style={styles.continueBtn}
                onPress={handleResetPassword}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.continueBtnText}>Reset Password</Text>
                )}
              </TouchableOpacity>
            </>
          )}

          <Spacer size="md" />

          <TouchableOpacity onPress={handleClose} disabled={loading}>
            <Text align="center">Cancel</Text>
          </TouchableOpacity>
        </Card>
      </View>
    </Modal>
  );
};
