/**
 * app/spinwheel/preview.tsx
 *
 * Full-screen wheel preview shown after creating a new wheel.
 * Receives the wheel name and selected coupon codes via route params.
 *
 * Features:
 *  - Full animated spinwheel with segment labels
 *  - "Spin to Preview" button (triggers fast spin → winner reveal)
 *  - Segment legend showing each coupon and its colour
 *  - Publish / Save as Draft actions
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import ScreenWrapper       from '@/components/ScreenWrapper';
import { SpinwheelVisual } from '@/components/spinwheel/SpinwheelVisual';
import { useTheme }        from '@/context/ThemeContext';
import { Spacing, Radius, FontFamily } from '@/constants/theme';
import { WHEEL_SEGMENT_COLORS } from '@/data/couponData';

export default function WheelPreviewScreen() {
  const { colors, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{
    wheelName:  string;
    labels:     string;   // JSON array of strings
  }>();

  const wheelName = params.wheelName ?? 'New Promo Wheel';
  const labels: string[] = params.labels
    ? JSON.parse(params.labels)
    : ['50% OFF', 'Free Delivery', '$20 OFF', 'LAVA25'];

  const [lastWinner, setLastWinner] = useState<number | null>(null);

  const handlePublish = () => {
    Alert.alert(
      'Publish Wheel',
      `"${wheelName}" will go live immediately. Users can start spinning.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Publish Now',
          onPress: () => {
            Alert.alert('🎉 Published!', `"${wheelName}" is now live.`, [
              { text: 'OK', onPress: () => router.replace('/spinwheel') },
            ]);
          },
        },
      ],
    );
  };

  const handleDraft = () => {
    Alert.alert('Saved as Draft', `"${wheelName}" has been saved. You can publish it anytime.`, [
      { text: 'OK', onPress: () => router.replace('/spinwheel') },
    ]);
  };

  const cardBg   = isDark ? 'rgba(27,27,30,0.7)' : colors.surfaceContainer;
  const cardBord = isDark ? 'rgba(255,255,255,0.08)' : colors.border;

  return (
    <ScreenWrapper noPadding>
      {/* Top bar */}
      <View
        style={[
          styles.topBar,
          {
            paddingTop:        insets.top,
            backgroundColor:   `${colors.background}CC`,
            borderBottomColor: isDark ? 'rgba(255,255,255,0.10)' : colors.border,
          },
        ]}
      >
        <TouchableOpacity onPress={() => router.back()} style={styles.iconBtn}>
          <Ionicons name="arrow-back" size={22} color={colors.onSurface} />
        </TouchableOpacity>
        <View style={styles.topBarCenter}>
          <Text style={[styles.topBarTitle, { color: colors.onSurface }]} numberOfLines={1}>
            {wheelName}
          </Text>
          <Text style={[styles.topBarSub, { color: colors.onSurfaceVariant }]}>
            WHEEL PREVIEW
          </Text>
        </View>
        <TouchableOpacity style={styles.iconBtn}>
          <Ionicons name="share-outline" size={20} color={colors.onSurfaceVariant} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 120 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Wheel card */}
        <View
          style={[
            styles.wheelCard,
            { backgroundColor: cardBg, borderColor: cardBord },
          ]}
        >
          {/* Ambient glow */}
          <View style={[styles.ambientGlow, { backgroundColor: `${colors.primaryContainer}0A` }]} />

          <Text style={[styles.previewLabel, { color: colors.onSurfaceVariant }]}>
            TAP "SPIN TO PREVIEW" TO TEST
          </Text>

          <SpinwheelVisual
            labels={labels}
            size={260}
            autoSpin={false}
            onSpinEnd={setLastWinner}
          />

          {lastWinner !== null && (
            <View
              style={[
                styles.resultCard,
                { backgroundColor: `${colors.primaryContainer}15`, borderColor: `${colors.primaryContainer}40` },
              ]}
            >
              <Ionicons name="trophy" size={20} color={colors.primaryContainer} />
              <View>
                <Text style={[styles.resultLabel, { color: colors.onSurfaceVariant }]}>
                  LAST RESULT
                </Text>
                <Text style={[styles.resultValue, { color: colors.primaryContainer }]}>
                  {labels[lastWinner]}
                </Text>
              </View>
            </View>
          )}
        </View>

        {/* Segment legend */}
        <View style={[styles.legendCard, { backgroundColor: cardBg, borderColor: cardBord }]}>
          <Text style={[styles.legendTitle, { color: colors.onSurface }]}>Wheel Segments</Text>
          <View style={styles.legendGrid}>
            {labels.map((label, i) => (
              <View key={i} style={styles.legendItem}>
                <View
                  style={[
                    styles.legendDot,
                    { backgroundColor: WHEEL_SEGMENT_COLORS[i % WHEEL_SEGMENT_COLORS.length] },
                  ]}
                />
                <View style={styles.legendText}>
                  <Text style={[styles.legendLabel, { color: colors.onSurface }]}>{label}</Text>
                  <Text style={[styles.legendPct, { color: colors.onSurfaceVariant }]}>
                    {Math.round(100 / labels.length)}% probability
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Stats preview */}
        <View style={styles.statsRow}>
          <View style={[styles.statCard, { backgroundColor: cardBg, borderColor: cardBord }]}>
            <Text style={[styles.statLabel, { color: colors.onSurfaceVariant }]}>SEGMENTS</Text>
            <Text style={[styles.statValue, { color: colors.onSurface }]}>{labels.length}</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: cardBg, borderColor: cardBord }]}>
            <Text style={[styles.statLabel, { color: colors.onSurfaceVariant }]}>STATUS</Text>
            <Text style={[styles.statValue, { color: colors.primaryContainer }]}>DRAFT</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: cardBg, borderColor: cardBord }]}>
            <Text style={[styles.statLabel, { color: colors.onSurfaceVariant }]}>SPINS</Text>
            <Text style={[styles.statValue, { color: colors.onSurface }]}>0</Text>
          </View>
        </View>
      </ScrollView>

      {/* Sticky action footer */}
      <View
        style={[
          styles.footer,
          {
            paddingBottom:    insets.bottom + Spacing.sm,
            backgroundColor:  `${colors.background}F0`,
            borderTopColor:   isDark ? 'rgba(255,255,255,0.08)' : colors.border,
          },
        ]}
      >
        <TouchableOpacity
          style={[styles.draftBtn, { borderColor: colors.border, backgroundColor: colors.surfaceContainerHigh }]}
          onPress={handleDraft}
          activeOpacity={0.8}
        >
          <Ionicons name="save-outline" size={18} color={colors.onSurface} />
          <Text style={[styles.draftBtnText, { color: colors.onSurface }]}>Save Draft</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.publishBtn, { backgroundColor: colors.primaryContainer, shadowColor: '#f56e0f' }]}
          onPress={handlePublish}
          activeOpacity={0.88}
        >
          <Ionicons name="rocket-outline" size={18} color={colors.onPrimaryContainer} />
          <Text style={[styles.publishBtnText, { color: colors.onPrimaryContainer }]}>
            Publish Wheel
          </Text>
        </TouchableOpacity>
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  topBar: {
    flexDirection:    'row',
    alignItems:       'center',
    justifyContent:   'space-between',
    paddingHorizontal: Spacing.gutter,
    paddingBottom:    Spacing.sm,
    borderBottomWidth: 1,
    minHeight:        56,
  },
  iconBtn: { width: 36, height: 36, justifyContent: 'center', alignItems: 'center' },
  topBarCenter: { flex: 1, alignItems: 'center', gap: 2 },
  topBarTitle: {
    fontFamily:    FontFamily.heading,
    fontSize:      16,
    fontWeight:    '600',
    letterSpacing: -0.2,
    textAlign:     'center',
  },
  topBarSub: {
    fontFamily:    FontFamily.mono,
    fontSize:      9,
    fontWeight:    '500',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  scroll: { flex: 1 },
  content: { padding: Spacing.gutter, gap: Spacing.md },

  // Wheel card
  wheelCard: {
    borderRadius: 28,
    borderWidth:  1,
    padding:      Spacing.lg,
    alignItems:   'center',
    gap:          Spacing.md,
    overflow:     'hidden',
  },
  ambientGlow: {
    position:     'absolute',
    top:          -60,
    right:        -60,
    width:        200,
    height:       200,
    borderRadius: 100,
    // blur effect approximated by a large semi-transparent circle
  },
  previewLabel: {
    fontFamily:    FontFamily.mono,
    fontSize:      9,
    fontWeight:    '600',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  resultCard: {
    flexDirection:   'row',
    alignItems:      'center',
    gap:             Spacing.sm,
    paddingVertical:   Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius:    Radius.full,
    borderWidth:     1,
  },
  resultLabel: {
    fontFamily:    FontFamily.mono,
    fontSize:      9,
    fontWeight:    '500',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  resultValue: {
    fontFamily:    FontFamily.heading,
    fontSize:      16,
    fontWeight:    '700',
    letterSpacing: -0.3,
  },

  // Legend
  legendCard: {
    borderRadius: 24,
    borderWidth:  1,
    padding:      Spacing.lg,
    gap:          Spacing.md,
  },
  legendTitle: {
    fontFamily:    FontFamily.heading,
    fontSize:      16,
    fontWeight:    '600',
    letterSpacing: -0.2,
  },
  legendGrid: {
    gap: Spacing.sm,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems:    'center',
    gap:           Spacing.sm,
  },
  legendDot: {
    width:        12,
    height:       12,
    borderRadius: 6,
    flexShrink:   0,
  },
  legendText: { flex: 1, gap: 2 },
  legendLabel: {
    fontFamily:  FontFamily.body,
    fontSize:    14,
    fontWeight:  '500',
  },
  legendPct: {
    fontFamily:    FontFamily.mono,
    fontSize:      10,
    fontWeight:    '500',
    letterSpacing: 0.3,
  },

  // Stats row
  statsRow: { flexDirection: 'row', gap: Spacing.sm },
  statCard: {
    flex:         1,
    borderRadius: 20,
    borderWidth:  1,
    padding:      Spacing.md,
    gap:          4,
    alignItems:   'center',
  },
  statLabel: {
    fontFamily:    FontFamily.mono,
    fontSize:      9,
    fontWeight:    '500',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  statValue: {
    fontFamily:    FontFamily.heading,
    fontSize:      20,
    fontWeight:    '700',
    letterSpacing: -0.5,
  },

  // Footer
  footer: {
    position:          'absolute',
    bottom:            0,
    left:              0,
    right:             0,
    flexDirection:     'row',
    gap:               Spacing.sm,
    paddingHorizontal: Spacing.gutter,
    paddingTop:        Spacing.sm,
    borderTopWidth:    1,
  },
  draftBtn: {
    flex:           1,
    flexDirection:  'row',
    alignItems:     'center',
    justifyContent: 'center',
    gap:            6,
    paddingVertical: Spacing.sm + 2,
    borderRadius:   Radius.full,
    borderWidth:    1,
  },
  draftBtnText: {
    fontFamily:  FontFamily.heading,
    fontSize:    14,
    fontWeight:  '600',
  },
  publishBtn: {
    flex:           2,
    flexDirection:  'row',
    alignItems:     'center',
    justifyContent: 'center',
    gap:            6,
    paddingVertical: Spacing.sm + 2,
    borderRadius:   Radius.full,
    shadowOffset:   { width: 0, height: 4 },
    shadowOpacity:  0.30,
    shadowRadius:   12,
    elevation:      6,
  },
  publishBtnText: {
    fontFamily:    FontFamily.heading,
    fontSize:      15,
    fontWeight:    '700',
    letterSpacing: -0.2,
  },
});