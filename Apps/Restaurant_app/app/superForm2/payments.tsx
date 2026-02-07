// app/superForm2/payments.tsx - Group 3 (LAST AND ONLY PAGE OF GROUP 3)
import React, { useState } from 'react';
import { SafeAreaView, ScrollView, View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { CustomInput } from '@/components/CustomInput';
import { CustomDropdown } from '@/components/CustomDropDown';
import { styles } from '@/constants/styles';
import { useCompletionStore } from '@/stores/completionStore';

export default function PaymentsPage() {
  const router = useRouter();
  const markGroupComplete = useCompletionStore((state) => state.markGroupComplete);
  
  const [selectedBank, setSelectedBank] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountName, setAccountName] = useState('');
  const [bvn, setBvn] = useState('');

  const banks = [
    'Access Bank',
    'GTBank',
    'First Bank',
    'UBA',
    'Zenith Bank',
    'Ecobank',
    'Fidelity Bank',
    'Union Bank',
    'Stanbic IBTC',
    'Sterling Bank',
  ];

  const handleContinue = () => {
    console.log('[Payments] Marking Group 3 (setupPayments) as complete');
    
    // Mark Group 3 as complete
    markGroupComplete('setupPayments');
    
    // Return to checklist
    console.log('[Payments] Returning to checklist');
    router.push('/superForm2/checklist');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={24} color="#111827" />
        </TouchableOpacity>

        <Text style={styles.pageTitle}>Set up your payment</Text>
        <Text style={styles.subtitle}>Add you bank details</Text>

        <CustomDropdown
          label="Bank"
          options={banks}
          placeholder="Select"
          value={selectedBank}
          onChange={setSelectedBank}
          required
        />

        <CustomInput
          label="Account number"
          placeholder="e.g 04XXXXXXXx"
          value={accountNumber}
          onChange={setAccountNumber}
          required
          type="tel"
        />

        <CustomInput
          label="Account name"
          placeholder="e.g Clinton bassey"
          value={accountName}
          onChange={setAccountName}
          required
        />

        <View style={styles.inputContainer}>
          <View style={styles.labelRow}>
            <Text style={styles.label}>Bank verification number (BVN)</Text>
            <Text style={styles.required}> *</Text>
            <TouchableOpacity style={styles.infoIconSmall}>
              <Text style={styles.infoIconText}>i</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.bvnInfoBox}>
            <Text style={styles.bvnInfoText}>
              Your BVN is required to verify your identity and secure your account.
              It will not be used to access your bank account.
            </Text>
          </View>

          <View style={styles.inputWrapper}>
            <CustomInput
              placeholder="e.g 123456789"
              value={bvn}
              onChange={setBvn}
              type="tel"
            />
          </View>
        </View>

        <TouchableOpacity style={styles.continueBtn} onPress={handleContinue} activeOpacity={0.8}>
          <Text style={styles.continueBtnText}>Continue</Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}