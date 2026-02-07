// app/superForm2/phone-verification.tsx - Group 1, Page 2
import React, { useState } from 'react';
import { SafeAreaView, View, Text, TextInput, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { styles } from '@/constants/styles';

export default function PhoneVerificationPage() {
  const router = useRouter();
  const [phoneNumber, setPhoneNumber] = useState('');

  const handleContinue = () => {
    console.log('[PhoneVerification] Navigating to Phone OTP');
    // Pass phone number as query param
    router.push({
      pathname: '/superForm2/phone-otp',
      params: { phoneNumber },
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.phoneVerificationContainer}>
        <View style={styles.phoneVerificationHeader}>
          <TouchableOpacity style={styles.phoneVerificationBackBtn} onPress={() => router.back()}>
            <ArrowLeft size={24} color="#111827" />
          </TouchableOpacity>
          <Text style={styles.phoneVerificationTitle}>Complete your profile</Text>
        </View>

        <View style={styles.phoneVerificationContent}>
          <Text style={styles.phoneVerificationSectionTitle}>Verify your phone number</Text>

          <View style={styles.phoneVerificationInputContainer}>
            <View style={styles.labelRow}>
              <Text style={styles.label}>Contact number</Text>
              <Text style={styles.required}> *</Text>
            </View>
            <TextInput
              style={styles.phoneVerificationInput}
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              placeholder="e.g 07XXXXXXXXX"
              placeholderTextColor="#9CA3AF"
              keyboardType="phone-pad"
            />
          </View>

          <View style={styles.phoneVerificationInfoBox}>
            <View style={styles.phoneVerificationInfoIconCircle}>
              <Text style={styles.phoneVerificationInfoIconText}>i</Text>
            </View>
            <Text style={styles.phoneVerificationInfoText}>
              This number will be used to communicate with you
            </Text>
          </View>
        </View>

        <TouchableOpacity 
          style={styles.phoneVerificationContinueBtn} 
          onPress={handleContinue} 
          activeOpacity={0.8}
        >
          <Text style={styles.continueBtnText}>Continue</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}