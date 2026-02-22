// screens/AppSettingsScreen.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Switch,
} from "react-native";
import ScreenWrapper from "../components/ScreenWrapper";
import PageHeader from "../components/PageHeader";
import { IconSymbol } from "../components/ui/icon-symbol";

interface AppSettingsScreenProps {
  onBack: () => void;
}

const AppSettingsScreen: React.FC<AppSettingsScreenProps> = ({ onBack }) => {
  const [nightMode, setNightMode] = useState(false);
  const [sounds, setSounds] = useState(true);
  const [navigation, setNavigation] = useState(true);

  return (
    <ScreenWrapper>
      <PageHeader title="App settings" onBack={onBack} />

      <View style={styles.list}>
        {/* Night mode */}
        <View style={[styles.row, styles.borderBottom]}>
          <View style={styles.rowLeft}>
            <View style={styles.iconWrap}>
              <Text style={styles.iconEmoji}>🌙</Text>
            </View>
            <View>
              <Text style={styles.rowTitle}>Night mode</Text>
              <Text style={styles.rowSub}>
                {nightMode ? "Always on" : "Always off"}
              </Text>
            </View>
          </View>
          <Switch
            value={nightMode}
            onValueChange={setNightMode}
            trackColor={{ false: "#e0e0e0", true: "#D44C0C" }}
            thumbColor="#fff"
          />
        </View>

        {/* Sounds and voice */}
        <TouchableOpacity
          style={[styles.row, styles.borderBottom]}
          activeOpacity={0.7}
          onPress={() => setSounds((v) => !v)}
        >
          <View style={styles.rowLeft}>
            <View style={styles.iconWrap}>
              <Text style={styles.iconEmoji}>🔊</Text>
            </View>
            <Text style={styles.rowTitle}>Sounds and voice</Text>
          </View>
          <Switch
            value={sounds}
            onValueChange={setSounds}
            trackColor={{ false: "#e0e0e0", true: "#D44C0C" }}
            thumbColor="#fff"
          />
        </TouchableOpacity>

        {/* Navigation */}
        <TouchableOpacity
          style={styles.row}
          activeOpacity={0.7}
          onPress={() => setNavigation((v) => !v)}
        >
          <View style={styles.rowLeft}>
            <View style={styles.iconWrap}>
              <Text style={styles.iconEmoji}>🧭</Text>
            </View>
            <Text style={styles.rowTitle}>Navigation</Text>
          </View>
          <Switch
            value={navigation}
            onValueChange={setNavigation}
            trackColor={{ false: "#e0e0e0", true: "#D44C0C" }}
            thumbColor="#fff"
          />
        </TouchableOpacity>
      </View>
    </ScreenWrapper>
  );
};

export default AppSettingsScreen;

const styles = StyleSheet.create({
  list: {
    paddingTop: 12,
    paddingHorizontal: 20,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 18,
  },
  borderBottom: {
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  rowLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    flex: 1,
  },
  iconWrap: {
    width: 32,
    alignItems: "center",
  },
  iconEmoji: {
    fontSize: 22,
  },
  rowTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#111",
  },
  rowSub: {
    fontSize: 13,
    color: "#999",
    marginTop: 2,
  },
}); 