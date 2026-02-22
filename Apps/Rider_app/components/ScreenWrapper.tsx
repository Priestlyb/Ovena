// components/ScreenWrapper.tsx
import React from "react";
import {
  View,
  StyleSheet,
  StatusBar,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface ScreenWrapperProps {
  children: React.ReactNode;
  backgroundColor?: string;
  scrollable?: boolean;
  noPadding?: boolean;
  statusBarStyle?: "dark-content" | "light-content";
}

const ScreenWrapper: React.FC<ScreenWrapperProps> = ({
  children,
  backgroundColor = "#fff",
  scrollable = false,
  noPadding = false,
  statusBarStyle,
}) => {
  const barStyle =
    statusBarStyle ?? (backgroundColor === "#fff" ? "dark-content" : "light-content");

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor }]} edges={["top", "left", "right"]}>
      <StatusBar barStyle={barStyle} backgroundColor={backgroundColor} translucent={false} />
      {scrollable ? (
        <ScrollView
          style={{ flex: 1, backgroundColor }}
          contentContainerStyle={[styles.scrollContent, noPadding && styles.noPadding]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {children}
        </ScrollView>
      ) : (
        <View style={[styles.inner, { backgroundColor }, noPadding && styles.noPadding]}>
          {children}
        </View>
      )}
    </SafeAreaView>
  );
};

export default ScreenWrapper;

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  inner: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  noPadding: {
    paddingHorizontal: 0,
  },
});