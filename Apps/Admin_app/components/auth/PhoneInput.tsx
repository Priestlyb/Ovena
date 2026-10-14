/**
 * components/auth/PhoneInput.tsx
 *
 * Phone number field with a tappable country-code prefix.
 * Keeps country code and local number as separate state so the parent
 * can assemble a clean E.164-ish string (e.g. "+234 8012345678") for the
 * login request without needing to parse free-text.
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  FlatList,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/context/ThemeContext';
import { Spacing, Radius, FontFamily } from '@/constants/theme';

interface CountryCode {
  code:    string;   // e.g. "+234"
  iso:     string;   // e.g. "NG"
  flag:    string;   // emoji
  name:    string;
}

const COUNTRY_CODES: CountryCode[] = [
  { code: '+234', iso: 'NG', flag: '🇳🇬', name: 'Nigeria' },
  { code: '+1',   iso: 'US', flag: '🇺🇸', name: 'United States' },
  { code: '+44',  iso: 'GB', flag: '🇬🇧', name: 'United Kingdom' },
  { code: '+233', iso: 'GH', flag: '🇬🇭', name: 'Ghana' },
  { code: '+254', iso: 'KE', flag: '🇰🇪', name: 'Kenya' },
  { code: '+27',  iso: 'ZA', flag: '🇿🇦', name: 'South Africa' },
  { code: '+91',  iso: 'IN', flag: '🇮🇳', name: 'India' },
  { code: '+971', iso: 'AE', flag: '🇦🇪', name: 'UAE' },
];

interface PhoneInputProps {
  countryCode:        string;
  onCountryCodeChange: (code: string) => void;
  phoneNumber:        string;
  onPhoneNumberChange: (value: string) => void;
  error?:             string;
}

export function PhoneInput({
  countryCode,
  onCountryCodeChange,
  phoneNumber,
  onPhoneNumberChange,
  error,
}: PhoneInputProps) {
  const { colors, isDark } = useTheme();
  const [pickerOpen, setPickerOpen] = useState(false);
  const [focused, setFocused]       = useState(false);

  const selected = COUNTRY_CODES.find(c => c.code === countryCode) ?? COUNTRY_CODES[0];

  const inputBg     = isDark ? '#1c1b20' : colors.surfaceContainerLow;
  const borderColor = error
    ? colors.error
    : focused
    ? colors.primaryContainer
    : (isDark ? 'rgba(255,255,255,0.10)' : colors.border);

  return (
    <View style={styles.wrapper}>
      <Text style={[styles.label, { color: colors.onSurfaceVariant }]}>
        PHONE NUMBER
      </Text>

      <View
        style={[
          styles.row,
          { backgroundColor: inputBg, borderColor },
        ]}
      >
        {/* Country code picker trigger */}
        <TouchableOpacity
          style={styles.codeBtn}
          onPress={() => setPickerOpen(true)}
          activeOpacity={0.7}
        >
          <Text style={styles.flag}>{selected.flag}</Text>
          <Text style={[styles.codeText, { color: colors.onSurface }]}>
            {selected.code}
          </Text>
          <Ionicons name="chevron-down" size={14} color={colors.onSurfaceVariant} />
        </TouchableOpacity>

        <View style={[styles.divider, { backgroundColor: isDark ? 'rgba(255,255,255,0.10)' : colors.border }]} />

        {/* Local number */}
        <TextInput
          style={[styles.input, { color: colors.onSurface }]}
          value={phoneNumber}
          onChangeText={(v) => onPhoneNumberChange(v.replace(/[^\d]/g, ''))}
          placeholder="801 234 5678"
          placeholderTextColor={colors.onSurfaceVariant + '60'}
          keyboardType="phone-pad"
          maxLength={12}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          selectionColor={colors.primaryContainer}
        />
      </View>

      {error ? (
        <Text style={[styles.errorText, { color: colors.error }]}>{error}</Text>
      ) : null}

      {/* Country picker modal */}
      <Modal
        transparent
        visible={pickerOpen}
        animationType="slide"
        onRequestClose={() => setPickerOpen(false)}
      >
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={() => setPickerOpen(false)}
        />
        <View
          style={[
            styles.sheet,
            { backgroundColor: isDark ? '#1c1b20' : colors.surfaceContainerLow, borderColor: isDark ? 'rgba(255,255,255,0.10)' : colors.border },
          ]}
        >
          <View style={[styles.handle, { backgroundColor: colors.outlineVariant }]} />
          <Text style={[styles.sheetTitle, { color: colors.onSurface }]}>
            Select Country
          </Text>
          <FlatList
            data={COUNTRY_CODES}
            keyExtractor={item => item.iso}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.countryRow,
                  item.code === countryCode && { backgroundColor: `${colors.primaryContainer}15` },
                ]}
                onPress={() => {
                  onCountryCodeChange(item.code);
                  setPickerOpen(false);
                }}
              >
                <Text style={styles.flag}>{item.flag}</Text>
                <Text style={[styles.countryName, { color: colors.onSurface }]}>
                  {item.name}
                </Text>
                <Text style={[styles.countryCodeText, { color: colors.onSurfaceVariant }]}>
                  {item.code}
                </Text>
              </TouchableOpacity>
            )}
          />
        </View>
      </Modal>
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
  row: {
    flexDirection: 'row',
    alignItems:    'center',
    borderRadius:  Radius.xl,
    borderWidth:   1,
    height:        52,
  },
  codeBtn: {
    flexDirection:     'row',
    alignItems:        'center',
    gap:               4,
    paddingHorizontal: Spacing.md,
    height:            '100%',
  },
  flag: {
    fontSize: 18,
  },
  codeText: {
    fontFamily: FontFamily.body,
    fontSize:   15,
    fontWeight: '600',
  },
  divider: {
    width:  1,
    height: '60%',
  },
  input: {
    flex:              1,
    fontFamily:        FontFamily.body,
    fontSize:          15,
    paddingHorizontal: Spacing.md,
    height:            '100%',
  },
  errorText: {
    fontFamily: FontFamily.body,
    fontSize:   12,
    marginLeft: 4,
  },
  backdrop: {
    flex:            1,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  sheet: {
    position:             'absolute',
    bottom:               0,
    left:                 0,
    right:                0,
    maxHeight:            '60%',
    borderTopLeftRadius:  28,
    borderTopRightRadius: 28,
    borderWidth:          1,
    borderBottomWidth:    0,
    paddingTop:           Spacing.sm,
    paddingHorizontal:    Spacing.lg,
    paddingBottom:        Spacing.xl,
  },
  handle: {
    width:        40,
    height:       4,
    borderRadius: 2,
    alignSelf:    'center',
    marginBottom: Spacing.md,
  },
  sheetTitle: {
    fontFamily:   FontFamily.heading,
    fontSize:     16,
    fontWeight:   '600',
    marginBottom: Spacing.sm,
  },
  countryRow: {
    flexDirection:     'row',
    alignItems:        'center',
    gap:               Spacing.sm,
    paddingVertical:   Spacing.sm + 2,
    paddingHorizontal: Spacing.sm,
    borderRadius:      Radius.lg,
  },
  countryName: {
    flex:       1,
    fontFamily: FontFamily.body,
    fontSize:   15,
  },
  countryCodeText: {
    fontFamily: FontFamily.mono,
    fontSize:   13,
  },
});