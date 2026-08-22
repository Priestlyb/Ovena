/**
 * app/users/detail/[userId].tsx
 *
 * Unified user detail screen. Fetches GET /api/admin/users/{id}/ and
 * renders one section per profile the user actually holds — customer,
 * driver, business (admin), business_staff, app_admin — since a user can
 * hold more than one simultaneously. Each section carries its own action
 * buttons directly beneath it, scoped to that role.
 *
 * All actions are console.log stubs — no admin-action endpoints (approve,
 * suspend, refund, etc.) exist yet.
 */

import React, { useEffect, useState, useCallback } from 'react';
import { ScrollView, View, Text, Pressable, ActivityIndicator, StyleSheet } from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import ScreenWrapper from '@/components/ScreenWrapper';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { Spacing, Radius, FontFamily } from '@/constants/theme';
import { fetchUserDetail, UserDetailApiError } from '@/services/userDetailApi';
import { UserDetailResponse } from '@/types/userDetail';
import { normalizeRole, ROLE_LABEL, NormalizedRole } from '@/utils/roles';

export default function UserDetailScreen() {
  const { userId } = useLocalSearchParams<{ userId: string }>();
  const { colors } = useTheme();
  const { tokens } = useAuth();

  const [detail, setDetail] = useState<UserDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!userId || !tokens?.accessToken) return;
    setLoading(true);
    setError(null);
    try {
      const result = await fetchUserDetail(userId, tokens.accessToken);
      setDetail(result);
    } catch (err) {
      const message = err instanceof UserDetailApiError ? err.message : 'Failed to load user';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [userId, tokens]);

  useEffect(() => {
    load();
  }, [load]);

  const runAction = (action: string, context: string) => {
    // ⚠️ UNVERIFIED — no admin-action endpoints exist yet for any role.
    console.log(`👤 [UserDetail] ${action}`, { userId, context });
  };

  if (loading) {
    return (
      <ScreenWrapper>
        <Stack.Screen options={{ title: 'User' }} />
        <View style={styles.centerState}>
          <ActivityIndicator color={colors.primaryContainer} />
        </View>
      </ScreenWrapper>
    );
  }

  if (error || !detail) {
    return (
      <ScreenWrapper>
        <Stack.Screen options={{ title: 'User' }} />
        <View style={styles.centerState}>
          <Text style={{ color: colors.error, textAlign: 'center', marginBottom: Spacing.md }}>
            {error ?? 'User not found'}
          </Text>
          <Pressable onPress={load} style={[styles.retryBtn, { backgroundColor: colors.primaryContainer }]}>
            <Text style={{ color: colors.onPrimaryContainer, fontFamily: FontFamily.body, fontWeight: '700' }}>
              Retry
            </Text>
          </Pressable>
        </View>
      </ScreenWrapper>
    );
  }

  const { user, profiles } = detail;
  const normalizedRoles = user.roles.map((r) => normalizeRole(r) as NormalizedRole);

  return (
    <ScreenWrapper>
      <Stack.Screen options={{ title: user.email ?? user.phone_number ?? `User #${user.id}` }} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Identity header */}
        <View style={[styles.card, { backgroundColor: colors.surfaceContainer, borderColor: colors.borderSubtle }]}>
          <Text style={[styles.name, { color: colors.onSurface }]}>
            {user.email ?? user.phone_number ?? `User #${user.id}`}
          </Text>
          <Text style={[styles.subtle, { color: colors.onSurfaceVariant }]}>
            {user.phone_number ?? 'No phone on file'} · ID {user.id}
          </Text>
          <View style={styles.badgeRow}>
            <View style={[styles.pill, { backgroundColor: user.is_active ? colors.success + '33' : colors.errorContainer }]}>
              <Text style={[styles.pillText, { color: user.is_active ? colors.success : colors.onErrorContainer }]}>
                {user.is_active ? 'Active' : 'Inactive'}
              </Text>
            </View>
            {normalizedRoles.map((role) => (
              <View key={role} style={[styles.pill, { backgroundColor: colors.secondaryContainer }]}>
                <Text style={[styles.pillText, { color: colors.onSecondaryContainer }]}>
                  {ROLE_LABEL[role] ?? role}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Customer section */}
        {profiles.customer && detail.customer_profile && (
          <ProfileSection title="Customer Profile" colors={colors}>
            <InfoRow label="Name" value={detail.customer_profile.name} colors={colors} />
            <InfoRow label="Referral code" value={detail.customer_profile.referral_code} colors={colors} />
            <InfoRow label="Points" value={String(detail.customer_profile.points)} colors={colors} />
            <InfoRow
              label="Address"
              value={detail.customer_profile.default_address?.address ?? 'No address on file'}
              colors={colors}
            />
            {detail.customer_profile.age != null && (
              <InfoRow label="Age" value={String(detail.customer_profile.age)} colors={colors} />
            )}
            <ActionRow colors={colors}>
              <ActionButton label="Suspend Account" icon="pause-circle-outline" accent="error" colors={colors} onPress={() => runAction('suspend_customer', 'customer')} />
              <ActionButton label="Refund" icon="cash-outline" colors={colors} onPress={() => runAction('refund', 'customer')} />
              <ActionButton label="Credit Wallet" icon="wallet-outline" accent="lava" colors={colors} onPress={() => runAction('credit_wallet', 'customer')} />
              <ActionButton label="Issue Coupon" icon="pricetag-outline" accent="lava" colors={colors} onPress={() => runAction('issue_coupon', 'customer')} />
              <ActionButton label="Reset Password" icon="key-outline" colors={colors} onPress={() => runAction('reset_password', 'customer')} />
            </ActionRow>
          </ProfileSection>
        )}

        {/* Driver section */}
        {profiles.driver && detail.driver_profile && (
          <ProfileSection title="Driver Profile" colors={colors}>
            <InfoRow label="Name" value={`${detail.driver_profile.first_name} ${detail.driver_profile.last_name}`} colors={colors} />
            <InfoRow
              label="Availability"
              value={
                detail.driver_profile.is_online
                  ? detail.driver_profile.is_available ? 'Online' : 'Busy'
                  : 'Offline'
              }
              colors={colors}
            />
            <InfoRow label="Deliveries" value={String(detail.driver_profile.total_deliveries)} colors={colors} />
            <InfoRow label="Rating" value={`★${detail.driver_profile.avg_rating}`} colors={colors} />
            <InfoRow label="Vehicle" value={detail.driver_profile.vehicle_make || 'Not set'} colors={colors} />
            <InfoRow label="Vehicle type" value={detail.driver_profile.vehicle_type ?? 'Not set'} colors={colors} />
            <InfoRow label="Plate" value={detail.driver_profile.vehicle_number ?? 'Not set'} colors={colors} />
            <InfoRow label="Onboarding" value={detail.driver_profile.latest_onboarding_status || 'Not started'} colors={colors} />
            <InfoRow
              label="Documents"
              value={
                detail.driver_profile.pending_documents_count === 0
                  ? 'Verified'
                  : `${detail.driver_profile.pending_documents_count} pending`
              }
              colors={colors}
            />
            <ActionRow colors={colors}>
              <ActionButton label="Approve" icon="checkmark-circle-outline" colors={colors} onPress={() => runAction('approve', 'driver')} />
              <ActionButton label="Suspend" icon="pause-circle-outline" accent="error" colors={colors} onPress={() => runAction('suspend', 'driver')} />
              <ActionButton label="Block" icon="close-circle-outline" accent="error" colors={colors} onPress={() => runAction('block', 'driver')} />
              <ActionButton label="Reset Password" icon="key-outline" colors={colors} onPress={() => runAction('reset_password', 'driver')} />
              <ActionButton label="Verify Documents" icon="document-text-outline" colors={colors} onPress={() => runAction('verify_documents', 'driver')} />
              <ActionButton label="Assign Delivery" icon="navigate-outline" accent="lava" colors={colors} onPress={() => runAction('assign_delivery', 'driver')} />
            </ActionRow>
          </ProfileSection>
        )}

        {/* Business admin section */}
        {profiles.business_admin && detail.business && (
          <ProfileSection title="Business" colors={colors}>
            <InfoRow label="Name" value={detail.business.business_name} colors={colors} />
            <InfoRow label="Type" value={detail.business.business_type} colors={colors} />
            <InfoRow label="Address" value={detail.business.business_address} colors={colors} />
            <InfoRow label="Onboarding" value={detail.business.onboarding_complete ? 'Complete' : 'Pending'} colors={colors} />
            <InfoRow label="Contact email" value={detail.business.email} colors={colors} />
            <InfoRow label="Contact phone" value={detail.business.phone_number} colors={colors} />
            <ActionRow colors={colors}>
              <ActionButton label="Approve" icon="checkmark-circle-outline" colors={colors} onPress={() => runAction('approve', 'business')} />
              <ActionButton label="Suspend" icon="pause-circle-outline" accent="error" colors={colors} onPress={() => runAction('suspend', 'business')} />
              <ActionButton label="Feature" icon="star-outline" accent="lava" colors={colors} onPress={() => runAction('feature', 'business')} />
              <ActionButton label="Edit Commission" icon="pricetag-outline" colors={colors} onPress={() => runAction('edit_commission', 'business')} />
              <ActionButton label="Add Promotion" icon="megaphone-outline" accent="lava" colors={colors} onPress={() => runAction('add_promotion', 'business')} />
              <ActionButton label="Hide" icon="eye-off-outline" accent="error" colors={colors} onPress={() => runAction('hide', 'business')} />
            </ActionRow>
          </ProfileSection>
        )}

        {/* Business staff section */}
        {profiles.business_staff && detail.business_staff && (
          <ProfileSection title="Business Staff" colors={colors}>
            <InfoRow label="Name" value={detail.business_staff.name} colors={colors} />
            <InfoRow label="Branch" value={detail.business_staff.branch.name} colors={colors} />
            <InfoRow label="Device" value={detail.business_staff.device_name} colors={colors} />
            <InfoRow label="Device active" value={detail.business_staff.is_active ? 'Yes' : 'No'} colors={colors} />
            <InfoRow label="Revoked" value={detail.business_staff.revoked ? 'Yes' : 'No'} colors={colors} />
            {/* ⚠️ These three actions aren't in the original admin spec (only
                whole-restaurant actions were spec'd) — inferred as reasonable
                staff-level controls. Confirm before treating as final. */}
            <ActionRow colors={colors}>
              <ActionButton label="Revoke Device" icon="phone-portrait-outline" accent="error" colors={colors} onPress={() => runAction('revoke_device', 'business_staff')} />
              <ActionButton label="Deactivate Staff" icon="person-remove-outline" accent="error" colors={colors} onPress={() => runAction('deactivate_staff', 'business_staff')} />
              <ActionButton label="Reset Password" icon="key-outline" colors={colors} onPress={() => runAction('reset_password', 'business_staff')} />
            </ActionRow>
          </ProfileSection>
        )}

        {/* App admin section */}
        {profiles.app_admin && detail.app_admin && (
          <ProfileSection title="Platform Admin" colors={colors}>
            <InfoRow label="Admin ID" value={String(detail.app_admin.id)} colors={colors} />
            <Text style={[styles.subtle, { color: colors.onSurfaceVariant, marginTop: 4 }]}>
              {/* ⚠️ No actions spec'd for platform-admin accounts — likely
                  managed outside this app entirely (e.g. Django admin). */}
              No admin-management actions are defined for this app yet.
            </Text>
          </ProfileSection>
        )}
      </ScrollView>
    </ScreenWrapper>
  );
}

