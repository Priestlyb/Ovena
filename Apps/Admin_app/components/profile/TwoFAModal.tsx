/**
 * components/profile/TwoFAModal.tsx
 *
 * Bottom-sheet for toggling 2FA.
 * - Shows current status (ACTIVE / INACTIVE)
 * - Enable flow: displays a mock QR / backup code
 * - Disable flow: asks for confirmation
 * Uses the same slide-in spring as the other modals.
 */

import React, { useEffect, useRef, useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Animated,
  Platform,
  StyleSheet,
  Dimensions,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/context/ThemeContext';
import { Spacing, Radius, FontFamily } from '@/constants/theme';

const SCREEN_HEIGHT = Dimensions.get('window').height;

interface TwoFAModalProps {
  visible:   boolean;
  isActive:  boolean;
  onToggle:  (next: boolean) => void;
  onClose:   () => void;
}

// Mock backup code shown when enabling
const MOCK_BACKUP_CODE = 'LAVA-4X9K-M2WR-87PQ';

export function TwoFAModal({ visible, isActive, onToggle, onClose }: TwoFAModalProps) {
  const { colors, isDark } = useTheme();
  const translateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const backdropOp = useRef(new Animated.Value(0)).current;
  const [step, setStep] = useState<'info' | 'code'>('info');

  useEffect(() => {
    if (visible) {
      setStep('info');
      Animated.parallel([
        Animated.spring(translateY, { toValue: 0, useNativeDriver: true, speed: 20, bounciness: 4 }),
        Animated.timing(backdropOp, { toValue: 1, duration: 220, useNativeDriver: true }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(translateY, { toValue: SCREEN_HEIGHT, duration: 240, useNativeDriver: true }),
        Animated.timing(backdropOp, { toValue: 0, duration: 200, useNativeDriver: true }),
      ]).start();
    }
  }, [visible]);

  const handleConfirm = () => {
    if (!isActive) {
      // Enabling: show the backup code step
      setStep('code');
    } else {
      // Disabling: confirm then toggle
      Alert.alert(
        'Disable 2FA',
        'This will reduce your account security. Are you sure?',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Disable',
            style: 'destructive',
            onPress: () => { onToggle(false); onClose(); },
          },
        ],
      );
    }
  };

  const handleCodeConfirm = () => {
    onToggle(true);
    onClose();
  };

  const cardBg = isDark ? '#1b1b1e' : colors.surfaceContainerLow;

  return (
    <Modal transparent visible={visible} animationType="none" onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <Animated.View style={[styles.backdrop, { opacity: backdropOp }]} />
      </TouchableWithoutFeedback>

      <Animated.View
        style={[
          styles.sheet,
          {
            backgroundColor: cardBg,
            borderColor: isDark ? 'rgba(255,255,255,0.08)' : colors.border,
            transform: [{ translateY }],
          },
        ]}
      >
        <View style={[styles.handle, { backgroundColor: colors.outlineVariant }]} />

        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.onSurface }]}>2FA Security</Text>
          <TouchableOpacity onPress={onClose} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Ionicons name="close" size={22} color={colors.onSurfaceVariant} />
          </TouchableOpacity>
        </View>

        {step === 'info' ? (
          <>
            {/* Status pill */}
            <View style={styles.statusRow}>
              <View style={[
                styles.statusPill,
                { backgroundColor: isActive ? `${colors.primaryContainer}20` : `${colors.error}20` },
              ]}>
                <View style={[
                  styles.statusDot,
                  { backgroundColor: isActive ? colors.primaryContainer : colors.error },
                ]} />
                <Text style={[
                  styles.statusText,
                  { color: isActive ? colors.primaryContainer : colors.error },
                ]}>
                  {isActive ? 'ACTIVE' : 'INACTIVE'}
                </Text>
              </View>
            </View>

            <Text style={[styles.description, { color: colors.onSurfaceVariant }]}>
              {isActive
                ? 'Two-factor authentication is currently enabled. Disabling it will reduce your account security.'
                : 'Enable two-factor authentication to add an extra layer of security to your admin account.'}
            </Text>

            <View style={styles.actions}>
              <TouchableOpacity
                style={[styles.cancelBtn, { borderColor: colors.border }]}
                onPress={onClose}
                activeOpacity={0.7}
              >
                <Text style={[styles.cancelText, { color: colors.onSurfaceVariant }]}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.confirmBtn,
                  { backgroundColor: isActive ? colors.errorContainer : colors.primaryContainer },
                ]}
                onPress={handleConfirm}
                activeOpacity={0.85}
              >
                <Text style={[
                  styles.confirmText,
                  { color: isActive ? colors.error : colors.onPrimaryContainer },
                ]}>
                  {isActive ? 'Disable 2FA' : 'Enable 2FA'}
                </Text>
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <>
            <Text style={[styles.description, { color: colors.onSurfaceVariant }]}>
              Save this backup code in a safe place. You'll need it if you lose access to your authenticator.
            </Text>

            {/* Backup code display */}
            <View style={[
              styles.codeBox,
              { backgroundColor: colors.surfaceContainerHighest, borderColor: colors.border },
            ]}>
              <Text style={[styles.codeText, { color: colors.primary }]}>
                {MOCK_BACKUP_CODE}
              </Text>
            </View>

            <View style={styles.actions}>
              <TouchableOpacity
                style={[styles.cancelBtn, { borderColor: colors.border }]}
                onPress={onClose}
                activeOpacity={0.7}
              >
                <Text style={[styles.cancelText, { color: colors.onSurfaceVariant }]}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.confirmBtn, { backgroundColor: colors.primaryContainer }]}
                onPress={handleCodeConfirm}
                activeOpacity={0.85}
              >
                <Text style={[styles.confirmText, { color: colors.onPrimaryContainer }]}>
                  I've saved it
                </Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.60)',
  },
  sheet: {
    position:            'absolute',
    bottom:              0,
    left:                0,
    right:               0,
    borderTopLeftRadius:  28,
    borderTopRightRadius: 28,
    borderWidth:          1,
    borderBottomWidth:    0,
    padding:              Spacing.lg,
    paddingBottom:        Platform.OS === 'ios' ? 40 : Spacing.xl,
    gap:                  Spacing.md,
  },
  handle: {
    width:        40,
    height:       4,
    borderRadius: 2,
    alignSelf:    'center',
    marginBottom: Spacing.xs,
  },
  header: {
    flexDirection:  'row',
    justifyContent: 'space-between',
    alignItems:     'center',
  },
  title: {
    fontFamily:    FontFamily.heading,
    fontSize:      20,
    fontWeight:    '600',
    letterSpacing: -0.2,
  },
  statusRow: {
    alignItems: 'flex-start',
  },
  statusPill: {
    flexDirection:   'row',
    alignItems:      'center',
    gap:             6,
    paddingVertical: 6,
    paddingHorizontal: Spacing.sm,
    borderRadius:    Radius.full,
  },
  statusDot: {
    width:        6,
    height:       6,
    borderRadius: 3,
  },
  statusText: {
    fontFamily:    FontFamily.mono,
    fontSize:      10,
    fontWeight:    '500',
    letterSpacing: 1,
  },
  description: {
    fontFamily: FontFamily.body,
    fontSize:   14,
    lineHeight: 22,
  },
  codeBox: {
    borderRadius: Radius.xl,
    borderWidth:  1,
    padding:      Spacing.lg,
    alignItems:   'center',
  },
  codeText: {
    fontFamily:    FontFamily.mono,
    fontSize:      18,
    fontWeight:    '500',
    letterSpacing: 2,
  },
  actions: {
    flexDirection: 'row',
    gap:           Spacing.sm,
    marginTop:     Spacing.xs,
  },
  cancelBtn: {
    flex:           1,
    height:         48,
    borderRadius:   Radius.full,
    borderWidth:    1,
    justifyContent: 'center',
    alignItems:     'center',
  },
  cancelText: {
    fontFamily:  FontFamily.body,
    fontSize:    15,
    fontWeight:  '500',
  },
  confirmBtn: {
    flex:           1,
    height:         48,
    borderRadius:   Radius.full,
    justifyContent: 'center',
    alignItems:     'center',
  },
  confirmText: {
    fontFamily:  FontFamily.heading,
    fontSize:    15,
    fontWeight:  '700',
  },
});