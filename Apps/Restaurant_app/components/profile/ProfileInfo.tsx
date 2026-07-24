// components/profile/ProfileInfo.tsx

import React from "react";
import { ActivityIndicator, Image, View } from "react-native";

import { Text } from "@/components/atoms/Text";
import { profileBookingStyles } from "@/constants/profile-booking-styles";

interface Props {
  loading: boolean;
  name?: string;
  email?: string;
  logo?: string;
}

export const ProfileInfo = ({ loading, name, email, logo }: Props) => {
  if (loading) {
    return <ActivityIndicator size="large" color="#F65513" />;
  }

  return (
    <>
      <View
        style={{
          flexDirection: "row",
          padding: 15,
          borderRadius: 12,
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <View style={profileBookingStyles.profileUserInfo}>
          <Image
            source={{ uri: logo }}
            style={{
              width: 100,
              height: 100,
              borderRadius: 60,
            }}
          />
        </View>

        <View style={profileBookingStyles.profileRatingBadge}>
          <Text
            style={{
              color: "#FFFFFF",
              fontWeight: "bold",
              fontSize: 16,
            }}
          >
            5.00 ⭐
          </Text>
        </View>
      </View>

      <Text
        style={{
          fontWeight: "bold",
          fontSize: 17,
          marginBottom: 5,
        }}
      >
        {name}
      </Text>

      <Text
        style={{
          fontSize: 15,
        }}
      >
        {email}
      </Text>
    </>
  );
};
