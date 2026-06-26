/**
 * app/login/index.tsx
 *
 * Admin login screen — Lava Admin dark design language.
 *
 * Layout:
 *   - Logo / brand mark + "Welcome back" headline
 *   - PhoneInput (country code + number)
 *   - PasswordInput (masked, eye toggle)
 *   - "Forgot password?" link
 *   - Primary "Sign In" button (lava, loading spinner while in flight)
 *   - Inline error banner if login fails
 *
 * Behaviour:
 *   - Calls useAuth().login({ phone, password }) on submit
 *   - Validates phone length and non-empty password before firing the request
 *   - On success, AuthContext flips isAuthenticated → true; a root navigator
 *     guard (outside this file) is responsible for redirecting into (tabs)
 *   - Shake animation on the form when validation fails, matching the
 *     micro-interaction language used elsewhere in the app
 *
 * ── DEV TOGGLE ────────────────────────────────────────────────────────────────
 * true  → skip API, jump straight to (tabs)
 * false → real sign-in flow
 *
 * To remove: delete the DEV_BYPASS_AUTH constant, the `if (DEV_BYPASS_AUTH)`
 * block inside handleSubmit, and the dev badge JSX block below the headline.
 * Nothing else in the app references this flag.
 */
const DEV_BYPASS_AUTH = false; // ⚠️  delete this line to remove the bypass

import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Animated,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import ScreenWrapper       from '@/components/ScreenWrapper';
import { PhoneInput }      from '@/components/auth/PhoneInput';
import { PasswordInput }   from '@/components/auth/PasswordInput';
import { useAuth }         from '@/context/AuthContext';
import { useTheme }        from '@/context/ThemeContext';
import { Spacing, Radius, FontFamily } from '@/constants/theme';

