// phoneVerification2.tsx - Updated with SuperForm2 integration
import React, { useState } from 'react';
import { SafeAreaView, View, Text, TouchableOpacity } from 'react-native';
import { OTPInput } from '@/components/OtpInput';
import { styles } from '@/constants/styles';
import { ArrowLeft } from 'lucide-react-native';
import { SuperForm2PageProps } from '@/types';

interface PhoneVerificationPage2Props extends SuperForm2PageProps {
  phoneNumber?: string;
}

const PhoneVerificationPage2: React.FC<PhoneVerificationPage2Props> = ({ 
  data,
  setData,
  phoneNumber,
  onNext, 
  onBack 
}) => {
  const [otp, setOTP] = useState(data?.otp || '');

  const handleContinue = () => {
    // Save OTP before proceeding
    if (setData && data) {
      setData({
        ...data,
        otp,
      });
    }
    onNext?.();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.phoneVerificationContainer}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <ArrowLeft size={24} color="#000" />
        </TouchableOpacity>

        <View style={styles.phoneVerificationContent}>
          <Text style={styles.phoneVerificationTitle}>Verify your phone number</Text>
          <Text style={styles.phoneVerificationSubtitle}>Check your Inbox for the code.</Text>
          <Text style={styles.phoneVerificationNumber}>{phoneNumber || data?.phone || '{user_Phone-number}'}</Text>

          <View style={styles.otpWrapper}>
            <OTPInput value={otp} onChange={setOTP} length={4} />
          </View>

          <View style={styles.phoneVerificationResendSection}>
            <Text style={styles.phoneVerificationResendText}>No code in your inbox?</Text>
            <TouchableOpacity onPress={() => console.log('Resend OTP')}>
              <Text style={styles.phoneVerificationResendLink}>Tap to resend OTP</Text>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity 
          style={styles.phoneVerificationContinueBtn} 
          onPress={handleContinue} 
          activeOpacity={0.8}
        >
          <Text style={styles.phoneVerificationContinueBtnText}>Continue</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default PhoneVerificationPage2;