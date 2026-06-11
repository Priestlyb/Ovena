/**
 * app/profile/index.tsx
 *
 * Profile Settings screen — mirrors the HTML exactly:
 *
 *  ┌─────────────────────────────────────────────────────┐
 *  │  ← Back                   Profile Settings          │  ← header
 *  ├─────────────────────────────────────────────────────┤
 *  │        [avatar + lava glow + edit button]           │
 *  │            Aleksandr Smith                          │
 *  │         System Administrator • Senior DevOps        │
 *  ├─────────────────────────────────────────────────────┤
 *  │  PERSONAL DATA                                      │
 *  │  ▸ Full Name          Aleksandr Smith  ›            │  → EditFieldModal
 *  │  ▸ Email Address      a.smith@…        ›            │  → EditFieldModal
 *  ├─────────────────────────────────────────────────────┤
 *  │  THEME PREFERENCES                                  │
 *  │  ◈ Dark Mode                          [toggle]      │  → useTheme toggleTheme()
 *  ├─────────────────────────────────────────────────────┤
 *  │  ACCOUNT SECURITY                                   │
 *  │  ▸ Password Change                    ›            │  → PasswordChangeModal
 *  │  ▸ 2FA Security       ACTIVE          ›            │  → TwoFAModal
 *  ├─────────────────────────────────────────────────────┤
 *  │         [  Logout from LAVA ADMIN  ]                │  → Alert confirm → router.replace('/login')
 *  └─────────────────────────────────────────────────────┘
 *
 *  All list rows: scale-[0.98] spring on press (from HTML JS micro-interaction)
 */

import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Switch,
  Animated,
  Alert,
  StyleSheet,
  Platform,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import ScreenWrapper                from '@/components/ScreenWrapper';
import { ProfileHeader }            from '@/components/profile/ProfileHeader';
import { EditFieldModal }           from '@/components/profile/EditFieldModal';
import { PasswordChangeModal }      from '@/components/profile/PasswordChangeModal';
import { TwoFAModal }               from '@/components/profile/TwoFAModal';
import { useTheme }                 from '@/context/ThemeContext';
import { Spacing, Radius, FontFamily } from '@/constants/theme';

// ─── Pressable row with scale-[0.98] spring ───────────────────────────────────
interface SettingsRowProps {
  icon:       string; // Ionicons name
  label:      string;
  value?:     string;
  badge?:     string;
  onPress?:   () => void;
  /** Last row in section — no bottom divider */
  isLast?:    boolean;
}

function SettingsRow({ icon, label, value, badge, onPress, isLast }: SettingsRowProps) {
  const { colors, isDark } = useTheme();
  const scale = useRef(new Animated.Value(1)).current;

  const onIn  = () => Animated.spring(scale, { toValue: 0.98, useNativeDriver: true, speed: 60, bounciness: 2 }).start();
  const onOut = () => Animated.spring(scale, { toValue: 1,    useNativeDriver: true, speed: 25, bounciness: 4 }).start();

  const hoverBg = useRef(new Animated.Value(0)).current;
  const onHoverIn  = () => Animated.timing(hoverBg, { toValue: 1, duration: 120, useNativeDriver: false }).start();
  const onHoverOut = () => Animated.timing(hoverBg, { toValue: 0, duration: 200, useNativeDriver: false }).start();

  const bgColor = hoverBg.interpolate({
    inputRange:  [0, 1],
    outputRange: ['rgba(255,255,255,0.00)', 'rgba(255,255,255,0.05)'],
  });

  return (
    <>
      <TouchableWithoutFeedback
        onPressIn={() => { onIn(); onHoverIn(); }}
        onPressOut={() => { onOut(); onHoverOut(); }}
        onPress={onPress}
      >
        <Animated.View
          style={[
            styles.row,
            { backgroundColor: bgColor, transform: [{ scale }] },
          ]}
        >
          {/* Left: icon + label */}
          <View style={styles.rowLeft}>
            <Ionicons
              name={icon as any}
              size={22}
              color={colors.onSecondaryContainer ?? colors.onSurfaceVariant}
            />
            <Text style={[styles.rowLabel, { color: colors.onSurface }]}>{label}</Text>
          </View>

          {/* Right: value / badge + chevron */}
          <View style={styles.rowRight}>
            {badge && (
              <View style={[styles.badge, { backgroundColor: `${colors.primary}1A` }]}>
                <Text style={[styles.badgeText, { color: colors.primary }]}>{badge}</Text>
              </View>
            )}
            {value && (
              <Text
                style={[styles.rowValue, { color: colors.onSecondaryContainer ?? colors.onSurfaceVariant }]}
                numberOfLines={1}
              >
                {value}
              </Text>
            )}
            <Animated.View style={{ transform: [{ translateX: hoverBg.interpolate({ inputRange: [0,1], outputRange: [0, 3] }) }] }}>
              <Ionicons
                name="chevron-forward"
                size={18}
                color={colors.onSecondaryContainer ?? colors.onSurfaceVariant}
              />
            </Animated.View>
          </View>
        </Animated.View>
      </TouchableWithoutFeedback>

      {!isLast && (
        <View style={[styles.divider, { backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : colors.divider }]} />
      )}
    </>
  );
}

