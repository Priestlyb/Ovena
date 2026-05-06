// screens/AppSettingsScreen.tsx
import React from "react";
import {
  View, Text, StyleSheet, TouchableOpacity, SafeAreaView, StatusBar,
} from "react-native";
import { useTheme, NightModeOption } from "../context/ThemeContext";
import { MoonIcon, SoundVoiceIcon, NavigationIcon } from "../components/icons/SettingsIcons";
import { IconSymbol } from "../components/ui/icon-symbol";
import ScreenWrapper from "../components/ScreenWrapper";

interface AppSettingsScreenProps {
  onBack: () => void;
}

const NIGHT_MODE_CYCLE: NightModeOption[] = ["off", "on", "auto"];
const NIGHT_MODE_LABELS: Record<NightModeOption, string> = {
  off: "Always off",
  on:  "Always on",
  auto: "Auto (follow device)",
};

const AppSettingsScreen: React.FC<AppSettingsScreenProps> = ({ onBack }) => {
  const { nightMode, setNightMode, colors } = useTheme();

  const cycleNightMode = () => {
    const idx = NIGHT_MODE_CYCLE.indexOf(nightMode);
    setNightMode(NIGHT_MODE_CYCLE[(idx + 1) % NIGHT_MODE_CYCLE.length]);
  };

  return (
    <ScreenWrapper>
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={colors.statusBarStyle} backgroundColor={colors.background} />

      {/* ── Header ── */}
      <View style={[styles.header, { borderBottomColor: colors.separatorColor }]}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <IconSymbol name="ArrowBack" size={22} color={colors.iconColor} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>App settings</Text>
        <View style={styles.backBtn} />
      </View>

      {/* ── Rows ── */}
      <View style={[styles.list, { backgroundColor: colors.background }]}>

        {/* Night mode */}
        <TouchableOpacity
          style={[styles.row, { borderBottomColor: colors.separatorColor }]}
          onPress={cycleNightMode}
          activeOpacity={0.7}
        >
          <View style={[styles.iconWrap, { backgroundColor: colors.inputBg }]}>
            <MoonIcon size={22} color={colors.iconColor} />
          </View>
          <View style={styles.rowText}>
            <Text style={[styles.rowTitle, { color: colors.textPrimary }]}>Night mode</Text>
            <Text style={[styles.rowSub, { color: colors.textMuted }]}>{NIGHT_MODE_LABELS[nightMode]}</Text>
          </View>
          <IconSymbol name="ChevronForwardIcon" size={18} color={colors.textMuted} />
        </TouchableOpacity>

        {/* Sounds and voice */}
        <TouchableOpacity
          style={[styles.row, { borderBottomColor: colors.separatorColor }]}
          onPress={() => {}}
          activeOpacity={0.7}
        >
          <View style={[styles.iconWrap, { backgroundColor: colors.inputBg }]}>
            <SoundVoiceIcon size={22} color={colors.iconColor} />
          </View>
          <View style={styles.rowText}>
            <Text style={[styles.rowTitle, { color: colors.textPrimary }]}>Sounds and voice</Text>
          </View>
          <IconSymbol name="ChevronForwardIcon" size={18} color={colors.textMuted} />
        </TouchableOpacity>

        {/* Navigation */}
        <TouchableOpacity
          style={[styles.row, { borderBottomWidth: 0 }]}
          onPress={() => {}}
          activeOpacity={0.7}
        >
          <View style={[styles.iconWrap, { backgroundColor: colors.inputBg }]}>
            <NavigationIcon size={20} color={colors.iconColor} />
          </View>
          <View style={styles.rowText}>
            <Text style={[styles.rowTitle, { color: colors.textPrimary }]}>Navigation</Text>
          </View>
          <IconSymbol name="ChevronForwardIcon" size={18} color={colors.textMuted} />
        </TouchableOpacity>

      </View>
    </SafeAreaView>
    </ScreenWrapper>
  );
};

export default AppSettingsScreen;

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  backBtn: { width: 36 },
  headerTitle: { fontSize: 18, fontWeight: "700" },
  list: { paddingHorizontal: 20, paddingTop: 12 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    gap: 14,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  rowText: { flex: 1 },
  rowTitle: { fontSize: 16, fontWeight: "600" },
  rowSub: { fontSize: 13, marginTop: 2 },
});