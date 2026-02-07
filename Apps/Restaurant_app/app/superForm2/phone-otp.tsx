// app/superForm2/phone-otp.tsx - Group 1, Page 3 (LAST PAGE OF GROUP 1)
import React, { useState } from 'react';
import { SafeAreaView, View, Text, TouchableOpacity } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { OTPInput } from '@/components/OtpInput';
import { styles } from '@/constants/styles';
import { useCompletionStore } from '@/stores/completionStore';

export default function PhoneOTPPage() {
  const router = useRouter();
  const { phoneNumber } = useLocalSearchParams<{ phoneNumber: string }>();
  const [otp, setOTP] = useState('');
  const markGroupComplete = useCompletionStore((state) => state.markGroupComplete);

  const handleContinue = () => {
    console.log('[PhoneOTP] Marking Group 1 (verifyBusiness) as complete');
    
    // Mark Group 1 as complete
    markGroupComplete('verifyBusiness');
    
    // Return to checklist
    console.log('[PhoneOTP] Returning to checklist');
    router.push('/superForm2/checklist');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.phoneVerificationContainer}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={24} color="#000" />
        </TouchableOpacity>

        <View style={styles.phoneVerificationContent}>
          <Text style={styles.phoneVerificationTitle}>Verify your phone number</Text>
          <Text style={styles.phoneVerificationSubtitle}>Check your Inbox for the code.</Text>
          <Text style={styles.phoneVerificationNumber}>{phoneNumber || '{user_Phone-number}'}</Text>

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
}