// ─── Section card ─────────────────────────────────────────────────────────────
interface SettingsSectionProps {
  title:    string;
  children: React.ReactNode;
}

function SettingsSection({ title, children }: SettingsSectionProps) {
  const { colors, isDark } = useTheme();
  const cardBg     = isDark ? '#1b1b1e' : colors.surfaceContainer;
  const cardBorder = isDark ? 'rgba(255,255,255,0.05)' : colors.border;

  return (
    <View style={[styles.section, { backgroundColor: cardBg, borderColor: cardBorder }]}>
      <Text style={[styles.sectionTitle, { color: colors.onSecondaryContainer ?? colors.onSurfaceVariant }]}>
        {title}
      </Text>
      {children}
    </View>
  );
}

// ─── Screen ───────────────────────────────────────────────────────────────────
export default function ProfileScreen() {
  const { colors, isDark, toggleTheme } = useTheme();
  const insets = useSafeAreaInsets();

  // Local profile state (in a real app this would come from an API / store)
  const [fullName, setFullName] = useState('Aleksandr Smith');
  const [email,    setEmail]    = useState('a.smith@lava-admin.io');
  const [twoFA,    setTwoFA]    = useState(true);

  // Modal visibility
  const [editName,    setEditName]    = useState(false);
  const [editEmail,   setEditEmail]   = useState(false);
  const [editPw,      setEditPw]      = useState(false);
  const [edit2FA,     setEdit2FA]     = useState(false);

  // Logout: scale-95 spring + confirm alert
  const logoutScale = useRef(new Animated.Value(1)).current;
  const onLogoutIn  = () => Animated.spring(logoutScale, { toValue: 0.95, useNativeDriver: true, speed: 50, bounciness: 4 }).start();
  const onLogoutOut = () => Animated.spring(logoutScale, { toValue: 1,    useNativeDriver: true, speed: 20, bounciness: 6 }).start();

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to log out of LAVA ADMIN?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text:    'Logout',
          style:   'destructive',
          onPress: () => router.replace('/(tabs)'), // replace with /login when auth exists
        },
      ],
    );
  };

  const cardBg     = isDark ? '#1b1b1e' : colors.surfaceContainer;
  const cardBorder = isDark ? 'rgba(255,255,255,0.05)' : colors.border;

  return (
    <ScreenWrapper noPadding>
      {/* ── Top app bar ── */}
      <View
        style={[
          styles.topBar,
          {
            backgroundColor:  `${colors.surface}CC`,
            borderBottomColor: isDark ? 'rgba(255,255,255,0.05)' : colors.border,
            paddingTop: insets.top,
          },
        ]}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backBtn}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons name="arrow-back" size={22} color={colors.onSurface} />
        </TouchableOpacity>
        <Text style={[styles.topBarTitle, { color: colors.primaryContainer }]}>
          Profile Settings
        </Text>
        {/* Spacer to balance back button */}
        <View style={{ width: 36 }} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + Spacing.xl }]}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Avatar / name / role ── */}
        <ProfileHeader
          name={fullName}
          role="System Administrator • Senior DevOps"
          avatarUri="https://lh3.googleusercontent.com/aida-public/AB6AXuBxW6ckZbmi2iKqb28MIpktNMJHoRJjMEjAhgDbl9haXu5GkXydZp4yqBndq29WdPQSht1rz9b5XMYZxcHVvwhhhy1TDOTc84E9DpOTxi0R6yVvJVHLHWFwwXrsO7k5KrHoolMFdwH1Q36jDE5jpkOdnsPZt3LRLAwPhMe3oTOi97F8wioUmQa_7xWfuPvX4SL2XYK0uaVraJLLLu07ud391X8ljCqOWKUfE6-2ICCBceKZdiI3yBf65uN2l-8AzNm9AtOqcjdNUZwi"
          onEditAvatar={() => Alert.alert('Edit Photo', 'Photo picker coming soon.')}
        />

        {/* ── Personal Data ── */}
        <SettingsSection title="Personal Data">
          <SettingsRow
            icon="person-outline"
            label="Full Name"
            value={fullName}
            onPress={() => setEditName(true)}
          />
          <SettingsRow
            icon="mail-outline"
            label="Email Address"
            value={email}
            onPress={() => setEditEmail(true)}
            isLast
          />
        </SettingsSection>

        {/* ── Theme Preferences ── */}
        <View style={[styles.section, { backgroundColor: cardBg, borderColor: cardBorder }]}>
          <Text style={[styles.sectionTitle, { color: colors.onSecondaryContainer ?? colors.onSurfaceVariant }]}>
            Theme Preferences
          </Text>
          <View
            style={[
              styles.toggleRow,
              { backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : colors.surfaceContainerHigh },
            ]}
          >
            <View style={styles.rowLeft}>
              <Ionicons
                name={isDark ? 'moon' : 'sunny'}
                size={22}
                color={colors.onSecondaryContainer ?? colors.onSurfaceVariant}
              />
              <Text style={[styles.rowLabel, { color: colors.onSurface }]}>Dark Mode</Text>
            </View>
            <Switch
              value={isDark}
              onValueChange={toggleTheme}
              trackColor={{ false: colors.surfaceContainerHighest, true: colors.primaryContainer }}
              thumbColor={colors.onSurface}
              ios_backgroundColor={colors.surfaceContainerHighest}
            />
          </View>
        </View>

        {/* ── Account Security ── */}
        <SettingsSection title="Account Security">
          <SettingsRow
            icon="lock-closed-outline"
            label="Password Change"
            onPress={() => setEditPw(true)}
          />
          <SettingsRow
            icon="phone-portrait-outline"
            label="2FA Security"
            badge={twoFA ? 'ACTIVE' : 'INACTIVE'}
            onPress={() => setEdit2FA(true)}
            isLast
          />
        </SettingsSection>

        {/* ── Logout ── */}
        <TouchableWithoutFeedback
          onPressIn={onLogoutIn}
          onPressOut={onLogoutOut}
          onPress={handleLogout}
        >
          <Animated.View
            style={[
              styles.logoutBtn,
              {
                backgroundColor: cardBg,
                borderColor:     `${colors.error}33`,
                transform:       [{ scale: logoutScale }],
              },
            ]}
          >
            <Ionicons name="log-out-outline" size={22} color={colors.error} />
            <Text style={[styles.logoutText, { color: colors.error }]}>
              Logout from LAVA ADMIN
            </Text>
          </Animated.View>
        </TouchableWithoutFeedback>
      </ScrollView>

      {/* ── Modals ── */}
      <EditFieldModal
        visible={editName}
        title="Full Name"
        label="Full Name"
        value={fullName}
        placeholder="Enter your full name"
        onSave={setFullName}
        onClose={() => setEditName(false)}
      />
      <EditFieldModal
        visible={editEmail}
        title="Email Address"
        label="Email Address"
        value={email}
        placeholder="Enter your email"
        keyboardType="email-address"
        onSave={setEmail}
        onClose={() => setEditEmail(false)}
      />
      <PasswordChangeModal
        visible={editPw}
        onClose={() => setEditPw(false)}
      />
      <TwoFAModal
        visible={edit2FA}
        isActive={twoFA}
        onToggle={setTwoFA}
        onClose={() => setEdit2FA(false)}
      />
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  // Top bar
  topBar: {
    flexDirection:    'row',
    alignItems:       'center',
    justifyContent:   'space-between',
    paddingHorizontal: Spacing.gutter,
    paddingBottom:    Spacing.sm,
    borderBottomWidth: 1,
    zIndex:           10,
  },
  backBtn: {
    width:  36,
    height: 36,
    justifyContent: 'center',
    alignItems:     'center',
  },
  topBarTitle: {
    fontFamily:    FontFamily.heading,
    fontSize:      18,
    fontWeight:    '700',
    letterSpacing: -0.3,
  },

  scroll: {
    flex: 1,
  },
  content: {
    gap:              Spacing.lg,
    paddingHorizontal: Spacing.gutter,
    paddingTop:       Spacing.md,
  },

  // Section card: glass-card rounded-card
  section: {
    borderRadius: 28,          // rounded-card
    borderWidth:  1,
    overflow:     'hidden',
    paddingTop:   Spacing.md,
    paddingBottom: Spacing.sm,
    paddingHorizontal: Spacing.md,
    gap:          4,
  },
  sectionTitle: {
    fontFamily:    FontFamily.mono,
    fontSize:      10,
    fontWeight:    '500',
    letterSpacing: 2.5,
    textTransform: 'uppercase',
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.xs,
  },

  // Row
  row: {
    flexDirection:   'row',
    alignItems:      'center',
    justifyContent:  'space-between',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    borderRadius:    Radius.full,  // rounded-3xl ≈ full on a row
    gap:             Spacing.sm,
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems:    'center',
    gap:           Spacing.md,
    flex:          1,
  },
  rowLabel: {
    fontFamily:  FontFamily.body,
    fontSize:    16,
    fontWeight:  '500',
    lineHeight:  24,
  },
  rowRight: {
    flexDirection: 'row',
    alignItems:    'center',
    gap:           Spacing.xs,
    maxWidth:      '55%',
  },
  rowValue: {
    fontFamily:  FontFamily.body,
    fontSize:    14,
    lineHeight:  20,
    maxWidth:    130,
  },
  badge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical:   4,
    borderRadius:      Radius.full,
  },
  badgeText: {
    fontFamily:    FontFamily.mono,
    fontSize:      10,
    fontWeight:    '500',
    letterSpacing: 0.5,
  },
  divider: {
    height:          1,
    marginHorizontal: Spacing.md,
  },

  // Theme toggle row: bg-white/5 rounded-3xl inside the card
  toggleRow: {
    flexDirection:   'row',
    alignItems:      'center',
    justifyContent:  'space-between',
    paddingVertical:   Spacing.md,
    paddingHorizontal: Spacing.md,
    borderRadius:      Radius.full,
    marginHorizontal:  0,
  },

  // Logout
  logoutBtn: {
    flexDirection:   'row',
    alignItems:      'center',
    justifyContent:  'center',
    gap:             Spacing.sm,
    paddingVertical:  Spacing.lg,
    paddingHorizontal: Spacing.xl,
    borderRadius:    Radius.full,  // rounded-pill
    borderWidth:     1,
    marginBottom:    Spacing.md,
  },
  logoutText: {
    fontFamily:    FontFamily.heading,
    fontSize:      16,
    fontWeight:    '600',
    lineHeight:    24,
    letterSpacing: -0.1,
  },
});