function ProfileSection({
  title, colors, children,
}: {
  title: string;
  colors: ReturnType<typeof useTheme>['colors'];
  children: React.ReactNode;
}) {
  return (
    <View style={[styles.card, { backgroundColor: colors.surfaceContainer, borderColor: colors.borderSubtle }]}>
      <Text style={[styles.sectionTitle, { color: colors.primaryContainer }]}>{title}</Text>
      <View style={styles.sectionBody}>{children}</View>
    </View>
  );
}

function InfoRow({ label, value, colors }: { label: string; value: string; colors: ReturnType<typeof useTheme>['colors'] }) {
  return (
    <View style={styles.rowBetween}>
      <Text style={[styles.subtle, { color: colors.onSurfaceVariant }]}>{label}</Text>
      <Text style={[styles.infoValue, { color: colors.onSurface }]} numberOfLines={1}>{value}</Text>
    </View>
  );
}

function ActionRow({ colors, children }: { colors: ReturnType<typeof useTheme>['colors']; children: React.ReactNode }) {
  return (
    <>
      <View style={[styles.divider, { backgroundColor: colors.divider }]} />
      <View style={styles.actionsGrid}>{children}</View>
    </>
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
        { backgroundColor: colors.surfaceContainerHigh, borderColor: colors.borderSubtle, opacity: pressed ? 0.8 : 1 },
      ]}
    >
      <Ionicons name={icon} size={16} color={fg} />
      <Text style={[styles.actionLabel, { color: fg }]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  content: { gap: Spacing.md, paddingBottom: Spacing.xl, paddingHorizontal: Spacing.gutter },
  centerState: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: Spacing.xl, gap: Spacing.md },
  retryBtn: { paddingHorizontal: Spacing.lg, paddingVertical: Spacing.sm, borderRadius: Radius.full },
  card: { borderRadius: Radius.lg, borderWidth: 1, padding: Spacing.md, gap: Spacing.xs },
  name: { fontFamily: FontFamily.heading, fontSize: 18, fontWeight: '700' },
  subtle: { fontFamily: FontFamily.body, fontSize: 12 },
  badgeRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 6 },
  pill: { paddingHorizontal: Spacing.sm, paddingVertical: 4, borderRadius: Radius.full },
  pillText: { fontFamily: FontFamily.body, fontSize: 11, fontWeight: '700' },
  sectionTitle: {
    fontFamily: FontFamily.body, fontSize: 12, fontWeight: '700',
    textTransform: 'uppercase', letterSpacing: 0.5,
  },
  sectionBody: { gap: Spacing.xs },
  rowBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: Spacing.sm },
  infoValue: { fontFamily: FontFamily.body, fontSize: 13, fontWeight: '500', flexShrink: 1, textAlign: 'right' },
  divider: { height: 1, marginVertical: Spacing.sm },
  actionsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  actionBtn: {
    flexBasis: '47%', flexDirection: 'row', alignItems: 'center', gap: 6,
    borderRadius: Radius.md, borderWidth: 1, padding: Spacing.sm,
  },
  actionLabel: { fontFamily: FontFamily.body, fontSize: 12, fontWeight: '600' },
});