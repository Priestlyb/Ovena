import React from "react";
import { Image, Text, View, StyleSheet } from "react-native";

import { RIDER_GUY_IMAGE } from "@/constants/homepage/homepageImages";
import { useTheme } from "@/constants/theme";

export default function PromoBanner() {
  const theme = useTheme();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.background,
        },
      ]}
    >
      <Image source={RIDER_GUY_IMAGE} style={styles.image} />

      <View style={styles.textContainer}>
        <Text
          style={[
            styles.title,
            {
              color: theme.textPrimary,
            },
          ]}
        >
          Enjoy a food discount and free delivery on your first order when you
          order now.
        </Text>

        <Text
          style={[
            styles.description,
            {
              color: theme.textSecondary,
            },
          ]}
        >
          There's nothing quite like seeing your child's face light up. After
          all their hard work and big achievements, give them a meal that puts a
          smile on their face and makes you feel like a superstar parent.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 20,
    padding: 12,
    gap: 25,
  },

  textContainer: {
    flex: 1,
    paddingRight: 10,
    width: 50,
  },

  title: {
    fontWeight: "700",
    fontSize: 16,
    marginBottom: 6,
  },

  description: {
    fontSize: 15,
    fontWeight: "300",
    lineHeight: 18,
  },

  image: {
    width: 200,
    height: 200,
    resizeMode: "contain",
  },
});
