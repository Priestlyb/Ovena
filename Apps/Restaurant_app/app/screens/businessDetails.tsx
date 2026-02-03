import React from 'react';
import { SafeAreaView, ScrollView, Text, TouchableOpacity } from 'react-native';
import { CustomInput } from '@/components/CustomInput';
import { CustomDropdown } from '@/components/CustomDropDown';
import { PhoneInput } from '@/components/PhoneInput';
import { styles } from '@/constants/styles';
import { PageProps } from '@/types';
import { ArrowLeft } from 'lucide-react-native';

const BusinessDetailsPage: React.FC<PageProps> = ({ data, setData, onNext, onBack }) => {
  if (!data || !setData) return null;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
            <ArrowLeft />
        </TouchableOpacity>

        <Text style={styles.pageTitle}>Begin your Ovena experience</Text>

        <CustomInput
          label="Business Name"
          placeholder="e.g Burger King"
          value={data.businessName}
          onChange={(val) => setData({ ...data, businessName: val })}
          required
        />

        <CustomDropdown
          label="Business Type"
          options={data.businessTypes}
          placeholder="Select type"
          value={data.businessType}
          onChange={(val) => setData({ ...data, businessType: val })}
          required
        />

        <CustomDropdown
          label="Is your business registered?"
          options={data.registrationOptions}
          placeholder="Select option"
          value={data.isRegistered}
          onChange={(val) => setData({ ...data, isRegistered: val })}
          required
        />

        <CustomInput
          label="Email address"
          placeholder="e.g Maxfood@pack.com"
          value={data.email}
          onChange={(val) => setData({ ...data, email: val })}
          required
          type="email"
        />

        <PhoneInput
          value={data.phone}
          onChange={(val) => setData({ ...data, phone: val })}
          required
        />

        <CustomInput
          label="Full Name"
          placeholder="e.g Clinton Bassey"
          value={data.fullName}
          onChange={(val) => setData({ ...data, fullName: val })}
          required
        />

        <TouchableOpacity style={styles.continueBtn} onPress={onNext} activeOpacity={0.8}>
          <Text style={styles.continueBtnText}>Continue</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default BusinessDetailsPage;
