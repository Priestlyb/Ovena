import React from "react";
import { ActivityIndicator, View } from "react-native";

import { homepageStyles as styles } from "@/constants/styles/homepageStyles";
import { useTheme } from "@/constants/theme";

export default function LoaderState() {
  const theme = useTheme();
  return (
    <View
      style={[
        styles.loader,
        {
          backgroundColor: theme.background,
        },
      ]}
    >
      <ActivityIndicator size="large" color="#D9502E" />
    </View>
  );
}
