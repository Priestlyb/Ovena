/**
 * components/support/InboxTile.tsx
 *
 * Renders one SupportTicket row. Real tickets have no `name`/`avatarUri`/
 * `refCode` — those are derived here:
 *   - "name"    → `${roleLabel} #${owner_id}` (e.g. "Customer #371")
 *   - "avatar"  → a role icon in place of a photo
 *   - "refCode" → last 6 chars of the ticket ULID
 *
 * Key constraint (unchanged): a single Animated.Value must use the same
 * useNativeDriver value for every animation touching it. Outer view =
 * non-native backgroundColor, inner view = native transform: scale.
 */

import React, { useRef } from 'react';
import {
  View,
  Text,
  Animated,
  TouchableWithoutFeedback,
  StyleSheet,
} from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/context/ThemeContext';
import { Spacing, Radius, FontFamily } from '@/constants/theme';
import { SupportTicket, OwnerRole } from '@/types/appData';

interface InboxTileProps {
  ticket:         SupportTicket;
  onPress:        () => void;
  onSwipeResolve: (ticket: SupportTicket) => void;
  isResolved:     boolean; // local optimistic override on top of ticket.status
}

const ROLE_LABEL: Record<OwnerRole, string> = {
  customer:       'Customer',
  driver:         'Driver',
  business_admin: 'Business Admin',
  business_staff: 'Business Staff',
};

const ROLE_ICON: Record<OwnerRole, keyof typeof Ionicons.glyphMap> = {
  customer:       'person-outline',
  driver:         'bicycle-outline',
  business_admin: 'briefcase-outline',
  business_staff: 'people-outline',
};

function formatTimeAgo(iso: string): string {
  const diffSec = Math.max(0, Math.floor((Date.now() - new Date(iso).getTime()) / 1000));
  if (diffSec < 60) return `${diffSec}s`;
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h`;
  const diffDay = Math.floor(diffHr / 24);
  if (diffDay < 7) return `${diffDay}d`;
  return `${Math.floor(diffDay / 7)}w`;
}

function useBadgeStyle(ticket: SupportTicket, resolvedOverride: boolean) {
  const { colors } = useTheme();
  if (resolvedOverride || ticket.status === 'closed') {
    return { bg: colors.surfaceContainerHighest, text: colors.onSurfaceVariant, label: 'CLOSED' };
  }
  if (ticket.status === 'in_progress') {
    return { bg: colors.secondaryContainer ?? '#474746', text: colors.onSecondaryContainer ?? '#b7b5b4', label: 'IN PROGRESS' };
  }
  if (ticket.priority === 'high') {
    return { bg: colors.errorContainer, text: colors.onErrorContainer ?? colors.error, label: 'URGENT' };
  }
  return { bg: colors.primaryContainer, text: colors.onPrimaryContainer, label: 'OPEN' };
}

function RightSwipeAction() {
  return (
    <View style={styles.swipeActionRight}>
      <Ionicons name="checkmark-circle-outline" size={32} color="#fff" />
      <Text style={styles.swipeActionText}>Resolve</Text>
    </View>
  );
}

export function InboxTile({ ticket, onPress, onSwipeResolve, isResolved }: InboxTileProps) {
  const { colors, isDark } = useTheme();
  const swipeRef = useRef<Swipeable>(null);
  const badge    = useBadgeStyle(ticket, isResolved);

  const pressScale = useRef(new Animated.Value(1)).current; // native: transform only
  const hoverBg    = useRef(new Animated.Value(0)).current; // non-native: backgroundColor only
  const bgColor    = hoverBg.interpolate({
    inputRange:  [0, 1],
    outputRange: [
      isDark ? 'rgba(255,255,255,0.00)' : 'rgba(0,0,0,0.00)',
      isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)',
    ],
  });

  const onPressIn = () => {
    Animated.spring(pressScale, { toValue: 0.98, useNativeDriver: true,  speed: 60, bounciness: 2 }).start();
    Animated.timing(hoverBg,   { toValue: 1,    useNativeDriver: false, duration: 120 }).start();
  };
  const onPressOut = () => {
    Animated.spring(pressScale, { toValue: 1, useNativeDriver: true,  speed: 25, bounciness: 4 }).start();
    Animated.timing(hoverBg,   { toValue: 0, useNativeDriver: false, duration: 200 }).start();
  };

  const cardBase   = isDark ? '#1c1b20' : colors.surfaceContainerLow;
  const cardBorder = isDark ? 'rgba(255,255,255,0.07)' : colors.border;
  const resolved    = isResolved || ticket.status === 'closed';
  const showStripe  = !resolved && (ticket.status === 'in_progress' || ticket.priority === 'high' || ticket.status === 'open');
  const stripeColor = ticket.priority === 'high' ? colors.error : colors.primaryContainer;
  const tileOpacity = resolved ? 0.65 : 1;

  const roleLabel  = ROLE_LABEL[ticket.owner_role] ?? ticket.owner_role;
  const roleIcon   = ROLE_ICON[ticket.owner_role] ?? 'help-circle-outline';
  const displayName = `${roleLabel} #${ticket.owner_id}`;
  const refCode      = `#${ticket.id.slice(-6)}`;

  return (
    <Swipeable
      ref={swipeRef}
      overshootRight={false}
      renderRightActions={() => <RightSwipeAction />}
      onSwipeableOpen={(direction) => {
        if (direction === 'right') {
          swipeRef.current?.close();
          onSwipeResolve(ticket);
        }
      }}
    >
      <TouchableWithoutFeedback onPressIn={onPressIn} onPressOut={onPressOut} onPress={onPress}>
        <Animated.View
          style={[
            styles.outerWrap,
            { backgroundColor: bgColor, borderColor: cardBorder, opacity: tileOpacity },
          ]}
        >
          <View style={[StyleSheet.absoluteFill, { backgroundColor: cardBase, borderRadius: 32 }]} />

          {showStripe && (
            <View style={[styles.stripe, { backgroundColor: stripeColor }]} />
          )}

          <Animated.View style={[styles.innerRow, { transform: [{ scale: pressScale }] }]}>
            {/* Role icon in place of avatar */}
            <View style={[styles.avatarWrap, { borderColor: cardBorder, backgroundColor: cardBase }]}>
              <Ionicons name={roleIcon} size={26} color={colors.onSurfaceVariant} />
            </View>

            <View style={styles.body}>
              <View style={styles.topRow}>
                <Text style={[styles.name, { color: colors.onSurface }]} numberOfLines={1}>
                  {displayName}
                </Text>
                <Text style={[styles.timeAgo, { color: colors.onSurfaceVariant }]}>
                  {formatTimeAgo(ticket.created_at)}
                </Text>
              </View>

              <Text style={[styles.preview, { color: colors.onSurfaceVariant }]} numberOfLines={1}>
                {ticket.category}{ticket.is_blocking ? ' · Blocking' : ''}
              </Text>

              <View style={styles.metaRow}>
                <View style={[styles.badge, { backgroundColor: badge.bg }]}>
                  <Text style={[styles.badgeText, { color: badge.text }]}>{badge.label}</Text>
                </View>
                <Text style={[styles.refCode, { color: colors.onSurfaceVariant + '66' }]}>
                  {ticket.owner_email ?? 'no email on file'} · {refCode}
                </Text>
              </View>
            </View>

            <Ionicons name="chevron-forward" size={20} color={colors.onSurfaceVariant} />
          </Animated.View>
        </Animated.View>
      </TouchableWithoutFeedback>
    </Swipeable>
  );
}

