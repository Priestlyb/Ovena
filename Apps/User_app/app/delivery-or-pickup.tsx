import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { router } from "expo-router";
import Svg, { Path, Text as SvgText, TextPath } from "react-native-svg";

const { width } = Dimensions.get("window");

export default function FoodDeliveryChoiceScreen() {
  return (
    <View style={styles.container}>
      {/* Options */}
      <View style={styles.optionsRow}>
        {/* Pick-up */}
        <TouchableOpacity
          style={styles.option}
          onPress={() => router.replace("/login")}
        >
          <Svg width={120} height={100} viewBox="20 -30 120 60">
            <Path
              id="pickupCurve"
              d="M 10 50 A 50 50 0 0 1 110 50"
              fill="transparent"
            />
            <SvgText
              fill="#E53935"
              fontSize={27}
              fontWeight="700"
            >
              <TextPath
                href="#pickupCurve"
                startOffset="30%"
                textAnchor="middle"
              >
                Pick-up
              </TextPath>
            </SvgText>
          </Svg>

          <Image
            source={require("../assets/images/Pickup.png")}
            style={styles.optionImageRight}
          />
        </TouchableOpacity>

        {/* Delivery */}
        <TouchableOpacity
          style={styles.option}
          onPress={() => router.replace("/login")}
        >
          <Svg width={145} height={100} viewBox="38 -4 80 25">
            <Path
              id="deliveryCurve"
              d="M 10 50 A 50 50 0 0 1 110 50"
              fill="transparent"
            />
            <SvgText
              fill="#E53935"
              fontSize={17}
              fontWeight="700"
              transform="rotate(-80 80 30)"
            >
              <TextPath
                href="#deliveryCurve"
                startOffset="60%"
                textAnchor="middle"
              >
                Delivery
              </TextPath>
            </SvgText>
          </Svg>

          <View style={styles.optionImageCover}>
            <Image
            source={require("../assets/images/Delivery.png")}
            style={styles.optionImageLeft}
          />
          </View>
        </TouchableOpacity>
      </View>

      {/* Center Logo */}
      <View style={styles.logoWrapper}>
        <Image
          source={require("../assets/images/DeliveryOrPickUpLogo.png")}
          style={styles.logo}
        />
        <View
          style={{
            alignItems: "center",
            marginTop: 10,
            justifyContent: "center",
          }}
        >
          {/* Bottom Curved Text */}
        <Svg
          width={350}
          height={300}
          viewBox="55 55 90 150"
          style={{ marginTop: 0 }}
        >
          <Path
            id="bottomCurve"
            d="M 20 20 A 130 100 0 0 0 280 20"
            fill="transparent"
          />
          <SvgText
            fill="#D9502E"
            fontSize={28}
            fontWeight="800"
            letterSpacing={1}
          >
            <TextPath
              href="#bottomCurve"
              startOffset="27%"
              textAnchor="middle"
            >
              Food Delivery
            </TextPath>
          </SvgText>
        </Svg>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4D34F",
    alignItems: "center",
    justifyContent: "center",
  },

  logoWrapper: {
    alignItems: "center",
  },

  logo: {
    width: 150,
    height: 150,
    resizeMode: "contain",
  },

  brandText: {
    marginTop: 6,
    fontSize: 18,
    fontWeight: "700",
    color: "#E53935",
  },

  optionsRow: {
    flexDirection: "row",
    gap: 100,
    marginTop: 10,
  },

  option: {
    alignItems: "center",
  },

  optionLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#E53935",
    marginBottom: 10,
    transform: [{ rotate: "-15deg" }],
  },

  optionImageCover: {
    transform: [{ rotate: "-180deg" }],
  },

  optionImageRight: {
    width: width * 0.28,
    height: width * 0.28,

    borderBottomLeftRadius: 80,
    borderBottomRightRadius: 50,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 100,
    shadowColor: "#000000",
    shadowOffset: { width: 10, height: -3 },
    shadowOpacity: 0.6,
    shadowRadius: 15,
    elevation: 10,
  },

  optionImageLeft: {
    width: width * 0.28,
    height: width * 0.28,

    borderBottomLeftRadius: 80,
    borderBottomRightRadius: 50,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 100,
    shadowColor: "#000000",
    shadowOffset: { width: 10, height: -3 },
    shadowOpacity: 0.6,
    shadowRadius: 15,
    elevation: 10,

    transform: [{ rotate: "-90deg" }],
  },

  footerText: {
    fontSize: 28,
    fontWeight: "800",
    color: "#D9502E",
  },
});
