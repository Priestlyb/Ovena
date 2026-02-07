// app/superForm2/business-documents.tsx - Group 1, Page 1
import React, { useState } from 'react';
import { SafeAreaView, ScrollView, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { FileUpload } from '@/components/FIleUpload';
import { CustomInput } from '@/components/CustomInput';
import { CustomDropdown } from '@/components/CustomDropDown';
import { styles } from '@/constants/styles';

export default function BusinessDocumentsPage() {
  const router = useRouter();
  const [uploadedFile, setUploadedFile] = useState<any>(null);
  const [businessType, setBusinessType] = useState('');
  const [registeredName, setRegisteredName] = useState('');
  const [taxId, setTaxId] = useState('');
  const [rcNumber, setRcNumber] = useState('');

  const businessTypes = [
    'Limited Liability Company',
    'Sole Proprietorship',
    'Partnership',
    'Corporation',
  ];

  const handleContinue = () => {
    console.log('[BusinessDocuments] Navigating to Phone Verification');
    router.push('/superForm2/phone-verification');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={24} color="#111827" />
        </TouchableOpacity>

        <Text style={styles.pageTitle}>Upload your business documents</Text>
        <Text style={styles.subtitle}>
          To get started we need to confirm that you are authorized to do business in your country
        </Text>

        <FileUpload
          label="Upload Business Document"
          required
          onUpload={setUploadedFile}
        />

        <CustomDropdown
          label="Business Type"
          options={businessTypes}
          placeholder="Limited Liability Company"
          value={businessType}
          onChange={setBusinessType}
          required
        />

        <CustomInput
          label="Registered Business Name"
          placeholder="e.g Pristina mall"
          value={registeredName}
          onChange={setRegisteredName}
          required
        />

        <CustomInput
          label="Tax Identification Number"
          placeholder="e.g Ovena123456789"
          value={taxId}
          onChange={setTaxId}
          required
        />

        <CustomInput
          label="RC Number"
          placeholder="e.g 123456789"
          value={rcNumber}
          onChange={setRcNumber}
          required
        />

        <TouchableOpacity style={styles.continueBtn} onPress={handleContinue} activeOpacity={0.8}>
          <Text style={styles.continueBtnText}>Continue</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}