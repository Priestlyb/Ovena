/**
 * components/auth/PasswordInput.tsx
 *
 * Standard masked password field with a show/hide eye toggle.
 * Matches the visual language of PhoneInput (same height, radius, label style).
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/context/ThemeContext';
import { Spacing, Radius, FontFamily } from '@/constants/theme';

interface PasswordInputProps {
  value:         string;
  onChangeText:  (v: string) => void;
  label?:        string;
  placeholder?:  string;
  error?:        string;
  returnKeyType?: 'done' | 'next';
  onSubmitEditing?: () => void;
}

export function PasswordInput({
  value,
  onChangeText,
  label = 'PASSWORD',
  placeholder = 'Enter your password',
  error,
  returnKeyType = 'done',
  onSubmitEditing,
}: PasswordInputProps) {
  const { colors, isDark } = useTheme();
  const [visible, setVisible] = useState(false);
  const [focused, setFocused] = useState(false);

  const inputBg     = isDark ? colors.surfaceContainerLow : colors.surfaceContainerLow;
  const borderColor = error
    ? colors.error
    : focused
    ? colors.primaryContainer
    : (isDark ? 'rgba(255,255,255,0.10)' : colors.border);

  return (
    <View style={styles.wrapper}>
      <Text style={[styles.label, { color: colors.onSurfaceVariant }]}>{label}</Text>

      <View style={[styles.field, { backgroundColor: inputBg, borderColor }]}>
        <TextInput
          style={[styles.input, { color: colors.onSurface }]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.onSurfaceVariant + '70'}
          secureTextEntry={!visible}
          autoCapitalize="none"
          autoCorrect={false}
          selectionColor={colors.primaryContainer}
          onFocus={() => setFocused(true)}
          onBlur={()  => setFocused(false)}
          returnKeyType={returnKeyType}
          onSubmitEditing={onSubmitEditing}
        />
        <TouchableOpacity
          onPress={() => setVisible(v => !v)}
          style={styles.eyeBtn}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons
            name={visible ? 'eye-off-outline' : 'eye-outline'}
            size={19}
            color={colors.onSurfaceVariant}
          />
        </TouchableOpacity>
      </View>

      {error ? (
        <Text style={[styles.errorText, { color: colors.error }]}>{error}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: 6,
  },
  label: {
    fontFamily:    FontFamily.mono,
    fontSize:      9,
    fontWeight:    '500',
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginLeft:    4,
  },
  field: {
    flexDirection: 'row',
    alignItems:    'center',
    borderRadius:  Radius.xl,
    borderWidth:   1,
    height:        52,
  },
  input: {
    flex:              1,
    height:            '100%',
    paddingHorizontal: Spacing.md,
    fontFamily:        FontFamily.body,
    fontSize:          15,
  },
  eyeBtn: {
    paddingHorizontal: Spacing.md,
    height:            '100%',
    justifyContent:    'center',
  },
  errorText: {
    fontFamily: FontFamily.body,
    fontSize:   12,
    marginLeft: 4,
  },
});