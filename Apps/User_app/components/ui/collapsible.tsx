import { PropsWithChildren, useState } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useTheme } from "@/constants/theme";

export function Collapsible({
  children,
  title,
}: PropsWithChildren<{ title: string }>) {
  const [isOpen, setIsOpen] = useState(false);

  const theme = useTheme();
  const styles = createStyles(theme);

  return (
    <ThemedView style={styles.container}>
      <TouchableOpacity
        style={styles.heading}
        onPress={() => setIsOpen((prev) => !prev)}
        activeOpacity={0.8}
      >
        <IconSymbol
          name="ChevronRightIcon"
          size={18}
          color={theme.icon}
          style={{
            transform: [{ rotate: isOpen ? "90deg" : "0deg" }],
          }}
        />

        <ThemedText type="defaultSemiBold" style={styles.title}>
          {title}
        </ThemedText>
      </TouchableOpacity>

      {isOpen && <ThemedView style={styles.content}>{children}</ThemedView>}
    </ThemedView>
  );
}

const createStyles = (theme: any) =>
  StyleSheet.create({
    container: {
      backgroundColor: "transparent",
    },

    heading: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      paddingVertical: 4,
    },

    title: {
      color: theme.textPrimary,
    },

    content: {
      marginTop: 6,
      marginLeft: 24,
      backgroundColor: "transparent",
    },
  });
