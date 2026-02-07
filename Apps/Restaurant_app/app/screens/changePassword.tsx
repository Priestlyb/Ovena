// ChangePasswordPage.tsx - Change password page
import React, { useState } from 'react';
import { SafeAreaView, ScrollView, View } from 'react-native';
import { ArrowLeft, MessageCircle, Eye, EyeOff, Zap } from 'lucide-react-native';
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

interface ChangePasswordPageProps {
  onBack?: () => void;
  onSave?: (data: PasswordData) => void;
}

interface PasswordData {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const ChangePasswordPage: React.FC<ChangePasswordPageProps> = ({ onBack, onSave }) => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChangePassword = () => {
    const data: PasswordData = {
      oldPassword,
      newPassword,
      confirmPassword,
    };
    onSave?.(data);
  };

  // Password strength indicator
  const getPasswordStrength = () => {
    if (newPassword.length === 0) return [];
    const strength = [];
    for (let i = 0; i < 6; i++) {
      strength.push(i < Math.min(newPassword.length / 2, 6));
    }
    return strength;
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <Header
          title="Change Password"
          leftIcon={<ArrowLeft size={24} color="#111827" />}
          onLeftIconPress={onBack}
        />

        <Spacer size="lg" />

        {/* Old Password */}
        <View style={styles.inputContainer}>
          <Text variant="label" color="primary">Old password</Text>
          <Spacer size="xs" />
          <View style={styles.passwordInputWrapper}>
            <CustomInput
              placeholder="at least 8 characters"
              value={oldPassword}
              onChange={setOldPassword}
              type={showOldPassword ? "text" : "password"}
            />
            <View style={styles.passwordIcon}>
              <Icon
                icon={showOldPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                size="small"
                onPress={() => setShowOldPassword(!showOldPassword)}
              />
            </View>
          </View>
        </View>

        <Spacer size="md" />

        {/* Create Password */}
        <View style={styles.inputContainer}>
          <Text variant="label" color="primary">Create password</Text>
          <Spacer size="xs" />
          <View style={styles.passwordInputWrapper}>
            <CustomInput
              placeholder="at least 8 characters"
              value={newPassword}
              onChange={setNewPassword}
              type={showNewPassword ? "text" : "password"}
            />
            <View style={styles.passwordIcon}>
              <Icon
                icon={showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                size="small"
                onPress={() => setShowNewPassword(!showNewPassword)}
              />
            </View>
          </View>

          {/* Password Strength Indicator */}
          <Spacer size="sm" />
          <View style={styles.passwordStrength}>
            {getPasswordStrength().map((filled, index) => (
              <View
                key={index}
                style={[
                  styles.passwordStrengthBar,
                  filled && styles.passwordStrengthBarFilled
                ]}
              />
            ))}
          </View>
        </View>

        <Spacer size="md" />

        {/* Confirm Password */}
        <View style={styles.inputContainer}>
          <Text variant="label" color="primary">Confirm password</Text>
          <Spacer size="xs" />
          <View style={styles.passwordInputWrapper}>
            <CustomInput
              placeholder="at least 8 characters"
              value={confirmPassword}
              onChange={setConfirmPassword}
              type={showConfirmPassword ? "text" : "password"}
            />
            <View style={styles.passwordIcon}>
              <Icon
                icon={<Zap size={20} color="#111827" />}
                size="small"
              />
            </View>
          </View>
        </View>

        <Spacer size="xxl" />

        {/* Change Password Button */}
        <Button
          label="Change Password"
          variant="primary"
          size="large"
          fullWidth
          onPress={handleChangePassword}
        />

        <Spacer size="xl" />
      </ScrollView>

      {/* Floating Chat Button */}
      <FloatingChatButton
        icon={<MessageCircle size={28} color="#fff" />}
        onPress={() => console.log('Chat')}
        position="primary"
      />
    </SafeAreaView>
  );
};

export default ChangePasswordPage;