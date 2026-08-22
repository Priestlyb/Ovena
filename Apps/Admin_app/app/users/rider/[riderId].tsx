/**
 * app/users/rider/[riderId].tsx
 *
 * Rider profile viewer, now backed by real Driver data from AppDataContext
 * (GET /api/admin/employees/drivers/) instead of mock data. Fields not
 * present on that endpoint (earnings, wallet balance) render as
 * "Not available yet" rather than fabricated numbers.
 *
 * Actions remain console.log stubs — no admin action endpoints wired yet.
 */

import React, { useMemo } from 'react';
import { ScrollView, View, Text, Pressable, StyleSheet } from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import ScreenWrapper from '@/components/ScreenWrapper';
import { useTheme } from '@/context/ThemeContext';
import { useAppData } from '@/context/AppDataContext';
import { Spacing, Radius, FontFamily } from '@/constants/theme';
import { driverToRiderDisplay } from '@/utils/entityMappers';

export default function RiderProfileScreen() {
  const { riderId } = useLocalSearchParams<{ riderId: string }>();
  const { colors } = useTheme();
  const { data } = useAppData();

  const rider = useMemo(() => {
    const driver = data?.drivers?.results.find((d) => String(d.id) === riderId);
    return driver ? driverToRiderDisplay(driver) : null;
  }, [data, riderId]);

  const runAction = (action: string) => {
    console.log(`👤🚴 [RiderProfile] ${action}`, riderId);
  };

  if (!rider) {
    return (
      <ScreenWrapper>
        <Stack.Screen options={{ title: 'Rider' }} />
        <View style={styles.notFound}>
          <Text style={{ color: colors.onSurfaceVariant }}>
            Rider not found — data may still be loading, or this driver isn't on the currently loaded page.
          </Text>
        </View>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper>
      <Stack.Screen options={{ title: rider.name }} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={[styles.card, { backgroundColor: colors.surfaceContainer, borderColor: colors.borderSubtle }]}>
          <View style={styles.rowBetween}>
            <Text style={[styles.name, { color: colors.onSurface }]}>{rider.name}</Text>
            <AvailabilityPill availability={rider.availability} />
          </View>
          <Text style={[styles.subtle, { color: colors.onSurfaceVariant }]}>
            ★ {rider.rating} · {rider.totalDeliveries} deliveries
          </Text>
        </View>

        <Section title="Earnings" colors={colors}>
          <InfoRow label="Total earnings" value={fmtMoneyOrNA(rider.earnings)} colors={colors} />
          <InfoRow label="Wallet balance" value={fmtMoneyOrNA(rider.walletBalance)} colors={colors} />
        </Section>

        <Section title="Vehicle" colors={colors}>
          <InfoRow label="Make" value={rider.vehicle.model} colors={colors} />
          <InfoRow label="Type" value={rider.vehicle.type} colors={colors} />
          <InfoRow label="Plate" value={rider.vehicle.plateNumber} colors={colors} />
        </Section>

        <Section title="Contact" colors={colors}>
          <InfoRow label="Email" value={rider.email} colors={colors} />
          <InfoRow label="Phone" value={rider.phone} colors={colors} />
        </Section>

        <Section title="Onboarding & Status" colors={colors}>
          <InfoRow label="Account active" value={rider.isActive ? 'Yes' : 'No'} colors={colors} />
          <InfoRow label="Approved" value={rider.isApproved ? 'Yes' : 'No'} colors={colors} />
          <InfoRow label="Onboarding status" value={rider.onboardingStatus} colors={colors} />
          <InfoRow
            label="Documents"
            value={rider.documentsVerified ? 'Verified' : `${rider.pendingDocumentsCount} pending`}
            colors={colors}
          />
        </Section>

        <View style={styles.actionsGrid}>
          <ActionButton label="Approve" icon="checkmark-circle-outline" onPress={() => runAction('approve')} colors={colors} />
          <ActionButton label="Suspend" icon="pause-circle-outline" onPress={() => runAction('suspend')} colors={colors} accent="error" />
          <ActionButton label="Block" icon="close-circle-outline" onPress={() => runAction('block')} colors={colors} accent="error" />
          <ActionButton label="Reset Password" icon="key-outline" onPress={() => runAction('reset_password')} colors={colors} />
          <ActionButton label="Verify Documents" icon="document-text-outline" onPress={() => runAction('verify_documents')} colors={colors} />
          <ActionButton label="Assign Delivery" icon="navigate-outline" onPress={() => runAction('assign_delivery')} colors={colors} accent="lava" />
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
}

function fmtMoneyOrNA(amount: number | null) {
  return amount == null ? 'Not available yet' : `₦${amount.toLocaleString()}`;
}

function AvailabilityPill({ availability }: { availability: 'online' | 'offline' | 'busy' }) {
  const { colors } = useTheme();
  const map = {
    online: { bg: colors.success + '33', fg: colors.success, label: 'Online' },
    busy: { bg: colors.primaryContainer + '33', fg: colors.primaryContainer, label: 'Busy' },
    offline: { bg: colors.secondaryContainer, fg: colors.onSecondaryContainer, label: 'Offline' },
  }[availability];
  return (
    <View style={[styles.pill, { backgroundColor: map.bg }]}>
      <Text style={[styles.pillText, { color: map.fg }]}>{map.label}</Text>
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