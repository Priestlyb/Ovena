/**
 * app/coupons/create.tsx
 *
 * Create / Edit Coupon — POST /api/admin/coupons/create/ and
 * PUT /api/admin/coupons/update/{id}/ via services/actionsApi.ts.
 *
 * Fields intentionally NOT present here (removed after confirming against
 * a real coupon object): category, business id, is_active, "unlimited
 * uses" toggle. None of those exist on a real Coupon — they were only ever
 * present in an earlier swagger/OpenAPI stub example.
 *
 * `item` IS present and required when coupon_type is "itemdiscount" —
 * confirmed via a live 400 response: {"item": ["Item is required for
 * itemdiscount."]}. It never appears on the GET Coupon shape (likely
 * write-only / resolved away on read), which also means there's currently
 * no way to show which item an existing itemdiscount coupon is tied to —
 * itemId starts blank on edit and has to be re-entered.
 *
 * buy_amount/get_amount/buy_item/get_item are real fields (buy_item/
 * get_item confirmed null in every real sample seen), kept behind an
 * optional "Buy/Get Rules" toggle since their write behavior with a
 * non-null value is still unconfirmed.
 */

import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  ScrollView, StyleSheet, Alert, Switch, ActivityIndicator,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import ScreenWrapper from '@/components/ScreenWrapper';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { useAppData } from '@/context/AppDataContext';
import { Spacing, Radius, FontFamily } from '@/constants/theme';
import { createCoupon, updateCoupon, CouponsActionsApiError } from '@/services/actionsApi';
import { CouponType, CouponScope, CouponDiscountType } from '@/types/appData';

function SectionCard({ icon, title, children }: { icon: string; title: string; children: React.ReactNode }) {
  const { colors, isDark } = useTheme();
  return (
    <View style={[styles.sectionCard, { backgroundColor: isDark ? '#1b1b1e' : colors.surfaceContainer, borderColor: isDark ? 'rgba(255,255,255,0.10)' : colors.border }]}>
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

function ToggleRow({ label, sub, value, onValueChange }: { label: string; sub?: string; value: boolean; onValueChange: (v: boolean) => void }) {
  const { colors } = useTheme();
  return (
    <View style={styles.toggleRow}>
      <View style={{ flex: 1 }}>
        <Text style={[styles.fieldLabel, { color: colors.onSurfaceVariant, marginLeft: 0 }]}>{label}</Text>
        {!!sub && <Text style={[styles.toggleSub, { color: colors.onSurfaceVariant }]}>{sub}</Text>}
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: colors.surfaceContainerHighest, true: colors.primaryContainer }}
        thumbColor={colors.onSurface}
      />
    </View>
  );
}

