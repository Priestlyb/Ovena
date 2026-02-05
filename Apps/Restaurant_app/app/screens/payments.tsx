// payments.tsx - Updated with SuperForm2 integration
import React, { useState } from 'react';
import { SafeAreaView, ScrollView, View, Text, TouchableOpacity } from 'react-native';
import { CustomInput } from '@/components/CustomInput';
import { CustomDropdown } from '@/components/CustomDropDown';
import { styles } from '@/constants/styles';
import { ArrowLeft } from 'lucide-react-native';
import { SuperForm2PageProps } from '@/types';

const PaymentPage: React.FC<SuperForm2PageProps> = ({ 
  data, 
  setData, 
  onNext, 
  onBack 
}) => {
  const [selectedBank, setSelectedBank] = useState(data?.selectedBank || '');
  const [accountNumber, setAccountNumber] = useState(data?.accountNumber || '');
  const [accountName, setAccountName] = useState(data?.accountName || '');
  const [bvn, setBvn] = useState(data?.bvn || '');

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
    // Save data before proceeding
    if (setData && data) {
      setData({
        ...data,
        selectedBank,
        accountNumber,
        accountName,
        bvn,
      });
    }
    onNext?.();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <ArrowLeft />
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
};

export default PaymentPage;