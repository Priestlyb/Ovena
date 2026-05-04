import React, { useState } from "react";
import { SafeAreaView, View, Text, TouchableOpacity } from "react-native";
import { OTPInput } from "@/components/OtpInput";
import { styles } from "@/constants/styles";
import { PageProps } from "@/types";
import { ArrowLeft } from "lucide-react-native";

const EmailVerificationPage: React.FC<PageProps> = ({
  data,
  onNext,
  onBack,
}) => {
  const [otp, setOTP] = useState("");

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <ArrowLeft />
        </TouchableOpacity>

        <View style={styles.centeredContent}>
          <Text style={styles.pageTitle}>Confirm Your Identity</Text>
          <Text style={styles.subtitle}>Check your email for the code.</Text>
          <Text style={styles.emailDisplay}>
            {data?.email || "{user_email}"}
          </Text>

          <OTPInput value={otp} onChange={setOTP} />

          <View style={styles.resendSection}>
            <Text style={styles.resendText}>No code in your inbox?</Text>
            <TouchableOpacity>
              <Text style={styles.resendLink}>Tap to resend OTP</Text>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity
          style={styles.continueBtn}
          onPress={onNext}
          activeOpacity={0.8}
        >
          <Text style={styles.continueBtnText}>Verify Email</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default EmailVerificationPage;
