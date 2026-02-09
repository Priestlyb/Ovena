// ResetTransactionPINPage.tsx - 3-step PIN reset flow
import React, { useState } from 'react';
import { SafeAreaView, ScrollView, View, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, MessageCircle } from 'lucide-react-native';
import { styles } from '@/constants/styles';

// Atomic Components
import { Text } from '@/components/atoms/Text';
import { Button } from '@/components/atoms/Button';
import { Spacer } from '@/components/atoms/Spacer';

// Components
import { PINInput } from '@/components/PINinput';
import { FloatingChatButton } from '@/components/FloatingChatButton';

type Step = 'verify' | 'create' | 'confirm';

export default function ResetTransactionPINPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>('verify');
  const [verificationCode, setVerificationCode] = useState(['', '', '', '']);
  const [newPIN, setNewPIN] = useState(['', '', '', '']);
  const [confirmPIN, setConfirmPIN] = useState(['', '', '', '']);

  const handleContinue = () => {
    if (step === 'verify') {
      console.log('Verification code:', verificationCode.join(''));
      setStep('create');
    } else if (step === 'create') {
      console.log('New PIN:', newPIN.join(''));
      setStep('confirm');
    } else if (step === 'confirm') {
      console.log('Confirm PIN:', confirmPIN.join(''));
      if (newPIN.join('') === confirmPIN.join('')) {
        console.log('PIN reset successful');
        router.back();
      } else {
        console.log('PINs do not match');
      }
    }
  };

  const getTitle = () => {
    switch (step) {
      case 'verify':
        return 'Confirm Your Identity ...';
      case 'create':
      case 'confirm':
        return 'Reset Transaction PIN';
    }
  };

  const getDescription = () => {
    switch (step) {
      case 'verify':
        return 'Enter verification code\nSent to your number and email address';
      case 'create':
      case 'confirm':
        return 'You need to create a 4-digit PIN to\nwithdraw money from your wallet';
    }
  };

  const getInputLabel = () => {
    switch (step) {
      case 'create':
        return 'Choose a PIN';
      case 'confirm':
        return 'Confirm PIN';
      default:
        return null;
    }
  };

  const getCurrentValue = () => {
    switch (step) {
      case 'verify':
        return verificationCode;
      case 'create':
        return newPIN;
      case 'confirm':
        return confirmPIN;
    }
  };

  const handleChange = (value: string[]) => {
    switch (step) {
      case 'verify':
        setVerificationCode(value);
        break;
      case 'create':
        setNewPIN(value);
        break;
      case 'confirm':
        setConfirmPIN(value);
        break;
    }
  };

  const isComplete = getCurrentValue().every((digit) => digit !== '');

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={24} color="#111827" />
        </TouchableOpacity>

        <ScrollView showsVerticalScrollIndicator={false}>
          <Spacer size="lg" />

          <Text variant="h3" weight="semibold">{getTitle()}</Text>
          
          <Spacer size="md" />

          <Text variant="body" color="secondary">
            {getDescription()}
          </Text>

          <Spacer size="xxl" />
          <Spacer size="xxl" />

          {getInputLabel() && (
            <>
              <Text variant="body" weight="medium" align="center">
                {getInputLabel()}
              </Text>
              <Spacer size="lg" />
            </>
          )}

          <PINInput
            value={getCurrentValue()}
            onChange={handleChange}
            length={4}
          />

          <Spacer size="xxl" />
          <Spacer size="xxl" />
        </ScrollView>

        {/* Continue Button */}
        <Button
          label="Continue"
          variant="primary"
          size="large"
          fullWidth
          onPress={handleContinue}
          disabled={!isComplete}
        />

        {step === 'confirm' && (
          <>
            <Spacer size="md" />
            <TouchableOpacity onPress={() => router.back()}>
              <Text variant="body" align="center">Go Back</Text>
            </TouchableOpacity>
          </>
        )}

        <Spacer size="md" />
      </View>

      {/* Floating Chat Button */}
      <FloatingChatButton
        icon={<MessageCircle size={28} color="#fff" />}
        onPress={() => console.log('Chat')}
        position="primary"
      />
    </SafeAreaView>
  );
}