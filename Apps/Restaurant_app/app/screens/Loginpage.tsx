// LoginPage.tsx - Login with role selection (Admin Staff / Vendor Agent)
import React, { useState } from 'react';
import { SafeAreaView, ScrollView, View, TouchableOpacity, TextInput, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Eye, EyeOff, User, Briefcase } from 'lucide-react-native';
import { styles } from '@/constants/styles';

// Atomic Components
import { Text } from '@/components/atoms/Text';
import { Button } from '@/components/atoms/Button';
import { Spacer } from '@/components/atoms/Spacer';

// Molecule Components
import { Card } from '@/components/molecules/Card';

export default function LoginPage() {
  const router = useRouter();
  const [loginAs, setLoginAs] = useState<'admin' | 'vendor'>('admin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showQRInstructions, setShowQRInstructions] = useState(false);

  const handleLogin = () => {
    console.log('Login as:', loginAs, 'Email:', email);
    // Handle login logic
    router.push('/(tabs)');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={24} color="#111827" />
        </TouchableOpacity>

        <Spacer size="lg" />

        <Text variant="h2" weight="bold" align="center">Welcome back</Text>
        
        <Spacer size="lg" />

        {/* Login As Toggle */}
        <Text variant="body" weight="medium" align="center">Login As</Text>
        <Spacer size="sm" />

        <View style={styles.loginToggleContainer}>
          <TouchableOpacity
            style={[
              styles.loginToggleButton,
              loginAs === 'admin' && styles.loginToggleButtonActive
            ]}
            onPress={() => {
              setLoginAs('admin');
              setShowQRInstructions(false);
            }}
          >
            <User size={20} color={loginAs === 'admin' ? '#111827' : '#6B7280'} />
            <Text
              variant="body"
              weight={loginAs === 'admin' ? 'semibold' : 'regular'}
              color={loginAs === 'admin' ? 'primary' : 'secondary'}
            >
              Admin Staff
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.loginToggleButton,
              loginAs === 'vendor' && styles.loginToggleButtonActive
            ]}
            onPress={() => {
              setLoginAs('vendor');
              setShowQRInstructions(true);
            }}
          >
            <Briefcase size={20} color={loginAs === 'vendor' ? '#111827' : '#6B7280'} />
            <Text
              variant="body"
              weight={loginAs === 'vendor' ? 'semibold' : 'regular'}
              color={loginAs === 'vendor' ? 'primary' : 'secondary'}
            >
              Vendor Agent
            </Text>
          </TouchableOpacity>
        </View>

        <Spacer size="xl" />

        {/* QR Code Instructions for Vendor Agent */}
        {showQRInstructions && (
          <>
            <Card variant="filled" padding="lg">
              <View style={styles.qrCodeContainer}>
                <View style={styles.qrCodePlaceholder}>
                  <Text variant="h1" align="center">QR</Text>
                </View>
              </View>

              <Spacer size="md" />

              <Text variant="body" weight="semibold">To set up Agents</Text>
              <Spacer size="sm" />
              <Text variant="bodySmall" color="secondary">1. Admin Login with Details.</Text>
              <Text variant="bodySmall" color="secondary">2. Navigate to profile page.</Text>
              <Text variant="bodySmall" color="secondary">3. Tap on manager users.</Text>
              <Text variant="bodySmall" color="secondary">4. Tap link a device,</Text>
              <Text variant="bodySmall" color="secondary">5. Point your phone at this screen to capture the QR Code.</Text>
            </Card>

            <Spacer size="xl" />
          </>
        )}

        {/* Email Input */}
        {!showQRInstructions && (
          <>
            <View style={styles.inputContainer}>
              <Text variant="label" color="primary">
                Email address <Text style={{ color: '#EF4444' }}>*</Text>
              </Text>
              <Spacer size="xs" />
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="e.g joe@doe.com"
                placeholderTextColor="#9CA3AF"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <Spacer size="md" />

            {/* Password Input */}
            <View style={styles.inputContainer}>
              <Text variant="label" color="primary">
                Password <Text style={{ color: '#EF4444' }}>*</Text>
              </Text>
              <Spacer size="xs" />
              <View style={styles.passwordInputWrapper}>
                <TextInput
                  style={[styles.input, { paddingRight: 50 }]}
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Enter your password"
                  placeholderTextColor="#9CA3AF"
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity
                  style={styles.passwordToggle}
                  onPress={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff size={20} color="#6B7280" />
                  ) : (
                    <Eye size={20} color="#6B7280" />
                  )}
                </TouchableOpacity>
              </View>

              <TouchableOpacity onPress={() => router.push('/forgot-password')}>
                <Text variant="bodySmall" align="right" style={{ marginTop: 8 }}>
                  Forgot password?
                </Text>
              </TouchableOpacity>
            </View>

            <Spacer size="xl" />

            {/* Login Button */}
            <Button
              label="Login"
              variant="primary"
              size="large"
              fullWidth
              onPress={handleLogin}
            />

            <Spacer size="md" />

            {/* Sign Up Link */}
            <Text variant="body" align="center">
              Don't have an account?{' '}
              <Text
                variant="body"
                weight="semibold"
                style={{ color: '#FF6B35' }}
                onPress={() => router.push('/signup')}
              >
                Sign Up
              </Text>
            </Text>
          </>
        )}

        <Spacer size="xl" />
      </ScrollView>
    </SafeAreaView>
  );
}