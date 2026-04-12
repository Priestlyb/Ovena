// components/NavDrawer.tsx
import React, { useEffect, useRef } from "react";
import {
  View, Text, TouchableOpacity, StyleSheet,
  Animated, Dimensions, Pressable, StatusBar,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "../context/ThemeContext";
import { useAppData } from "../context/appDataContext";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const DRAWER_WIDTH = SCREEN_WIDTH * 0.72;

export type NavRoute =
  | "Account" | "Inbox" | "Earnings" | "Opportunities"
  | "ReferFriends" | "Help" | "TipsInfo" | "Profile";

interface NavDrawerProps {
  visible: boolean;
  onClose: () => void;
  onNavigate: (route: NavRoute) => void;
  /** Fallback name shown while app data is loading */
  driverName?: string;
}

const PRIMARY_LINKS: { label: string; route: NavRoute }[] = [
  { label: "Account",       route: "Account" },
  { label: "Inbox",         route: "Inbox" },
  { label: "Earnings",      route: "Earnings" },
  { label: "Opportunities", route: "Opportunities" },
  { label: "Refer Friends", route: "ReferFriends" },
];

const SECONDARY_LINKS: { label: string; route: NavRoute }[] = [
  { label: "Help",        route: "Help" },
  { label: "Tips & info", route: "TipsInfo" },
];

const NavDrawer: React.FC<NavDrawerProps> = ({
  visible, onClose, onNavigate, driverName = "Driver",
}) => {
  const { colors } = useTheme();
  const { data }   = useAppData();

  // Pull name from live API data, fall back to prop
  const profile = data?.dashboard?.data?.profile;
  const displayName = profile
    ? `${profile.first_name} ${profile.last_name}`.trim()
    : driverName;

  const insets       = useSafeAreaInsets();
  const slideAnim    = useRef(new Animated.Value(-DRAWER_WIDTH)).current;
  const backdropAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      StatusBar.setBarStyle(colors.statusBarStyle);
      Animated.parallel([
        Animated.spring(slideAnim, { toValue: 0, friction: 9, tension: 80, useNativeDriver: true }),
        Animated.timing(backdropAnim, { toValue: 1, duration: 250, useNativeDriver: true }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, { toValue: -DRAWER_WIDTH, duration: 220, useNativeDriver: true }),
        Animated.timing(backdropAnim, { toValue: 0, duration: 220, useNativeDriver: true }),
      ]).start();
    }
  }, [visible, colors.statusBarStyle]);

  const handleNavigate = (route: NavRoute) => {
    onClose();
    setTimeout(() => onNavigate(route), 180);
  };

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
      {/* Backdrop */}
      <Animated.View
        style={[styles.backdrop, { opacity: backdropAnim }]}
        pointerEvents={visible ? "auto" : "none"}
      >
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
      </Animated.View>

      {/* Drawer panel */}
      <Animated.View
        style={[
          styles.drawer,
          {
            backgroundColor: colors.card,
            transform: [{ translateX: slideAnim }],
            paddingTop: insets.top + 16,
          },
        ]}
      >
        <View style={[styles.statusBarFill, { height: insets.top, top: -insets.top, backgroundColor: colors.card }]} />

        {/* Profile header — tapping navigates to Profile screen */}
        <TouchableOpacity
          style={styles.profileRow}
          onPress={() => handleNavigate("Profile")}
          activeOpacity={0.75}
        >
          <View style={[styles.avatar, { backgroundColor: colors.inputBg }]}>
            {/* Initials inside avatar */}
            {profile && (
              <Text style={[styles.avatarInitials, { color: colors.textPrimary }]}>
                {profile.first_name[0]}{profile.last_name[0]}
              </Text>
            )}
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.driverName, { color: colors.textPrimary }]} numberOfLines={1}>
              {displayName}
            </Text>
            {profile && (
              <Text style={[styles.driverStats, { color: colors.textMuted }]}>
                {profile.total_deliveries} deliveries · ⭐ {profile.rating.toFixed(1)}
              </Text>
            )}
          </View>
        </TouchableOpacity>

        {/* Primary links */}
        <View style={styles.linksSection}>
          {PRIMARY_LINKS.map(({ label, route }) => (
            <TouchableOpacity
              key={route}
              style={styles.linkRow}
              onPress={() => handleNavigate(route)}
              activeOpacity={0.6}
            >
              <Text style={[styles.linkText, { color: colors.textPrimary }]}>{label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={[styles.divider, { backgroundColor: colors.separatorColor }]} />

        {/* Secondary links */}
        <View style={styles.linksSection}>
          {SECONDARY_LINKS.map(({ label, route }) => (
            <TouchableOpacity
              key={route}
              style={styles.linkRow}
              onPress={() => handleNavigate(route)}
              activeOpacity={0.6}
            >
              <Text style={[styles.linkText, { color: colors.textSecondary }]}>{label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </Animated.View>
    </View>
  );
};

export default NavDrawer;

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.45)",
  },
  drawer: {
    position: "absolute",
    top: 0, left: 0, bottom: 0,
    width: DRAWER_WIDTH,
    paddingBottom: 40,
    shadowColor: "#000",
    shadowOffset: { width: 4, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 20,
  },
  statusBarFill: { position: "absolute", left: 0, right: 0 },
  profileRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    paddingHorizontal: 24,
    paddingBottom: 32,
  },
  avatar: {
    width: 52, height: 52, borderRadius: 26,
    alignItems: "center", justifyContent: "center",
  },
  avatarInitials: { fontSize: 18, fontWeight: "700" },
  driverName: { fontSize: 18, fontWeight: "700", letterSpacing: -0.3 },
  driverStats: { fontSize: 12, marginTop: 2 },
  linksSection: { paddingHorizontal: 24 },
  linkRow: { paddingVertical: 14 },
  linkText: { fontSize: 17, fontWeight: "400" },
  divider: { height: 1, marginHorizontal: 24, marginVertical: 20 },
});