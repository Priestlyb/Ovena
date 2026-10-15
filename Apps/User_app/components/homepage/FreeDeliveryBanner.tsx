import React from "react";
import { Image, Text, View } from "react-native";

import { DELIVERY_GUY_IMAGE } from "@/constants/homepage/homepageImages";
import { useTheme } from "@/constants/theme";

export default function FreeDeliveryBanner() {
  const theme = useTheme();

  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 20,
        backgroundColor: theme.warning,
        padding: 20,
        alignItems: "center",
        height: 155,
      }}
    >
      <View>
        <Text
          style={{
            fontWeight: "700",
            fontSize: 17,
            color: theme.secondary,
          }}
        >
          Free delivery on your first order
        </Text>

        <Text
          style={{
            fontSize: 15,
            color: theme.secondary,
          }}
        >
          It’s time to treat yourself
        </Text>
      </View>

      <Image
        source={DELIVERY_GUY_IMAGE}
        style={{
          width: 110,
          height: 110,
          position: "absolute",
          right: 0,
          bottom: -7,
          zIndex: 1,
        }}
      />

      <View
        style={{
          position: "absolute",
          right: -45,
          top: 0,
          backgroundColor: "#DBBA4D",
          width: 150,
          height: 150,
          borderRadius: 75,
        }}
      />

      <View
        style={{
          position: "absolute",
          right: -65,
          bottom: 0,
          backgroundColor: "#F6D44F",
          width: 150,
          height: 150,
          borderRadius: 75,
        }}
      />
    </View>
  );
}
