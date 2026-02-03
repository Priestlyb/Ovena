import React, { useState } from 'react';
import { SafeAreaView, ScrollView, Text, TouchableOpacity } from 'react-native';
import { FileUpload } from '@/components/FIleUpload';
import { CustomInput } from '@/components/CustomInput';
import { CustomDropdown } from '@/components/CustomDropDown';
import { styles } from '@/constants/styles';
import { PageProps } from '@/types';
import { ArrowLeft } from 'lucide-react-native';

const BusinessDocumentsPage: React.FC<PageProps> = ({ data, setData, onNext, onBack }) => {
  const [uploadedFile, setUploadedFile] = useState<any>(null);

  if (!data || !setData) return null;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <ArrowLeft />
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
          options={data.businessTypes}
          placeholder="Limited Liability Company"
          value={data.docBusinessType}
          onChange={(val) => setData({ ...data, docBusinessType: val })}
          required
        />

        <CustomInput
          label="Registered Business Name"
          placeholder="e.g Pristina mall"
          value={data.registeredBusinessName}
          onChange={(val) => setData({ ...data, registeredBusinessName: val })}
          required
        />

        <CustomInput
          label="Tax Identification Number"
          placeholder="e.g Ovena123456789"
          value={data.taxId}
          onChange={(val) => setData({ ...data, taxId: val })}
          required
        />

        <CustomInput
          label="RC Number"
          placeholder="e.g 123456789"
          value={data.rcNumber}
          onChange={(val) => setData({ ...data, rcNumber: val })}
          required
        />

        <TouchableOpacity style={styles.continueBtn} onPress={onNext} activeOpacity={0.8}>
          <Text style={styles.continueBtnText}>Continue</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default BusinessDocumentsPage;