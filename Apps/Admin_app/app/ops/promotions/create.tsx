/**
 * app/ops/promotions/create.tsx
 *
 * Create a promotion: pick type (Coupon / Referral Bonus / First Order
 * Discount / Free Delivery / Happy Hour / Restaurant Discount), fill in
 * details, optionally push to selected users.
 *
 * "Push to selected users" is a toggle only — the actual user-picker UI
 * isn't spec'd yet, so it's stubbed as a disabled-until-toggled note.
 * Submission is a console.log stub — no promotions endpoint exists yet.
 */

import React, { useState } from 'react';
import { ScrollView, View, Text, TextInput, Pressable, Switch, StyleSheet } from 'react-native';
import { Stack, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import ScreenWrapper from '@/components/ScreenWrapper';
import { useTheme } from '@/context/ThemeContext';
import { Spacing, Radius, FontFamily } from '@/constants/theme';
import {
  PromotionType,
  PROMOTION_TYPE_LABEL,
  PROMOTION_TYPE_ICON,
} from '@/types/ops';

const TYPES = Object.keys(PROMOTION_TYPE_LABEL) as PromotionType[];

export default function CreatePromotionScreen() {
  const { colors } = useTheme();
  const [type, setType] = useState<PromotionType>('coupon');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [discountValue, setDiscountValue] = useState('');
  const [pushToSelected, setPushToSelected] = useState(false);

  const handleCreate = () => {
    // ⚠️ UNVERIFIED — no promotions endpoint exists yet
    console.log('🎟️ [CreatePromotion] submit', {
      type, title, description, discountValue, pushToSelected,
    });
    router.back();
  };

  return (
    <ScreenWrapper>
      <Stack.Screen options={{ title: 'Create Promotion' }} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={[styles.sectionLabel, { color: colors.onSurfaceVariant }]}>Type</Text>
        <View style={styles.typeGrid}>
          {TYPES.map((t) => {
            const active = type === t;
            return (
              <Pressable
                key={t}
                onPress={() => setType(t)}
                style={[
                  styles.typeChip,
                  { borderColor: colors.borderSubtle, backgroundColor: colors.surfaceContainer },
                  active && { backgroundColor: colors.primaryContainer, borderColor: colors.primaryContainer },
                ]}
              >
                <Ionicons
                  name={PROMOTION_TYPE_ICON[t] as keyof typeof Ionicons.glyphMap}
                  size={16}
                  color={active ? colors.onPrimaryContainer : colors.onSurfaceVariant}
                />
                <Text
                  style={[
                    styles.typeChipText,
                    { color: active ? colors.onPrimaryContainer : colors.onSurfaceVariant },
                  ]}
                >
                  {PROMOTION_TYPE_LABEL[t]}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <Field label="Title" colors={colors}>
          <TextInput
            style={[styles.input, { color: colors.onSurface, backgroundColor: colors.surfaceContainer, borderColor: colors.borderSubtle }]}
            placeholder="e.g. Weekend 20% Off"
            placeholderTextColor={colors.onSurfaceVariant + '80'}
            value={title}
            onChangeText={setTitle}
          />
        </Field>

        <Field label="Description" colors={colors}>
          <TextInput
            style={[
              styles.input, styles.textArea,
              { color: colors.onSurface, backgroundColor: colors.surfaceContainer, borderColor: colors.borderSubtle },
            ]}
            placeholder="Short description shown to users"
            placeholderTextColor={colors.onSurfaceVariant + '80'}
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={3}
          />
        </Field>

        <Field label="Discount value" colors={colors}>
          <TextInput
            style={[styles.input, { color: colors.onSurface, backgroundColor: colors.surfaceContainer, borderColor: colors.borderSubtle }]}
            placeholder="e.g. 20% or ₦500"
            placeholderTextColor={colors.onSurfaceVariant + '80'}
            value={discountValue}
            onChangeText={setDiscountValue}
          />
        </Field>

        <View style={[styles.toggleRow, { backgroundColor: colors.surfaceContainer, borderColor: colors.borderSubtle }]}>
          <View style={styles.toggleText}>
            <Text style={[styles.toggleLabel, { color: colors.onSurface }]}>Push to selected users</Text>
            <Text style={[styles.toggleSubtext, { color: colors.onSurfaceVariant }]}>
              {pushToSelected
                ? 'A user picker will open after saving this promotion.'
                : 'Off — promotion will be available platform-wide only.'}
            </Text>
          </View>
          <Switch
            value={pushToSelected}
            onValueChange={setPushToSelected}
            trackColor={{ false: colors.surfaceContainerHigh, true: colors.primaryContainer }}
            thumbColor={colors.surface}
          />
        </View>

        <Pressable
          onPress={handleCreate}
          disabled={!title.trim()}
          style={[
            styles.submitBtn,
            { backgroundColor: colors.primaryContainer, opacity: title.trim() ? 1 : 0.5 },
          ]}
        >
          <Text style={[styles.submitBtnText, { color: colors.onPrimaryContainer }]}>Create Promotion</Text>
        </Pressable>
      </ScrollView>
    </ScreenWrapper>
  );
}

function Field({ label, colors, children }: { label: string; colors: ReturnType<typeof useTheme>['colors']; children: React.ReactNode }) {
  return (
    <View style={styles.field}>
      <Text style={[styles.sectionLabel, { color: colors.onSurfaceVariant }]}>{label}</Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  content: { gap: Spacing.md, paddingBottom: Spacing.xl, paddingHorizontal: Spacing.gutter },
  sectionLabel: {
    fontFamily: FontFamily.body, fontSize: 11, fontWeight: '700',
    textTransform: 'uppercase', letterSpacing: 0.5,
  },
  typeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  typeChip: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    borderWidth: 1, borderRadius: Radius.full,
    paddingHorizontal: Spacing.sm, paddingVertical: 8,
  },
  typeChipText: { fontFamily: FontFamily.body, fontSize: 12, fontWeight: '600' },
  field: { gap: Spacing.xs },
  input: {
    fontFamily: FontFamily.body, fontSize: 14,
    borderWidth: 1, borderRadius: Radius.md,
    paddingHorizontal: Spacing.sm, paddingVertical: Spacing.sm,
  },
  textArea: { minHeight: 80, textAlignVertical: 'top' },
  toggleRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    borderWidth: 1, borderRadius: Radius.lg, padding: Spacing.md, gap: Spacing.sm,
  },
  toggleText: { flex: 1, gap: 2 },
  toggleLabel: { fontFamily: FontFamily.body, fontSize: 14, fontWeight: '600' },
  toggleSubtext: { fontFamily: FontFamily.body, fontSize: 11, lineHeight: 15 },
  submitBtn: {
    borderRadius: Radius.full, paddingVertical: Spacing.md, alignItems: 'center', marginTop: Spacing.sm,
  },
  submitBtnText: { fontFamily: FontFamily.body, fontSize: 14, fontWeight: '700' },
});