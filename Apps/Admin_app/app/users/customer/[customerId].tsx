/**
 * app/users/customer/[customerId].tsx
 *
 * Customer profile viewer. Actions stubbed with console.log.
 */

import React, { useMemo } from 'react';
import { ScrollView, View, Text, Pressable, StyleSheet } from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import ScreenWrapper from '@/components/ScreenWrapper';
import { useTheme } from '@/context/ThemeContext';
import { Spacing, Radius, FontFamily } from '@/constants/theme';
import { getMockCustomer } from '@/data/mockEntities';

export default function CustomerProfileScreen() {
  const { customerId } = useLocalSearchParams<{ customerId: string }>();
  const { colors } = useTheme();
  const customer = useMemo(() => getMockCustomer(customerId ?? ''), [customerId]);

  const runAction = (action: string) => {
    console.log(`🧑 [CustomerProfile] ${action}`, customer.customerId);
  };

  return (
    <ScreenWrapper>
      <Stack.Screen options={{ title: customer.name }} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={[styles.card, { backgroundColor: colors.surfaceContainer, borderColor: colors.borderSubtle }]}>
          <Text style={[styles.name, { color: colors.onSurface }]}>{customer.name}</Text>
          <Text style={[styles.subtle, { color: colors.onSurfaceVariant }]}>{customer.address}</Text>
          {customer.suspended && (
            <View style={[styles.pill, { backgroundColor: colors.errorContainer, alignSelf: 'flex-start' }]}>
              <Text style={[styles.pillText, { color: colors.onErrorContainer }]}>Suspended</Text>
            </View>
          )}
        </View>

        <Section title="Activity" colors={colors}>
          <InfoRow label="Total orders" value={`${customer.totalOrders}`} colors={colors} />
          <InfoRow label="Total spending" value={`₦${customer.totalSpending.toLocaleString()}`} colors={colors} />
          <InfoRow label="Wallet balance" value={`₦${customer.walletBalance.toLocaleString()}`} colors={colors} />
        </Section>

        <Section title="Contact" colors={colors}>
          <InfoRow label="Phone" value={customer.phone} colors={colors} />
          <InfoRow label="Email" value={customer.email} colors={colors} />
        </Section>

        {customer.referrals.length > 0 && (
          <Section title="Referrals" colors={colors}>
            {customer.referrals.map((r, idx) => (
              <View key={idx} style={styles.rowBetween}>
                <Text style={[styles.subtle, { color: colors.onSurfaceVariant }]}>{r.referredName}</Text>
                <Text style={[styles.infoValue, { color: colors.onSurface }]}>₦{r.rewardEarned.toLocaleString()}</Text>
              </View>
            ))}
          </Section>
        )}

        <Section title="Recent Orders" colors={colors}>
          {customer.recentOrders.map((o) => (
            <View key={o.orderId} style={styles.rowBetween}>
              <Text style={[styles.subtle, { color: colors.onSurfaceVariant }]}>
                {o.orderId} · {o.restaurantName}
              </Text>
              <Text style={[styles.infoValue, { color: colors.onSurface }]}>₦{o.total.toLocaleString()}</Text>
            </View>
          ))}
        </Section>

        <View style={styles.actionsGrid}>
          <ActionButton label="Suspend Account" icon="pause-circle-outline" onPress={() => runAction('suspend')} colors={colors} accent="error" />
          <ActionButton label="Refund" icon="cash-outline" onPress={() => runAction('refund')} colors={colors} />
          <ActionButton label="Credit Wallet" icon="wallet-outline" onPress={() => runAction('credit_wallet')} colors={colors} accent="lava" />
          <ActionButton label="Issue Coupon" icon="pricetag-outline" onPress={() => runAction('issue_coupon')} colors={colors} accent="lava" />
          <ActionButton label="Reset Password" icon="key-outline" onPress={() => runAction('reset_password')} colors={colors} />
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
}

function Section({ title, colors, children }: { title: string; colors: ReturnType<typeof useTheme>['colors']; children: React.ReactNode }) {
  return (
    <View style={[styles.card, { backgroundColor: colors.surfaceContainer, borderColor: colors.borderSubtle }]}>
      <Text style={[styles.sectionTitle, { color: colors.onSurfaceVariant }]}>{title}</Text>
      <View style={styles.sectionBody}>{children}</View>
    </View>
  );
}

function InfoRow({ label, value, colors }: { label: string; value: string; colors: ReturnType<typeof useTheme>['colors'] }) {
  return (
    <View style={styles.rowBetween}>
      <Text style={[styles.subtle, { color: colors.onSurfaceVariant }]}>{label}</Text>
      <Text style={[styles.infoValue, { color: colors.onSurface }]}>{value}</Text>
    </View>
  );
}

function ActionButton({
  label, icon, onPress, colors, accent,
}: {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
  colors: ReturnType<typeof useTheme>['colors'];
  accent?: 'error' | 'lava';
}) {
  const fg = accent === 'error' ? colors.error : accent === 'lava' ? colors.primaryContainer : colors.onSurface;
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.actionBtn,
        { backgroundColor: colors.surfaceContainer, borderColor: colors.borderSubtle, opacity: pressed ? 0.8 : 1 },
      ]}
    >
      <Ionicons name={icon} size={18} color={fg} />
      <Text style={[styles.actionLabel, { color: fg }]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  content: { gap: Spacing.md, paddingBottom: Spacing.xl, paddingHorizontal: Spacing.gutter },
  card: { borderRadius: Radius.lg, borderWidth: 1, padding: Spacing.md, gap: Spacing.xs },
  rowBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  name: { fontFamily: FontFamily.heading, fontSize: 18, fontWeight: '700' },
  subtle: { fontFamily: FontFamily.body, fontSize: 12 },
  sectionTitle: { fontFamily: FontFamily.body, fontSize: 11, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 },
  sectionBody: { gap: Spacing.xs },
  infoValue: { fontFamily: FontFamily.body, fontSize: 13, fontWeight: '500' },
  pill: { paddingHorizontal: Spacing.sm, paddingVertical: 4, borderRadius: Radius.full },
  pillText: { fontFamily: FontFamily.body, fontSize: 11, fontWeight: '700' },
  actionsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  actionBtn: {
    flexBasis: '47%', flexDirection: 'row', alignItems: 'center', gap: 6,
    borderRadius: Radius.md, borderWidth: 1, padding: Spacing.sm,
  },
  actionLabel: { fontFamily: FontFamily.body, fontSize: 12, fontWeight: '600' },
});