const styles = StyleSheet.create({
  outerWrap:  { borderRadius: 32, borderWidth: 1, overflow: 'hidden', marginBottom: Spacing.sm },
  innerRow:   { flexDirection: 'row', alignItems: 'center', padding: Spacing.md, gap: Spacing.md },
  stripe: {
    position: 'absolute', left: 0, top: 0, bottom: 0, width: 4,
    borderTopLeftRadius: 32, borderBottomLeftRadius: 32,
  },
  avatarWrap: {
    width: 56, height: 56, borderRadius: Radius.xl, borderWidth: 1,
    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  body: { flex: 1, gap: 3 },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  name: {
    fontFamily: FontFamily.heading, fontSize: 18, fontWeight: '600',
    lineHeight: 24, letterSpacing: -0.2, flex: 1, marginRight: Spacing.xs,
  },
  timeAgo: { fontFamily: FontFamily.mono, fontSize: 10, fontWeight: '500', lineHeight: 14, flexShrink: 0 },
  preview: { fontFamily: FontFamily.body, fontSize: 14, lineHeight: 20 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, marginTop: 2 },
  badge: { paddingHorizontal: 10, paddingVertical: 2, borderRadius: Radius.full },
  badgeText: { fontFamily: FontFamily.mono, fontSize: 10, fontWeight: '500', letterSpacing: 0.8, textTransform: 'uppercase' },
  refCode: { fontFamily: FontFamily.mono, fontSize: 10, fontWeight: '500', letterSpacing: 0.3 },
  swipeActionRight: {
    justifyContent: 'center', alignItems: 'flex-end', flex: 1,
    backgroundColor: '#16a34a', borderRadius: 32, marginBottom: Spacing.sm,
    paddingRight: Spacing.lg, gap: 4,
  },
  swipeActionText: { fontFamily: FontFamily.mono, fontSize: 10, fontWeight: '500', color: '#fff', letterSpacing: 0.5 },
});