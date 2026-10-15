import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";

import { router } from "expo-router";

import { useTheme, ThemeColors } from "@/constants/theme";
import { ThemeMode, useThemePreference } from "@/context/ThemeContext";
import { IconSymbol } from "@/components/ui/icon-symbol";

const themeModes: {
  mode: ThemeMode;
  title: string;
  description: string;
  icon: "MobilePhoneIcon" | "SunIcon" | "MoonIcon";
}[] = [
  {
    mode: "system",
    title: "System",
    description: "Follow your device appearance.",
    icon: "MobilePhoneIcon",
  },
  {
    mode: "light",
    title: "Light",
    description: "Always use the light theme.",
    icon: "SunIcon",
  },
  {
    mode: "dark",
    title: "Dark",
    description: "Always use the dark theme.",
    icon: "MoonIcon",
  },
];

export default function ThemeScreen() {
  const theme = useTheme();
  const styles = createStyles(theme);

  const { themeMode, setThemeMode } = useThemePreference();

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <IconSymbol
            name="ArrowLeftIcon"
            size={22}
            color={theme.textPrimary}
          />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Appearance</Text>

        <View style={styles.headerSpacer} />
      </View>

      <Text style={styles.subtitle}>
        Choose how Ovena looks on your device.
      </Text>

      {themeModes.map((item) => {
        const selected = themeMode === item.mode;

        return (
          <TouchableOpacity
            key={item.mode}
            activeOpacity={0.8}
            onPress={() => setThemeMode(item.mode)}
            style={[
              styles.card,
              selected && {
                borderColor: theme.primary,
                backgroundColor: theme.decorCircle,
              },
            ]}
          >
            <View style={styles.leftSection}>
              <View
                style={[
                  styles.iconContainer,
                  {
                    backgroundColor: selected ? theme.primary : theme.surface,
                  },
                ]}
              >
                <IconSymbol
                  name={item.icon}
                  size={20}
                  color={selected ? "#FFFFFF" : theme.textPrimary}
                />
              </View>

              <View>
                <Text style={styles.title}>{item.title}</Text>

                <Text style={styles.description}>{item.description}</Text>
              </View>
            </View>

            {selected && (
              <IconSymbol name="CheckIcon" size={22} color={theme.primary} />
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const createStyles = (theme: ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
      paddingTop: 60,
    },

    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: 20,
      paddingVertical: 10,
    },

    backButton: {
      padding: 10,
      borderRadius: 50,
      borderWidth: 1,
      borderColor: theme.border,
      backgroundColor: theme.surface,
    },

    headerTitle: {
      fontSize: 24,
      fontWeight: "700",
      color: theme.textPrimary,
    },

    headerSpacer: {
      width: 42,
    },

    subtitle: {
      fontSize: 15,
      color: theme.textSecondary,
      paddingHorizontal: 24,
      marginTop: 10,
      marginBottom: 28,
      lineHeight: 22,
    },

    card: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginHorizontal: 20,
      marginBottom: 14,
      padding: 18,
      borderRadius: 18,
      borderWidth: 1,
      borderColor: theme.border,
      backgroundColor: theme.surface,
    },

    leftSection: {
      flexDirection: "row",
      alignItems: "center",
      flex: 1,
    },

    iconContainer: {
      width: 48,
      height: 48,
      borderRadius: 14,
      justifyContent: "center",
      alignItems: "center",
      marginRight: 16,
    },

    title: {
      fontSize: 17,
      fontWeight: "600",
      color: theme.textPrimary,
    },

    description: {
      marginTop: 3,
      fontSize: 14,
      color: theme.textSecondary,
    },
  });
