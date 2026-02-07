// YourDetailsPage.tsx - User profile details page
import React, { useState } from 'react';
import { SafeAreaView, ScrollView, View } from 'react-native';
import { ArrowLeft, MessageCircle } from 'lucide-react-native';
import { styles } from '@/constants/styles';

// Atomic Components
import { Text } from '@/components/atoms/Text';
import { Button } from '@/components/atoms/Button';
import { Icon } from '@/components/atoms/Icon';
import { Spacer } from '@/components/atoms/Spacer';

// Molecule Components
import { Header } from '@/components/molecules/Header';

// Existing Components
import { CustomInput } from '@/components/CustomInput';
import { FloatingChatButton } from '@/components/FloatingChatButton';

interface YourDetailsPageProps {
  onBack?: () => void;
  onSave?: (data: UserDetails) => void;
}

interface UserDetails {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  emailAddress: string;
}

const YourDetailsPage: React.FC<YourDetailsPageProps> = ({ onBack, onSave }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [emailAddress, setEmailAddress] = useState('');

  const handleSave = () => {
    const data: UserDetails = {
      firstName,
      lastName,
      phoneNumber,
      emailAddress,
    };
    onSave?.(data);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <Header
          title="Your Details"
          leftIcon={<ArrowLeft size={24} color="#111827" />}
          onLeftIconPress={onBack}
        />

        <Spacer size="lg" />

        {/* First Name */}
        <CustomInput
          label="First name"
          placeholder=""
          value={firstName}
          onChange={setFirstName}
        />

        {/* Last Name */}
        <CustomInput
          label="Last name"
          placeholder=""
          value={lastName}
          onChange={setLastName}
        />

        {/* Phone Number */}
        <CustomInput
          label="Phone number"
          placeholder=""
          value={phoneNumber}
          onChange={setPhoneNumber}
          type="tel"
        />

        {/* Email Address */}
        <CustomInput
          label="Email address"
          placeholder=""
          value={emailAddress}
          onChange={setEmailAddress}
          type="email"
        />

        <Spacer size="xl" />

        {/* Save Button */}
        <Button
          label="Save Changes"
          variant="primary"
          size="large"
          fullWidth
          onPress={handleSave}
        />

        <Spacer size="xl" />
      </ScrollView>

      {/* Floating Chat Button */}
      <FloatingActionButton
        icon={<MessageCircle size={28} color="#fff" />}
        onPress={() => console.log('Chat')}
        position="primary"
      />
    </SafeAreaView>
  );
};

export default YourDetailsPage;