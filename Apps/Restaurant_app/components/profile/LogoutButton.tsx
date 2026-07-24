// components/profile/LogoutButton.tsx

import React from "react";
import { ActivityIndicator, TouchableOpacity } from "react-native";

import { LogOut } from "lucide-react-native";

import { Text } from "@/components/atoms/Text";
import { profileBookingStyles } from "@/constants/profile-booking-styles";

interface Props {
  loading: boolean;
  onPress: () => void;
}

export const LogoutButton = ({ loading, onPress }: Props) => {
  return (
    <>
      <TouchableOpacity
        style={[
          profileBookingStyles.logoutButton,
          {
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
          },
          loading && { opacity: 0.7 },
        ]}
        onPress={onPress}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator size="small" color="#EF4444" />
        ) : (
          <>
            <LogOut size={20} color="#EF4444" />

            <Text
              variant="body"
              weight="semibold"
              style={{
                color: "#EF4444",
                marginLeft: 8,
              }}
            >
              Logout
            </Text>
          </>
        )}
      </TouchableOpacity>
      {/* 
      <Spacer size="xxl" />

      <DeleteAccountButton />
      */}
    </>
  );
};
