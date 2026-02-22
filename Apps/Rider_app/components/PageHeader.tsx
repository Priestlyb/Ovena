// components/PageHeader.tsx
import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { IconSymbol } from "./ui/icon-symbol";

interface PageHeaderProps {
  title: string;
  onBack: () => void;
  rightElement?: React.ReactNode;
  backgroundColor?: string;
  titleColor?: string;
  iconColor?: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  onBack,
  rightElement,
  backgroundColor = "#fff",
  titleColor = "#111",
  iconColor = "#111",
}) => {
  const insets = useSafeAreaInsets();

  return (
    <>
      <StatusBar
        barStyle={backgroundColor === "#fff" ? "dark-content" : "light-content"}
        backgroundColor={backgroundColor}
        translucent={false}
      />
      <View
        style={[
          styles.header,
          {
            backgroundColor,
            paddingTop: insets.top + 12,
          },
        ]}
      >
        <TouchableOpacity
          onPress={onBack}
          style={styles.backBtn}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <IconSymbol name="ArrowLeftIcon" size={22} color={iconColor} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: titleColor }]}>{title}</Text>
        <View style={styles.right}>{rightElement ?? null}</View>
      </View>
    </>
  );
};

export default PageHeader;

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: 16,
    paddingHorizontal: 20,
  },
  backBtn: {
    width: 36,
    alignItems: "flex-start",
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: -0.3,
  },
  right: {
    width: 36,
    alignItems: "flex-end",
  },
});