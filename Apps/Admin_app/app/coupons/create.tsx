/**
 * app/coupons/create.tsx
 *
 * Create / Edit Coupon — mirrors HTML doc 12.
 * Sections: Basic Info → Discount Config → Usage Constraints → Validity Period
 * Sticky "Generate Coupon" button at bottom.
 * editId param → pre-fills existing coupon data.
 */

import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  ScrollView, StyleSheet, Alert, Switch,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import ScreenWrapper from '@/components/ScreenWrapper';
import { useTheme }  from '@/context/ThemeContext';
import { Spacing, Radius, FontFamily } from '@/constants/theme';
import { INITIAL_COUPONS, DiscountType } from '@/data/couponData';

function SectionCard({ icon, title, children }: { icon: string; title: string; children: React.ReactNode }) {
  const { colors, isDark } = useTheme();
  return (
    <View style={[
      styles.sectionCard,
      { backgroundColor: isDark ? '#1b1b1e' : colors.surfaceContainer, borderColor: isDark ? 'rgba(255,255,255,0.10)' : colors.border },
    ]}>
      <View style={styles.sectionHeader}>
        <Ionicons name={icon as any} size={16} color={colors.primary} />
        <Text style={[styles.sectionTitle, { color: colors.secondary ?? colors.onSurfaceVariant }]}>{title}</Text>
      </View>
      {children}
    </View>
  );
}

function FormInput({ label, value, onChangeText, placeholder, keyboardType, multiline, style }: any) {
  const { colors, isDark } = useTheme();
  return (
    <View style={styles.fieldWrap}>
      <Text style={[styles.fieldLabel, { color: colors.onSurfaceVariant }]}>{label}</Text>
      <TextInput
        style={[
          styles.input,
          { backgroundColor: isDark ? '#262626' : colors.surfaceContainerLow, borderColor: isDark ? 'rgba(255,255,255,0.10)' : colors.border, color: colors.onSurface },
          multiline && { height: 72, textAlignVertical: 'top' },
          style,
        ]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.onSurfaceVariant + '60'}
        keyboardType={keyboardType ?? 'default'}
        multiline={multiline}
        selectionColor={colors.primaryContainer}
      />
    </View>
  );
}

