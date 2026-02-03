import React from 'react';
import { SafeAreaView, ScrollView, Text, TouchableOpacity } from 'react-native';
import { CustomDropdown } from '@/components/CustomDropDown';
import { CustomInput } from '@/components/CustomInput';
import { styles } from '@/constants/styles';
import { PageProps } from '@/types';
import { ArrowLeft } from 'lucide-react-native';

const LocationPage: React.FC<PageProps> = ({ data, setData, onNext, onBack }) => {
  if (!data || !setData) return null;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={[styles.container, styles.locationContainer]} showsVerticalScrollIndicator={false}>
   
        <Text style={styles.pageTitle}>Pinpoint your current food Spot</Text>

        <CustomDropdown
          label="Country"
          options={data.countries}
          placeholder="Select Country"
          value={data.selectedCountry}
          onChange={(val) => setData({ ...data, selectedCountry: val })}
        />

        <CustomInput
          label="Business Address"
          placeholder="Enter address"
          value={data.businessAddress}
          onChange={(val) => setData({ ...data, businessAddress: val })}
        />

        <TouchableOpacity style={styles.continueBtn} onPress={onNext} activeOpacity={0.8}>
          <Text style={styles.continueBtnText}>Continue</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default LocationPage;