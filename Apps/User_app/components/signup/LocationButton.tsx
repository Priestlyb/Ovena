import React from "react";
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
} from "react-native";

type Props = {
  loading: boolean;
  hasLocation: boolean;
  onPress: () => void;
};

export default function LocationButton({
  loading,
  hasLocation,
  onPress,
}: Props) {
  return (
    <TouchableOpacity
      style={styles.btn}
      onPress={onPress}
    >
      {loading ? (
        <ActivityIndicator />
      ) : (
        <Text>
          {hasLocation
            ? "Location Added ✔"
            : "Allow Location Access"}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: {
    marginTop: 25,
    padding: 15,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#ddd",
    alignItems: "center",
  },
});