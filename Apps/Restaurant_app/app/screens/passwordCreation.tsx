import React from 'react';
import { SafeAreaView, ScrollView, Text, TouchableOpacity } from 'react-native';
import { CustomInput } from '@/components/CustomInput';
import { styles } from '@/constants/styles';
import { PageProps } from '@/types';
import { ArrowLeft } from 'lucide-react-native';

const PasswordPage: React.FC<PageProps> = ({ data, setData, onNext, onBack }) => {
  if (!data || !setData) return null;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <ArrowLeft />
        </TouchableOpacity>

        <Text style={styles.pageTitle}>Begin your Ovena experience</Text>

        <CustomInput
          label="Create Password"
          placeholder="at least 8 characters"
          value={data.password}
          onChange={(val) => setData({ ...data, password: val })}
          type="password"
        />

        <CustomInput
          label="Confirm password"
          placeholder="at least 8 characters"
          value={data.confirmPassword}
          onChange={(val) => setData({ ...data, confirmPassword: val })}
          type="password"
        />

        <TouchableOpacity style={styles.continueBtn} onPress={onNext} activeOpacity={0.8}>
          <Text style={styles.continueBtnText}>Continue</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default PasswordPage;