import React from "react";
import {
    Linking,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

const GooglePoweredBy: React.FC = () => {
  const handlePress = () => {
    Linking.openURL("https://maps.google.com");
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity activeOpacity={0.7} onPress={handlePress}>
        <Text style={styles.text}>
          Powered by <Text style={styles.google}>Google</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default GooglePoweredBy;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",

    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderBottomWidth: 1,

    borderColor: "#E5E7EB",

    paddingVertical: 10,
    paddingHorizontal: 14,

    alignItems: "flex-end",
  },

  text: {
    fontSize: 12,
    color: "#6B7280",
  },

  google: {
    color: "#4285F4",
    fontWeight: "600",
  },
});
