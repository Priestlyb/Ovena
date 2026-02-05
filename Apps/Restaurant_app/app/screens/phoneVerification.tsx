// phoneVerification.tsx - Updated version
import React, { useState } from 'react';
import { SafeAreaView, View, Text, TextInput, TouchableOpacity } from 'react-native';
import { styles } from '@/constants/styles';
import { PageProps } from '@/types';
import { ArrowLeft } from 'lucide-react-native';

/**
 * Page 5: Phone Verification
 */
const PhoneVerificationPage1: React.FC<PageProps> = ({ data, setData, onNext, onBack }) => {
  // Initialize with existing phone data if available
  const [phoneNumber, setPhoneNumber] = useState(data?.phone || '');

  const handleContinue = () => {
    // Save the phone number to form data before proceeding
    if (setData && data) {
      setData({ ...data, phone: phoneNumber });
    }
    onNext?.();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.phoneVerificationContainer}>
        <View style={styles.phoneVerificationHeader}>
          <TouchableOpacity style={styles.phoneVerificationBackBtn} onPress={onBack}>
            <ArrowLeft/>
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
};

export default PhoneVerificationPage1;