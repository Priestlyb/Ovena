import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

export default function Login() {
  return (
    <View style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Section */}
        <View style={styles.hero}>
              <Image
                source={require("../assets/images/loginLogo.png")}
                style={{ width: 150, height: 150 }}
              />

              <Image
                source={require("../assets/images/loginBanner.png")}
                style={styles.loginBanner}
              />

          <TouchableOpacity style={styles.guestBtn} onPress={() => router.replace("/(tabs)/homepage")}>
            <Text style={styles.guestText}>Continue as a Guest</Text>
            <Ionicons name="arrow-forward" size={16} color="#000" />
          </TouchableOpacity>
        </View>

        {/* Promo Card */}
        <View style={styles.promoCard}>
          <View style={styles.promoIcon}>
            <Image source={require("../assets/images/delieveryguy.png")} style={{ width: 54, height: 59 }} />
          </View>
          <View>
            <Text style={styles.promoTitle}>
              first order with free delivery!
            </Text>
            <Text style={styles.promoSub}>
              for new customers only
            </Text>
          </View>
        </View>

        {/* Welcome */}
        <View style={{ alignItems: "center" }}>
        <Text style={styles.welcome}>Welcome</Text>
        <Text style={styles.subText}>
          Let’s Start with your phone Number
        </Text>
        </View>

        {/* Phone Input */}
        <View style={styles.phoneRow}>
          <View style={styles.countryBox}>
            <Text style={styles.flag}>🇳🇬</Text>
            <Text style={styles.code}>+234</Text>
          </View>

          <TextInput
            placeholder="Phone number"
            keyboardType="phone-pad"
            style={styles.phoneInput}
          />
        </View>

        {/* Get SMS */}
        <TouchableOpacity onPress={() => router.replace("/screens/Otp")} style={styles.smsBtn}>
          <Text style={styles.smsText}>Get SMS</Text>
        </TouchableOpacity>

        {/* Divider */}
        <View style={styles.dividerRow}>
          <View style={styles.line} />
          <Text style={styles.orText}>or with</Text>
          <View style={styles.line} />
        </View>

        {/* Google */}
        <TouchableOpacity style={styles.socialBtn}>
          <Ionicons name="logo-google" size={20} />
          <Text style={styles.socialText}>Google</Text>
        </TouchableOpacity>

        {/* Apple */}
        <TouchableOpacity style={styles.socialBtn}>
          <Ionicons name="logo-apple" size={22} />
          <Text style={styles.socialText}>Apple</Text>
        </TouchableOpacity>

        {/* Terms */}
        <Text style={styles.terms}>
          By continuing you automatically accept our{" "}
          <Text style={styles.link}>Terms & conditions</Text> and{" "}
          <Text style={styles.link}>privacy policy</Text>
        </Text>
      </ScrollView>
    </View>
  );
}

const ORANGE = "#E4572E";

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    paddingBottom: 30,
  },

  /* Hero */
  hero: {
    padding: 0,
    margin: 0,
    backgroundColor: ORANGE,
    height: 375,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    overflow: 'hidden',
  },
  loginBanner: {
    position: 'absolute',
    objectFit: 'cover',
    width: '100%',
  },
  guestBtn: {
    position: "absolute",
    bottom: 30,
    right: 20,
    backgroundColor: "#FBE3D8",
    alignSelf: "center",
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 25,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  guestText: {
    fontWeight: "600",
  },

  /* Promo */
  promoCard: {
    backgroundColor: ORANGE,
    marginHorizontal: 20,
    marginTop: 50,
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  promoIcon: {
    width: 54,
    height: 59,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
  },
  promoTitle: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "700",
  },
  promoSub: {
    color: "#FBE3D8",
    fontSize: 16,
  },

  /* Texts */
  welcome: {
    fontSize: 24,
    fontWeight: "700",
    marginTop: 30,
  },
  subText: {
    color: "#666",
  },

  /* Phone */
  phoneRow: {
    flexDirection: "row",
    marginHorizontal: 20,
    marginTop: 20,
    gap: 10,
  },
  countryBox: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    paddingHorizontal: 10,
    gap: 6,
  },
  flag: {
    fontSize: 18,
  },
  code: {
    fontWeight: "600",
  },
  phoneInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    paddingHorizontal: 12,
  },

  /* SMS */
  smsBtn: {
    backgroundColor: "#000",
    marginHorizontal: 20,
    marginTop: 20,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
  },
  smsText: {
    color: "#fff",
    fontWeight: "700",
  },

  /* Divider */
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 20,
    marginVertical: 20,
    gap: 10,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: "#ddd",
  },
  orText: {
    color: "#777",
    fontSize: 12,
  },

  /* Social */
  socialBtn: {
    borderWidth: 1,
    borderColor: "#ddd",
    marginHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 14,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    marginBottom: 10,
  },
  socialText: {
    fontWeight: "600",
  },

  /* Terms */
  terms: {
    fontSize: 11,
    color: "#777",
    textAlign: "center",
    marginHorizontal: 20,
    marginTop: 10,
  },
  link: {
    color: ORANGE,
  },
});