export default function LoginScreen() {
  const { colors, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const { login, loading, error: authError } = useAuth();

  const [countryCode,  setCountryCode]  = useState('+234');
  const [phoneNumber,  setPhoneNumber]  = useState('');
  const [password,     setPassword]    = useState('');
  const [phoneError,   setPhoneError]  = useState<string | undefined>();
  const [pwError,      setPwError]     = useState<string | undefined>();

  // Shake animation for validation failure
  const shakeX = useRef(new Animated.Value(0)).current;
  const triggerShake = () => {
    Animated.sequence([
      Animated.timing(shakeX, { toValue: 8,  duration: 60, useNativeDriver: true }),
      Animated.timing(shakeX, { toValue: -8, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeX, { toValue: 6,  duration: 60, useNativeDriver: true }),
      Animated.timing(shakeX, { toValue: 0,  duration: 60, useNativeDriver: true }),
    ]).start();
  };

  // Button press scale
  const btnScale = useRef(new Animated.Value(1)).current;
  const onBtnIn  = () => Animated.spring(btnScale, { toValue: 0.96, useNativeDriver: true, speed: 50, bounciness: 4 }).start();
  const onBtnOut = () => Animated.spring(btnScale, { toValue: 1,    useNativeDriver: true, speed: 20, bounciness: 6 }).start();

  const validate = (): boolean => {
    let ok = true;
    setPhoneError(undefined);
    setPwError(undefined);

    if (phoneNumber.replace(/\D/g, '').length < 7) {
      setPhoneError('Enter a valid phone number');
      ok = false;
    }
    if (password.length === 0) {
      setPwError('Password is required');
      ok = false;
    }
    if (!ok) triggerShake();
    return ok;
  };

  const handleSubmit = async () => {
    // DEV TOGGLE: skip real auth entirely and jump straight into the app.
    // Delete this block to remove the bypass.
    if (DEV_BYPASS_AUTH) {
      console.log('⚠️  DEV_BYPASS_AUTH is ON — skipping real sign-in');
      router.replace('/(tabs)');
      return;
    }

    if (!validate()) return;
    try {
      await login({
        phone:    `${countryCode}${phoneNumber}`,
        password,
      });
      // AuthContext now has isAuthenticated = true.
      // A root guard normally handles this redirect automatically; this
      // explicit push is a safe fallback if no such guard exists yet.
      router.replace('/(tabs)');
    } catch {
      // authError from context already carries the message; just shake
      triggerShake();
    }
  };

  const cardBg = isDark ? 'rgba(27,27,30,0.7)' : colors.surfaceContainer;
  const cardBd = isDark ? 'rgba(255,255,255,0.08)' : colors.border;

  return (
    <ScreenWrapper noPadding>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            { paddingTop: insets.top + Spacing.xl, paddingBottom: insets.bottom + Spacing.xl },
          ]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* ── Brand mark ── */}
          <View style={styles.brandBlock}>
            <View style={[styles.logoCircle, { backgroundColor: colors.primaryContainer, shadowColor: '#f56e0f' }]}>
              <Ionicons name="flame" size={30} color={colors.onPrimaryContainer} />
            </View>
            <Text style={[styles.brandName, { color: colors.primaryContainer }]}>
              Ovena Admin
            </Text>
          </View>

          {/* ── Headline ── */}
          <View style={styles.headlineBlock}>
            <Text style={[styles.headline, { color: colors.onSurface }]}>
              Welcome back
            </Text>
            <Text style={[styles.subtext, { color: colors.onSurfaceVariant }]}>
              Sign in to access the operator console
            </Text>
          </View>

          {/* DEV TOGGLE: visual reminder bypass is on. Delete this block to remove. */}
          {DEV_BYPASS_AUTH && (
            <View style={styles.devBadge}>
              <Ionicons name="warning-outline" size={13} color="#7A5800" />
              <Text style={styles.devBadgeText}>DEV — auth bypassed</Text>
            </View>
          )}

          {/* ── Form card ── */}
          <Animated.View
            style={[
              styles.formCard,
              {
                backgroundColor: cardBg,
                borderColor:     cardBd,
                transform:       [{ translateX: shakeX }],
              },
            ]}
          >
            <PhoneInput
              countryCode={countryCode}
              onCountryCodeChange={setCountryCode}
              phoneNumber={phoneNumber}
              onPhoneNumberChange={(v) => { setPhoneNumber(v); setPhoneError(undefined); }}
              error={phoneError}
            />

            <PasswordInput
              value={password}
              onChangeText={(v) => { setPassword(v); setPwError(undefined); }}
              error={pwError}
              returnKeyType="done"
              onSubmitEditing={handleSubmit}
            />

            <TouchableOpacity style={styles.forgotBtn} activeOpacity={0.7}>
              <Text style={[styles.forgotText, { color: colors.primaryContainer }]}>
                Forgot password?
              </Text>
            </TouchableOpacity>

            {/* Server-side error banner */}
            {authError ? (
              <View style={[styles.errorBanner, { backgroundColor: `${colors.error}15`, borderColor: `${colors.error}40` }]}>
                <Ionicons name="alert-circle-outline" size={16} color={colors.error} />
                <Text style={[styles.errorBannerText, { color: colors.error }]}>{authError}</Text>
              </View>
            ) : null}

            <Animated.View style={{ transform: [{ scale: btnScale }] }}>
              <TouchableOpacity
                style={[
                  styles.submitBtn,
                  { backgroundColor: colors.primaryContainer, shadowColor: '#f56e0f' },
                  loading && { opacity: 0.75 },
                ]}
                onPress={handleSubmit}
                onPressIn={onBtnIn}
                onPressOut={onBtnOut}
                disabled={loading}
                activeOpacity={1}
              >
                {loading ? (
                  <ActivityIndicator color={colors.onPrimaryContainer} />
                ) : (
                  <>
                    <Ionicons name="log-in-outline" size={19} color={colors.onPrimaryContainer} />
                    <Text style={[styles.submitText, { color: colors.onPrimaryContainer }]}>
                      {DEV_BYPASS_AUTH ? 'Skip to Home (dev)' : 'Sign In'}
                    </Text>
                  </>
                )}
              </TouchableOpacity>
            </Animated.View>
          </Animated.View>

          {/* ── Footer ── */}
          <Text style={[styles.footerText, { color: colors.onSurfaceVariant }]}>
            Having trouble signing in? Contact your system administrator.
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow:          1,
    paddingHorizontal: Spacing.gutter,
    justifyContent:    'center',
    gap:               Spacing.xl,
  },

  // Brand
  brandBlock: {
    alignItems: 'center',
    gap:        Spacing.sm,
  },
  logoCircle: {
    width:          64,
    height:         64,
    borderRadius:   32,
    justifyContent: 'center',
    alignItems:     'center',
    shadowOffset:   { width: 0, height: 0 },
    shadowOpacity:  0.35,
    shadowRadius:   20,
    elevation:      10,
  },
  brandName: {
    fontFamily:    FontFamily.heading,
    fontSize:      16,
    fontWeight:    '700',
    letterSpacing: 0.3,
  },

  // Headline
  headlineBlock: {
    alignItems: 'center',
    gap:        4,
  },
  headline: {
    fontFamily:    FontFamily.heading,
    fontSize:      28,
    fontWeight:    '700',
    letterSpacing: -0.5,
  },
  subtext: {
    fontFamily: FontFamily.body,
    fontSize:   13,
    textAlign:  'center',
  },

  // Dev badge — matches the amber warning-banner pattern from the reference screen
  devBadge: {
    flexDirection:     'row',
    alignItems:        'center',
    gap:               6,
    alignSelf:         'center',
    backgroundColor:   '#FFF3CD',
    borderWidth:       1,
    borderColor:       '#FFCA28',
    borderRadius:      8,
    paddingHorizontal: 10,
    paddingVertical:   4,
  },
  devBadgeText: {
    fontFamily: FontFamily.body,
    fontSize:   12,
    fontWeight: '600',
    color:      '#7A5800',
  },

  // Form
  formCard: {
    borderRadius: 28,
    borderWidth:  1,
    padding:      Spacing.lg,
    gap:          Spacing.md,
  },
  forgotBtn: {
    alignSelf: 'flex-end',
    marginTop: -4,
  },
  forgotText: {
    fontFamily: FontFamily.body,
    fontSize:   13,
    fontWeight: '600',
  },

  // Error banner
  errorBanner: {
    flexDirection:   'row',
    alignItems:      'center',
    gap:             Spacing.xs,
    borderRadius:    Radius.lg,
    borderWidth:     1,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
  },
  errorBannerText: {
    fontFamily: FontFamily.body,
    fontSize:   12,
    flex:       1,
  },

  // Submit
  submitBtn: {
    flexDirection:   'row',
    alignItems:      'center',
    justifyContent:  'center',
    gap:             Spacing.sm,
    borderRadius:    Radius.full,
    paddingVertical: Spacing.md,
    shadowOffset:    { width: 0, height: 6 },
    shadowOpacity:   0.30,
    shadowRadius:    16,
    elevation:       8,
  },
  submitText: {
    fontFamily:    FontFamily.heading,
    fontSize:      16,
    fontWeight:    '700',
    letterSpacing: -0.2,
  },

  // Footer
  footerText: {
    fontFamily: FontFamily.body,
    fontSize:   12,
    textAlign:  'center',
    paddingHorizontal: Spacing.lg,
  },
});