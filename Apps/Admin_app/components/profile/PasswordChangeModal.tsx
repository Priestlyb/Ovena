/**
 * components/profile/PasswordChangeModal.tsx
 *
 * Bottom-sheet for changing password.
 * Three fields: Current Password, New Password, Confirm New Password.
 * Validates that new passwords match before saving, then calls
 * POST /api/admin/change-password/.
 */

import React, { useEffect, useRef, useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Animated,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Dimensions,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { changeAdminPassword } from '@/services/actionsApi';
import { Spacing, Radius, FontFamily } from '@/constants/theme';

const SCREEN_HEIGHT = Dimensions.get('window').height;

interface PasswordChangeModalProps {
  visible:  boolean;
  onClose:  () => void;
  onSaved?: () => void;
}

interface PasswordFieldProps {
  label:       string;
  value:       string;
  onChange:    (v: string) => void;
  placeholder: string;
  hasError?:   boolean;
  editable?:   boolean;
}

function PasswordField({ label, value, onChange, placeholder, hasError, editable = true }: PasswordFieldProps) {
  const { colors, isDark } = useTheme();
  const [show, setShow] = useState(false);
  const inputBg = isDark ? colors.surfaceContainerHigh : colors.surfaceContainer;

  // Shake on error
  const shakeAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (hasError) {
      Animated.sequence([
        Animated.timing(shakeAnim, { toValue: 8,  duration: 50, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: -8, duration: 50, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: 6,  duration: 50, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: -6, duration: 50, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: 0,  duration: 50, useNativeDriver: true }),
      ]).start();
    }
  }, [hasError]);

  return (
    <View style={styles.fieldGroup}>
      <Text style={[styles.inputLabel, { color: colors.onSurfaceVariant }]}>
        {label.toUpperCase()}
      </Text>
      <Animated.View
        style={[
          styles.inputWrap,
          {
            backgroundColor: inputBg,
            borderColor:     hasError ? colors.error : colors.border,
            transform:       [{ translateX: shakeAnim }],
            opacity:         editable ? 1 : 0.6,
          },
        ]}
      >
        <TextInput
          style={[styles.input, { color: colors.onSurface }]}
          value={value}
          onChangeText={onChange}
          placeholder={placeholder}
          placeholderTextColor={colors.onSurfaceVariant + '80'}
          secureTextEntry={!show}
          autoCapitalize="none"
          selectionColor={colors.primaryContainer}
          editable={editable}
        />
        <TouchableOpacity onPress={() => setShow(v => !v)} style={styles.eyeBtn} disabled={!editable}>
          <Ionicons
            name={show ? 'eye-off-outline' : 'eye-outline'}
            size={20}
            color={colors.onSurfaceVariant}
          />
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

export function PasswordChangeModal({ visible, onClose, onSaved }: PasswordChangeModalProps) {
  const { colors, isDark } = useTheme();
  const { tokens } = useAuth();
  const [current, setCurrent]     = useState('');
  const [next, setNext]           = useState('');
  const [confirm, setConfirm]     = useState('');
  const [mismatch, setMismatch]   = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const translateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const backdropOp = useRef(new Animated.Value(0)).current;

  const reset = () => { setCurrent(''); setNext(''); setConfirm(''); setMismatch(false); setSubmitting(false); };

  useEffect(() => {
    if (visible) {
      reset();
      Animated.parallel([
        Animated.spring(translateY, { toValue: 0,              useNativeDriver: true, speed: 20, bounciness: 4 }),
        Animated.timing(backdropOp, { toValue: 1, duration: 220, useNativeDriver: true }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(translateY, { toValue: SCREEN_HEIGHT, duration: 240, useNativeDriver: true }),
        Animated.timing(backdropOp, { toValue: 0,             duration: 200, useNativeDriver: true }),
      ]).start();
    }
  }, [visible]);

  const handleSave = async () => {
    if (submitting) return;

    if (!current) {
      Alert.alert('Missing field', 'Please enter your current password.');
      return;
    }
    if (next.length < 8) {
      Alert.alert('Too short', 'New password must be at least 8 characters.');
      return;
    }
    if (next !== confirm) {
      setMismatch(true);
      setTimeout(() => setMismatch(false), 600);
      return;
    }
    if (!tokens?.accessToken) {
      Alert.alert('Not signed in', 'Your session has expired. Please sign in again.');
      return;
    }

    setSubmitting(true);
    try {
      await changeAdminPassword(
        { password: current, new_password: next },
        tokens.accessToken,
      );
      Alert.alert('Password Updated', 'Your password has been changed successfully.', [
        { text: 'OK', onPress: () => { onSaved?.(); onClose(); } },
      ]);
    } catch (err: any) {
      Alert.alert('Update Failed', err.message ?? 'Could not change your password. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const cardBg = isDark ? '#1b1b1e' : colors.surfaceContainerLow;

  return (
    <Modal transparent visible={visible} animationType="none" onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <Animated.View style={[styles.backdrop, { opacity: backdropOp }]} />
      </TouchableWithoutFeedback>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.kavWrapper}
        pointerEvents="box-none"
      >
        <Animated.View
          style={[
            styles.sheet,
            {
              backgroundColor: cardBg,
              borderColor:     isDark ? 'rgba(255,255,255,0.08)' : colors.border,
              transform:       [{ translateY }],
            },
          ]}
        >
          <View style={[styles.handle, { backgroundColor: colors.outlineVariant }]} />

          <View style={styles.sheetHeader}>
            <Text style={[styles.sheetTitle, { color: colors.onSurface }]}>Change Password</Text>
            <TouchableOpacity onPress={onClose} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }} disabled={submitting}>
              <Ionicons name="close" size={22} color={colors.onSurfaceVariant} />
            </TouchableOpacity>
          </View>

          <PasswordField
            label="Current Password"
            value={current}
            onChange={setCurrent}
            placeholder="Enter current password"
            editable={!submitting}
          />
          <PasswordField
            label="New Password"
            value={next}
            onChange={setNext}
            placeholder="Min. 8 characters"
            editable={!submitting}
          />
          <PasswordField
            label="Confirm New Password"
            value={confirm}
            onChange={setConfirm}
            placeholder="Repeat new password"
            hasError={mismatch}
            editable={!submitting}
          />

          {mismatch && (
            <Text style={[styles.errorText, { color: colors.error }]}>
              Passwords don't match
            </Text>
          )}

          <View style={styles.actions}>
            <TouchableOpacity
              style={[styles.cancelBtn, { borderColor: colors.border }]}
              onPress={onClose}
              activeOpacity={0.7}
              disabled={submitting}
            >
              <Text style={[styles.cancelText, { color: colors.onSurfaceVariant }]}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.saveBtn, { backgroundColor: colors.primaryContainer }, submitting && { opacity: 0.75 }]}
              onPress={handleSave}
              activeOpacity={0.85}
              disabled={submitting}
            >
              {submitting
                ? <ActivityIndicator color={colors.onPrimaryContainer} />
                : <Text style={[styles.saveText, { color: colors.onPrimaryContainer }]}>Update</Text>
              }
            </TouchableOpacity>
          </View>
        </Animated.View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.60)',
  },
  kavWrapper: {
    flex:           1,
    justifyContent: 'flex-end',
  },
  sheet: {
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
  sheetHeader: {
    flexDirection:  'row',
    justifyContent: 'space-between',
    alignItems:     'center',
  },
  sheetTitle: {
    fontFamily:    FontFamily.heading,
    fontSize:      20,
    fontWeight:    '600',
    letterSpacing: -0.2,
  },
  fieldGroup: {
    gap: 6,
  },
  inputLabel: {
    fontFamily:    FontFamily.mono,
    fontSize:      10,
    fontWeight:    '500',
    letterSpacing: 1.5,
  },
  inputWrap: {
    flexDirection:   'row',
    alignItems:      'center',
    borderRadius:    Radius.xl,
    borderWidth:     1,
    paddingHorizontal: Spacing.md,
  },
  input: {
    flex:       1,
    fontFamily: FontFamily.body,
    fontSize:   16,
    height:     52,
  },
  eyeBtn: {
    padding: 4,
  },
  errorText: {
    fontFamily: FontFamily.mono,
    fontSize:   11,
    marginTop:  -Spacing.xs,
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
  saveBtn: {
    flex:           1,
    height:         48,
    borderRadius:   Radius.full,
    justifyContent: 'center',
    alignItems:     'center',
  },
  saveText: {
    fontFamily:  FontFamily.heading,
    fontSize:    15,
    fontWeight:  '700',
  },
});