/**
 * app/ops/banners/index.tsx
 *
 * Banner Manager: list of homepage banners with enable/disable toggle
 * and status (active / disabled / scheduled). "Schedule" is set at
 * creation time (see create.tsx) — this list just displays it.
 *
 * Enable/disable is a local-state stub — no banners endpoint exists yet.
 */

import React, { useState } from 'react';
import { FlatList, View, Text, Pressable, Image, StyleSheet } from 'react-native';
import { Stack, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import ScreenWrapper from '@/components/ScreenWrapper';
import { useTheme } from '@/context/ThemeContext';
import { Spacing, Radius, FontFamily } from '@/constants/theme';
import { MOCK_BANNERS } from '@/data/mockOps';
import { Banner, BannerStatus } from '@/types/ops';

export default function BannerManagerScreen() {
  const { colors } = useTheme();
  const [banners, setBanners] = useState<Banner[]>(MOCK_BANNERS);

  const toggleBanner = (id: string) => {
    console.log('🖼️ [BannerManager] toggle', id); // ⚠️ UNVERIFIED — no endpoint yet
    setBanners((prev) =>
      prev.map((b) =>
        b.id === id
          ? { ...b, status: b.status === 'active' ? 'disabled' : 'active' }
          : b
      )
    );
  };

  return (
    <ScreenWrapper>
      <Stack.Screen options={{ title: 'Banner Manager' }} />
      <FlatList
        data={banners}
        keyExtractor={(b) => b.id}
        contentContainerStyle={styles.content}
        ItemSeparatorComponent={() => <View style={{ height: Spacing.sm }} />}
        ListHeaderComponent={
          <Pressable
            onPress={() => router.push('/ops/banners/create' as any)}
            style={[styles.uploadBtn, { backgroundColor: colors.primaryContainer }]}
          >
            <Ionicons name="cloud-upload-outline" size={18} color={colors.onPrimaryContainer} />
            <Text style={[styles.uploadBtnText, { color: colors.onPrimaryContainer }]}>Upload Banner</Text>
          </Pressable>
        }
        renderItem={({ item }) => (
          <View style={[styles.card, { backgroundColor: colors.surfaceContainer, borderColor: colors.borderSubtle }]}>
            <Image source={{ uri: item.imageUrl }} style={styles.image} />
            <View style={styles.cardBody}>
              <View style={styles.rowBetween}>
                <Text style={[styles.title, { color: colors.onSurface }]} numberOfLines={1}>
                  {item.title}
                </Text>
                <StatusPill status={item.status} colors={colors} />
              </View>

              {item.status === 'scheduled' && item.scheduledStart && (
                <Text style={[styles.schedule, { color: colors.onSurfaceVariant }]}>
                  Scheduled: {new Date(item.scheduledStart).toLocaleDateString()}
                  {item.scheduledEnd ? ` → ${new Date(item.scheduledEnd).toLocaleDateString()}` : ''}
                </Text>
              )}

              <Pressable
                onPress={() => toggleBanner(item.id)}
                style={[styles.toggleBtn, { borderColor: colors.borderSubtle }]}
              >
                <Text style={[styles.toggleBtnText, { color: item.status === 'active' ? colors.error : colors.success }]}>
                  {item.status === 'active' ? 'Disable' : 'Enable'}
                </Text>
              </Pressable>
            </View>
          </View>
        )}
      />
    </ScreenWrapper>
  );
}

function StatusPill({ status, colors }: { status: BannerStatus; colors: ReturnType<typeof useTheme>['colors'] }) {
  const map: Record<BannerStatus, { bg: string; fg: string; label: string }> = {
    active: { bg: colors.success + '33', fg: colors.success, label: 'Active' },
    disabled: { bg: colors.secondaryContainer, fg: colors.onSecondaryContainer, label: 'Disabled' },
    scheduled: { bg: colors.primaryContainer + '33', fg: colors.primaryContainer, label: 'Scheduled' },
  };
  const s = map[status];
  return (
    <View style={[styles.pill, { backgroundColor: s.bg }]}>
      <Text style={[styles.pillText, { color: s.fg }]}>{s.label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  content: { padding: Spacing.gutter, paddingBottom: Spacing.xl },
  uploadBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6,
    borderRadius: Radius.full, paddingVertical: Spacing.sm, marginBottom: Spacing.md,
  },
  uploadBtnText: { fontFamily: FontFamily.body, fontSize: 13, fontWeight: '700' },
  card: { borderRadius: Radius.lg, borderWidth: 1, overflow: 'hidden' },
  image: { width: '100%', height: 120 },
  cardBody: { padding: Spacing.sm, gap: 6 },
  rowBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: Spacing.sm },
  title: { fontFamily: FontFamily.heading, fontSize: 14, fontWeight: '700', flex: 1 },
  schedule: { fontFamily: FontFamily.body, fontSize: 11 },
  pill: { paddingHorizontal: Spacing.sm, paddingVertical: 3, borderRadius: Radius.full },
  pillText: { fontFamily: FontFamily.body, fontSize: 10, fontWeight: '700' },
  toggleBtn: {
    alignSelf: 'flex-start', borderWidth: 1, borderRadius: Radius.md,
    paddingHorizontal: Spacing.sm, paddingVertical: 6, marginTop: 2,
  },
  toggleBtnText: { fontFamily: FontFamily.body, fontSize: 12, fontWeight: '700' },
});