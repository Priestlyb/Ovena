// src/components/SafeViewScreen.tsx
import React, { ReactNode } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet } from "react-native";

type Props = {
  children: ReactNode;
};

export default function SafeViewScreen({ children }: Props) {
  return <SafeAreaView style={styles.container}>{children}</SafeAreaView>;
}

const styles = StyleSheet.create({
  container: {
    paddingTop: -50,
    flex: 1,
    backgroundColor: "#ffff",
    overflow: "hidden",
  },
});