export default function CreateCouponScreen() {
  const { colors, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const { tokens } = useAuth();
  const { data, refresh } = useAppData();
  const { editId } = useLocalSearchParams<{ editId?: string }>();
  const isEditing = !!editId;

  const existing = editId ? data?.coupons.find(c => String(c.id) === editId) : null;

  const [code,          setCode]          = useState(existing?.code ?? '');
  const [description,   setDescription]   = useState(existing?.description ?? '');
  const [couponType,    setCouponType]    = useState<CouponType>(existing?.coupon_type ?? 'itemdiscount');
  const [scope,         setScope]         = useState<CouponScope>(existing?.scope ?? 'global');
  const [itemId,        setItemId]        = useState(''); // required for itemdiscount — not in GET shape, so never prefilled
  const [discountType,  setDiscountType]  = useState<CouponDiscountType>(existing?.discount_type ?? 'percent');
  const [discountValue, setDiscountValue] = useState(existing?.discount_value ?? '');
  const [maxUses,       setMaxUses]       = useState(existing ? String(existing.max_uses) : '2000');
  const [validFrom,     setValidFrom]     = useState(existing?.valid_from?.slice(0, 10) ?? '');
  const [validUntil,    setValidUntil]    = useState(existing?.valid_until?.slice(0, 10) ?? '');
  const [isReward,      setIsReward]      = useState(existing?.is_reward ?? false);
  const [showBuyGet,    setShowBuyGet]    = useState(!!(existing?.buy_amount || existing?.get_amount));
  const [buyAmount,     setBuyAmount]     = useState(existing?.buy_amount ? String(existing.buy_amount) : '');
  const [getAmount,     setGetAmount]     = useState(existing?.get_amount ? String(existing.get_amount) : '');
  const [buyItemId,     setBuyItemId]     = useState(existing?.buy_item != null ? String(existing.buy_item) : '');
  const [getItemId,     setGetItemId]     = useState(existing?.get_item != null ? String(existing.get_item) : '');
  const [submitting,    setSubmitting]    = useState(false);

  const inputBg  = isDark ? '#262626' : colors.surfaceContainerLow;
  const inputBor = isDark ? 'rgba(255,255,255,0.10)' : colors.border;

  const toISO = (dateStr: string, endOfDay: boolean) => {
    const d = new Date(`${dateStr}T${endOfDay ? '23:59:59' : '00:00:00'}`);
    return d.toISOString();
  };

  const handleGenerate = async () => {
    if (!code.trim()) return Alert.alert('Missing Code', 'Please enter a coupon code.');
    if (!discountValue) return Alert.alert('Missing Value', 'Please enter a discount value.');
    if (!maxUses || isNaN(Number(maxUses))) return Alert.alert('Missing Uses', 'Please enter a max uses number.');
    if (!validFrom || !validUntil) return Alert.alert('Missing Dates', 'Please enter both a start and end date (YYYY-MM-DD).');
    if (couponType === 'itemdiscount' && !itemId.trim()) {
      return Alert.alert('Missing Item', 'Item ID is required for item-discount coupons.');
    }
    if (!tokens?.accessToken) return Alert.alert('Not signed in', 'Please sign in again and retry.');

    const payload = {
      code: code.trim(),
      description: description.trim(),
      coupon_type: couponType,
      scope,
      discount_type: discountType,
      discount_value: discountValue,
      max_uses: Number(maxUses),
      valid_from: toISO(validFrom, false),
      valid_until: toISO(validUntil, true),
      is_reward: isReward,
      item: couponType === 'itemdiscount' && itemId ? Number(itemId) : undefined,
      buy_amount: showBuyGet && buyAmount ? Number(buyAmount) : undefined,
      get_amount: showBuyGet && getAmount ? Number(getAmount) : undefined,
      buy_item: showBuyGet && buyItemId ? Number(buyItemId) : undefined,
      get_item: showBuyGet && getItemId ? Number(getItemId) : undefined,
    };

    setSubmitting(true);
    try {
      if (isEditing) {
        await updateCoupon(editId!, payload, tokens.accessToken);
      } else {
        await createCoupon(payload, tokens.accessToken);
      }

      await refresh();
      Alert.alert(
        isEditing ? 'Coupon Updated' : 'Coupon Created',
        `Coupon "${code.toUpperCase()}" has been ${isEditing ? 'updated' : 'created'} successfully.`,
        [{ text: 'OK', onPress: () => router.back() }],
      );
    } catch (err) {
      const message = err instanceof CouponsActionsApiError ? err.message : `Something went wrong ${isEditing ? 'updating' : 'creating'} the coupon.`;
      Alert.alert(isEditing ? "Couldn't update coupon" : "Couldn't create coupon", message);
    } finally {
      setSubmitting(false);
    }
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
          {isEditing ? 'Edit Coupon' : 'Create Coupon'}
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
          <Text style={[styles.heroTitle, { color: colors.onSurface }]}>
            {isEditing ? 'Edit Promotion' : 'New Promotion'}
          </Text>
          <Text style={[styles.heroSub, { color: colors.onSurfaceVariant }]}>
            Define your campaign rules and limits below.
          </Text>
        </View>

        {/* Basic Info */}
        <SectionCard icon="information-circle-outline" title="BASIC INFORMATION">
          <FormInput label="COUPON CODE" value={code} onChangeText={setCode} placeholder="e.g., new chicken 4"
            style={{ fontFamily: FontFamily.heading, fontSize: 18, letterSpacing: 2, color: colors.primary }}
          />
          <FormInput label="INTERNAL DESCRIPTION" value={description} onChangeText={setDescription}
            placeholder="New burgers are 20% off for the next 20 days" multiline
          />
        </SectionCard>

        {/* Coupon Type & Scope */}
        <SectionCard icon="pricetag-outline" title="COUPON TYPE & SCOPE">
          <Text style={[styles.fieldLabel, { color: colors.onSurfaceVariant }]}>COUPON TYPE</Text>
          <View style={styles.typeRow}>
            {(['itemdiscount', 'delivery'] as CouponType[]).map(t => (
              <TouchableOpacity
                key={t}
                style={[
                  styles.typeBtn,
                  {
                    backgroundColor: couponType === t ? `${colors.primaryContainer}20` : inputBg,
                    borderColor:     couponType === t ? colors.primaryContainer : inputBor,
                  },
                ]}
                onPress={() => setCouponType(t)}
              >
                <Text style={[styles.typeBtnText, { color: couponType === t ? colors.primaryContainer : colors.onSurface }]}>
                  {t === 'itemdiscount' ? 'Item Discount' : 'Delivery'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {couponType === 'itemdiscount' && (
            <FormInput
              label="ITEM ID (REQUIRED)"
              value={itemId}
              onChangeText={setItemId}
              placeholder="Numeric item id"
              keyboardType="number-pad"
            />
          )}

          <Text style={[styles.fieldLabel, { color: colors.onSurfaceVariant, marginTop: Spacing.sm }]}>SCOPE</Text>
          <View style={styles.typeRow}>
            {(['global', 'business'] as CouponScope[]).map(s => (
              <TouchableOpacity
                key={s}
                style={[
                  styles.typeBtn,
                  {
                    backgroundColor: scope === s ? `${colors.primaryContainer}20` : inputBg,
                    borderColor:     scope === s ? colors.primaryContainer : inputBor,
                  },
                ]}
                onPress={() => setScope(s)}
              >
                <Text style={[styles.typeBtnText, { color: scope === s ? colors.primaryContainer : colors.onSurface }]}>
                  {s === 'global' ? 'Global' : 'Business'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </SectionCard>

        {/* Discount Config */}
        <SectionCard icon="cash-outline" title="DISCOUNT CONFIGURATION">
          <View style={styles.typeRow}>
            {(['percent', 'fixed'] as CouponDiscountType[]).map(t => (
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
                  name={t === 'percent' ? 'logo-usd' : 'cash-outline'}
                  size={20}
                  color={discountType === t ? colors.primaryContainer : colors.onSurfaceVariant}
                />
                <Text style={[styles.typeBtnText, { color: discountType === t ? colors.primaryContainer : colors.onSurface }]}>
                  {t === 'percent' ? 'Percentage' : 'Fixed Amount'}
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
                placeholder="20.00"
                placeholderTextColor={colors.onSurfaceVariant + '60'}
                keyboardType="decimal-pad"
                selectionColor={colors.primaryContainer}
              />
              <Text style={[styles.valueSymbol, { color: colors.onSurfaceVariant }]}>
                {discountType === 'percent' ? '%' : '₦'}
              </Text>
            </View>
          </View>
        </SectionCard>

        {/* Buy/Get Rules */}
        <SectionCard icon="git-compare-outline" title="BUY/GET RULES (OPTIONAL)">
          <ToggleRow
            label="Enable buy/get rules"
            sub="buy_amount/get_amount/buy_item/get_item — leave off unless this coupon needs them"
            value={showBuyGet}
            onValueChange={setShowBuyGet}
          />
          {showBuyGet && (
            <>
              <View style={styles.twoCol}>
                <FormInput label="BUY AMOUNT" value={buyAmount} onChangeText={setBuyAmount} placeholder="0" keyboardType="number-pad" style={{ flex: 1 }} />
                <FormInput label="GET AMOUNT" value={getAmount} onChangeText={setGetAmount} placeholder="0" keyboardType="number-pad" style={{ flex: 1 }} />
              </View>
              <View style={styles.twoCol}>
                <FormInput label="BUY ITEM ID" value={buyItemId} onChangeText={setBuyItemId} placeholder="Item id" keyboardType="number-pad" style={{ flex: 1 }} />
                <FormInput label="GET ITEM ID" value={getItemId} onChangeText={setGetItemId} placeholder="Item id" keyboardType="number-pad" style={{ flex: 1 }} />
              </View>
            </>
          )}
        </SectionCard>

        {/* Usage Constraints */}
        <SectionCard icon="lock-closed-outline" title="USAGE CONSTRAINTS">
          <FormInput label="TOTAL INVENTORY" value={maxUses} onChangeText={setMaxUses} placeholder="2000" keyboardType="number-pad" />
        </SectionCard>

        {/* Validity Period */}
        <SectionCard icon="calendar-outline" title="VALIDITY PERIOD">
          <FormInput label="START DATE (YYYY-MM-DD)" value={validFrom} onChangeText={setValidFrom}
            placeholder="2026-08-01" keyboardType="numbers-and-punctuation"
          />
          <FormInput label="END DATE (YYYY-MM-DD)" value={validUntil} onChangeText={setValidUntil}
            placeholder="2026-08-31" keyboardType="numbers-and-punctuation"
          />
        </SectionCard>

        {/* Flags */}
        <SectionCard icon="flag-outline" title="FLAGS">
          <ToggleRow label="Reward" sub="Marks this as a reward-type coupon (is_reward)" value={isReward} onValueChange={setIsReward} />
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
          style={[styles.generateBtn, { backgroundColor: colors.primaryContainer, shadowColor: '#f56e0f', opacity: submitting ? 0.7 : 1 }]}
          onPress={handleGenerate}
          activeOpacity={0.88}
          disabled={submitting}
        >
          {submitting ? (
            <ActivityIndicator color={colors.onPrimaryContainer} />
          ) : (
            <>
              <Ionicons name="sparkles-outline" size={20} color={colors.onPrimaryContainer} />
              <Text style={[styles.generateText, { color: colors.onPrimaryContainer }]}>
                {isEditing ? 'Update Coupon' : 'Generate Coupon'}
              </Text>
            </>
          )}
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
  toggleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 2 },
  toggleSub: { fontFamily: FontFamily.body, fontSize: 11, marginTop: 2, opacity: 0.8 },
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