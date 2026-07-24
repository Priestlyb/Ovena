import React from "react";

import { ActivityIndicator, Text, TouchableOpacity } from "react-native";

import { styles } from "@/constants/styles";

/* =========================================
   TYPES
========================================= */
type SubmitButtonProps = {
  loading: boolean;
  onPress: () => void;
};

export function SubmitButton({ loading, onPress }: SubmitButtonProps) {
  return (
    <TouchableOpacity
      style={[
        styles.continueBtn,

        loading && {
          opacity: 0.6,
        },
      ]}
      onPress={onPress}
      disabled={loading}
    >
      {loading ? (
        <ActivityIndicator color="#fff" />
      ) : (
        <Text style={styles.continueBtnText}>Submit</Text>
      )}
    </TouchableOpacity>
  );
}