export default function CreateCouponScreen() {
  const { colors, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const { editId } = useLocalSearchParams<{ editId?: string }>();

  const existing = editId ? INITIAL_COUPONS.find(c => c.id === editId) : null;

  const [code,           setCode]           = useState(existing?.code         ?? '');
  const [description,    setDescription]    = useState(existing?.description  ?? '');
  const [discountType,   setDiscountType]   = useState<DiscountType>(existing?.discountType ?? 'percentage');
  const [discountValue,  setDiscountValue]  = useState(String(existing?.discountValue ?? ''));
  const [totalUses,      setTotalUses]      = useState(String(existing?.totalUses     ?? ''));
  const [limitPerUser,   setLimitPerUser]   = useState(String(existing?.limitPerUser  ?? '1'));
  const [startDate,      setStartDate]      = useState(existing?.startDate ?? '');
  const [endDate,        setEndDate]        = useState(existing?.endDate   ?? '');

  const inputBg  = isDark ? '#262626' : colors.surfaceContainerLow;
  const inputBor = isDark ? 'rgba(255,255,255,0.10)' : colors.border;

  const handleGenerate = () => {
    if (!code.trim()) {
      Alert.alert('Missing Code', 'Please enter a coupon code.'); return;
    }
    if (!discountValue) {
      Alert.alert('Missing Value', 'Please enter a discount value.'); return;
    }
    Alert.alert(
      editId ? 'Coupon Updated' : 'Coupon Created',
      `Coupon "${code.toUpperCase()}" has been ${editId ? 'updated' : 'created'} successfully.`,
      [{ text: 'OK', onPress: () => router.back() }],
    );
  };

  return (
    <ScreenWrapper noPadding>
      {/* TopBar */}
      <View style={[
        styles.topBar,
        { paddingTop: insets.top, backgroundColor: `${colors.background}CC`, borderBottomColor: isDark ? 'rgba(255,255,255,0.10)' : colors.border },
      ]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.iconBtn}>
          <Ionicons name="arrow-back" size={22} color={colors.primaryContainer} />
        </TouchableOpacity>
        <Text style={[styles.topBarTitle, { color: colors.onSurface }]}>
          {editId ? 'Edit Coupon' : 'Create Coupon'}
        </Text>
        <View style={styles.iconBtn} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 100 }]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Hero */}
        <View style={[styles.hero, { backgroundColor: colors.surfaceContainerHigh, borderColor: isDark ? 'rgba(255,255,255,0.05)' : colors.border }]}>
          <View style={[styles.heroIcon, { backgroundColor: colors.primaryContainer }]}>
            <Ionicons name="ticket" size={28} color={colors.onPrimaryContainer} />
          </View>
          <Text style={[styles.heroTitle, { color: colors.onSurface }]}>New Promotion</Text>
          <Text style={[styles.heroSub, { color: colors.onSurfaceVariant }]}>
            Define your campaign rules and limits below.
          </Text>
        </View>

        {/* Basic Info */}
        <SectionCard icon="information-circle-outline" title="BASIC INFORMATION">
          <FormInput label="COUPON CODE" value={code} onChangeText={setCode} placeholder="e.g., LAVA25"
            style={{ fontFamily: FontFamily.heading, fontSize: 18, letterSpacing: 2, color: colors.primary }}
          />
          <FormInput label="INTERNAL DESCRIPTION" value={description} onChangeText={setDescription}
            placeholder="Summer 2024 campaign for premium users..." multiline
          />
        </SectionCard>

        {/* Discount Config */}
        <SectionCard icon="cash-outline" title="DISCOUNT CONFIGURATION">
          {/* Type selector */}
          <View style={styles.typeRow}>
            {(['percentage', 'fixed'] as DiscountType[]).map(t => (
              <TouchableOpacity
                key={t}
                style={[
                  styles.typeBtn,
                  {
                    backgroundColor: discountType === t ? `${colors.primaryContainer}20` : inputBg,
                    borderColor:     discountType === t ? colors.primaryContainer : inputBor,
                  },
                ]}
                onPress={() => setDiscountType(t)}
              >
                <Ionicons
                  name={t === 'percentage' ? 'logo-usd' : 'cash-outline'}
                  size={20}
                  color={discountType === t ? colors.primaryContainer : colors.onSurfaceVariant}
                />
                <Text style={[styles.typeBtnText, { color: discountType === t ? colors.primaryContainer : colors.onSurface }]}>
                  {t === 'percentage' ? 'Percentage' : 'Fixed Amount'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <View style={styles.fieldWrap}>
            <Text style={[styles.fieldLabel, { color: colors.onSurfaceVariant }]}>DISCOUNT VALUE</Text>
            <View style={styles.valueInputRow}>
              <TextInput
                style={[styles.input, styles.valueInput, { backgroundColor: inputBg, borderColor: inputBor, color: colors.onSurface }]}
                value={discountValue}
                onChangeText={setDiscountValue}
                placeholder="0.00"
                placeholderTextColor={colors.onSurfaceVariant + '60'}
                keyboardType="decimal-pad"
                selectionColor={colors.primaryContainer}
              />
              <Text style={[styles.valueSymbol, { color: colors.onSurfaceVariant }]}>
                {discountType === 'percentage' ? '%' : '$'}
              </Text>
            </View>
          </View>
        </SectionCard>

        {/* Usage Constraints */}
        <SectionCard icon="lock-closed-outline" title="USAGE CONSTRAINTS">
          <View style={styles.twoCol}>
            <FormInput label="TOTAL INVENTORY" value={totalUses} onChangeText={setTotalUses}
              placeholder="∞" keyboardType="number-pad" style={{ flex: 1 }}
            />
            <FormInput label="LIMIT PER USER" value={limitPerUser} onChangeText={setLimitPerUser}
              placeholder="1" keyboardType="number-pad" style={{ flex: 1 }}
            />
          </View>
        </SectionCard>

        {/* Validity Period */}
        <SectionCard icon="calendar-outline" title="VALIDITY PERIOD">
          <FormInput label="START DATE (YYYY-MM-DD)" value={startDate} onChangeText={setStartDate}
            placeholder="2024-07-01" keyboardType="numbers-and-punctuation"
          />
          <FormInput label="END DATE (YYYY-MM-DD)" value={endDate} onChangeText={setEndDate}
            placeholder="2024-12-31" keyboardType="numbers-and-punctuation"
          />
        </SectionCard>

        {/* Divider decoration */}
        <View style={styles.divider}>
          <View style={[styles.dividerLine, { backgroundColor: isDark ? 'rgba(255,255,255,0.10)' : colors.border }]} />
          <View style={[styles.dividerDot, { backgroundColor: `${colors.primaryContainer}66` }]} />
          <View style={[styles.dividerLine, { backgroundColor: isDark ? 'rgba(255,255,255,0.10)' : colors.border }]} />
        </View>
      </ScrollView>

      {/* Sticky CTA */}
      <View style={[styles.footer, { paddingBottom: insets.bottom + Spacing.md, backgroundColor: `${colors.background}E6` }]}>
        <TouchableOpacity
          style={[styles.generateBtn, { backgroundColor: colors.primaryContainer, shadowColor: '#f56e0f' }]}
          onPress={handleGenerate}
          activeOpacity={0.88}
        >
          <Ionicons name="sparkles-outline" size={20} color={colors.onPrimaryContainer} />
          <Text style={[styles.generateText, { color: colors.onPrimaryContainer }]}>
            {editId ? 'Update Coupon' : 'Generate Coupon'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  topBar: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: Spacing.gutter, paddingBottom: Spacing.sm,
    borderBottomWidth: 1, zIndex: 10, minHeight: 56,
  },
  iconBtn: { width: 36, height: 36, justifyContent: 'center', alignItems: 'center' },
  topBarTitle: { fontFamily: FontFamily.heading, fontSize: 18, fontWeight: '600', letterSpacing: -0.2 },
  scroll: { flex: 1 },
  content: { padding: Spacing.gutter, gap: Spacing.md },
  hero: {
    borderRadius: 24, borderWidth: 1,
    alignItems: 'center', padding: Spacing.lg, gap: Spacing.xs, overflow: 'hidden',
  },
  heroIcon: { width: 64, height: 64, borderRadius: 32, justifyContent: 'center', alignItems: 'center', marginBottom: 4 },
  heroTitle: { fontFamily: FontFamily.heading, fontSize: 24, fontWeight: '600', letterSpacing: -0.3 },
  heroSub: { fontFamily: FontFamily.body, fontSize: 13, textAlign: 'center', opacity: 0.7 },
  sectionCard: { borderRadius: 24, borderWidth: 1, padding: Spacing.lg, gap: Spacing.md },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: Spacing.xs },
  sectionTitle: { fontFamily: FontFamily.mono, fontSize: 11, fontWeight: '500', letterSpacing: 2, textTransform: 'uppercase' },
  fieldWrap: { gap: 6 },
  fieldLabel: { fontFamily: FontFamily.mono, fontSize: 9, fontWeight: '500', letterSpacing: 2, textTransform: 'uppercase', marginLeft: 4 },
  input: { borderRadius: Radius.xl, borderWidth: 1, paddingHorizontal: Spacing.md, paddingVertical: 10, fontFamily: FontFamily.body, fontSize: 14 },
  typeRow: { flexDirection: 'row', gap: Spacing.sm },
  typeBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: Spacing.xs, borderRadius: Radius.xl, borderWidth: 1, paddingVertical: Spacing.md },
  typeBtnText: { fontFamily: FontFamily.mono, fontSize: 11, fontWeight: '500' },
  valueInputRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  valueInput: { flex: 1 },
  valueSymbol: { fontFamily: FontFamily.heading, fontSize: 20, fontWeight: '600', marginRight: 4 },
  twoCol: { flexDirection: 'row', gap: Spacing.sm },
  divider: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: Spacing.md, paddingVertical: Spacing.md },
  dividerLine: { height: 1, width: 48 },
  dividerDot: { width: 8, height: 8, borderRadius: 4 },
  footer: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    paddingHorizontal: Spacing.gutter, paddingTop: Spacing.sm,
    borderTopWidth: 1, borderTopColor: 'transparent',
  },
  generateBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: Spacing.sm, borderRadius: 24, paddingVertical: Spacing.md,
    shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.30, shadowRadius: 20, elevation: 8,
  },
  generateText: { fontFamily: FontFamily.heading, fontSize: 16, fontWeight: '700', letterSpacing: -0.2 },
});