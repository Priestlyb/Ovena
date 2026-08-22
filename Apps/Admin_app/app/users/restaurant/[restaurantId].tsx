/**
 * app/users/restaurant/[restaurantId].tsx
 *
 * Restaurant profile viewer, now backed by real Business data from
 * AppDataContext (GET /api/admin/employees/businesses/). Revenue and
 * commission fields aren't on this endpoint yet — rendered as
 * "Not available yet".
 */

import React, { useMemo } from 'react';
import { ScrollView, View, Text, Pressable, StyleSheet } from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import ScreenWrapper from '@/components/ScreenWrapper';
import { useTheme } from '@/context/ThemeContext';
import { useAppData } from '@/context/AppDataContext';
import { Spacing, Radius, FontFamily } from '@/constants/theme';
import { businessToRestaurantDisplay } from '@/utils/entityMappers';

export default function RestaurantProfileScreen() {
  const { restaurantId } = useLocalSearchParams<{ restaurantId: string }>();
  const { colors } = useTheme();
  const { data } = useAppData();

  const restaurant = useMemo(() => {
    const business = data?.businesses?.results.find((b) => String(b.id) === restaurantId);
    return business ? businessToRestaurantDisplay(business) : null;
  }, [data, restaurantId]);

  const runAction = (action: string) => {
    console.log(`🏪 [RestaurantProfile] ${action}`, restaurantId);
  };

  if (!restaurant) {
    return (
      <ScreenWrapper>
        <Stack.Screen options={{ title: 'Restaurant' }} />
        <View style={styles.notFound}>
          <Text style={{ color: colors.onSurfaceVariant }}>
            Restaurant not found — data may still be loading, or this business isn't on the currently loaded page.
          </Text>
        </View>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper>
      <Stack.Screen options={{ title: restaurant.name }} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={[styles.card, { backgroundColor: colors.surfaceContainer, borderColor: colors.borderSubtle }]}>
          <View style={styles.rowBetween}>
            <Text style={[styles.name, { color: colors.onSurface }]}>{restaurant.name}</Text>
            <OnboardingPill complete={restaurant.onboardingComplete} />
          </View>
          <Text style={[styles.subtle, { color: colors.onSurfaceVariant }]}>
            {restaurant.businessType} · {restaurant.country} · {restaurant.branchesCount} branch
            {restaurant.branchesCount === 1 ? '' : 'es'}
          </Text>
        </View>

        <Section title="Performance" colors={colors}>
          <InfoRow label="Revenue" value={fmtMoneyOrNA(restaurant.revenue)} colors={colors} />
        </Section>

        <Section title="Commission" colors={colors}>
          <InfoRow label="Rate" value={restaurant.commissionPercent != null ? `${restaurant.commissionPercent}%` : 'Not available yet'} colors={colors} />
          <InfoRow label="Owed" value={fmtMoneyOrNA(restaurant.commissionOwed)} colors={colors} />
        </Section>

        <Section title="Contact" colors={colors}>
          <InfoRow label="Email" value={restaurant.email} colors={colors} />
          <InfoRow label="Phone" value={restaurant.phone} colors={colors} />
          <InfoRow label="Address" value={restaurant.address} colors={colors} />
        </Section>

        {restaurant.adminUser && (
          <Section title="Business Admin" colors={colors}>
            <InfoRow label="Email" value={restaurant.adminUser.email} colors={colors} />
            <InfoRow label="Phone" value={restaurant.adminUser.phone} colors={colors} />
          </Section>
        )}

        <View style={styles.actionsGrid}>
          <ActionButton label="Approve" icon="checkmark-circle-outline" onPress={() => runAction('approve')} colors={colors} />
          <ActionButton label="Suspend" icon="pause-circle-outline" onPress={() => runAction('suspend')} colors={colors} accent="error" />
          <ActionButton label="Feature" icon="star-outline" onPress={() => runAction('feature')} colors={colors} accent="lava" />
          <ActionButton label="Edit Commission" icon="pricetag-outline" onPress={() => runAction('edit_commission')} colors={colors} />
          <ActionButton label="Add Promotion" icon="megaphone-outline" onPress={() => runAction('add_promotion')} colors={colors} accent="lava" />
          <ActionButton label="Hide" icon="eye-off-outline" onPress={() => runAction('hide')} colors={colors} accent="error" />
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
}

function fmtMoneyOrNA(amount: number | null) {
  return amount == null ? 'Not available yet' : `₦${amount.toLocaleString()}`;
}

function OnboardingPill({ complete }: { complete: boolean }) {
  const { colors } = useTheme();
  const bg = complete ? colors.success + '33' : colors.secondaryContainer;
  const fg = complete ? colors.success : colors.onSecondaryContainer;
  return (
    <View style={[styles.pill, { backgroundColor: bg }]}>
      <Text style={[styles.pillText, { color: fg }]}>{complete ? 'Onboarded' : 'Pending'}</Text>
    </View>
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
  notFound: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: Spacing.xl },
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