import React from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { useTheme } from "@/constants/theme";
import { IconSymbol } from "@/components/ui/icon-symbol";

type SignupButtonProps = {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
};

export default function SignupButton({
  title,
  onPress,
  loading = false,
  disabled = false,
}: SignupButtonProps) {
  const theme = useTheme();
  const isDisabled = loading || disabled;

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      style={[
        styles.button,
        { backgroundColor: theme.primary },
        isDisabled && styles.disabledButton,
      ]}
      onPress={onPress}
      disabled={isDisabled}
    >
      {loading ? (
        <ActivityIndicator color="#FFF" />
      ) : (
        <View style={styles.content}>
          <Text style={styles.buttonText}>{title}</Text>
          <IconSymbol
            name="ArrowRightIcon"
            size={18}
            color="#FFF"
            style={styles.arrowIcon}
          />
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    marginTop: 40,
    height: 58,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
  },

  disabledButton: {
    opacity: 0.6,
  },

  content: {
    flexDirection: "row",
    alignItems: "center",
  },

  buttonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "700",
  },

  arrowIcon: {
    marginLeft: 8,
  },
});
