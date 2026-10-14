// screens/Login_SignUp.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  useWindowDimensions,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { LinearGradient } from "expo-linear-gradient";
import { Feather } from "@expo/vector-icons";
import TermsModal from "../modals/TermsModal";
import { useTheme } from "../context/ThemeContext";

type RootStackParamList = {
  Splash: undefined;
  Login_SignUp: undefined;
  TermsScreen: undefined;
  Signup: undefined;
  SignIn: undefined;
  HomeScreen: undefined;
};

type Props = NativeStackScreenProps<RootStackParamList, "Login_SignUp">;

const FEATURES = [
  { icon: "zap", label: "Flexible\nSchedule" },
  { icon: "dollar-sign", label: "Great\nEarnings" },
  { icon: "navigation", label: "Easy\nNavigation" },
  { icon: "shield", label: "Safe &\nSupported" },
] as const;

const Login_SignUp: React.FC<Props> = ({ navigation }) => {
  const { colors } = useTheme();
  const [modalVisible, setModalVisible] = useState(false);
  const { width, height } = useWindowDimensions();

  const logoSize = Math.min(width * 0.34, 140);

  // Called when the user accepts the terms inside the modal —
  // close the modal and send them straight to the signup flow.
  const handleContinue = () => {
    setModalVisible(false);
    navigation.navigate("Signup");
  };

  const handleTermsPress = () => {
    setModalVisible(false);
    navigation.navigate("TermsScreen");
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* HERO */}
      <LinearGradient
        colors={["#7A1F00", "#E6531A", "#FF8A2A"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.hero, { paddingTop: height * 0.06, minHeight: height * 0.4 }]}
      >
        <Image
          source={require("../assets/bright_logo.png")}
          style={{ width: logoSize, height: logoSize }}
          resizeMode="contain"
        />

        <Text style={styles.heroHeadline}>
          Delivering{"\n"}
          <Text style={styles.heroHeadlineBold}>Good Food,</Text>
          {"\n"}
          <Text style={styles.heroHeadlineAccent}>Together</Text>
        </Text>

        <Text style={styles.heroSubtext}>
          Join the Ovena rider community{"\n"}and get to work, your way.
        </Text>
      </LinearGradient>

      {/* CONTENT SHEET */}
      <View
        style={[
          styles.textContainer,
          { paddingVertical: height * 0.035, backgroundColor: colors.card, borderColor: colors.separatorColor },
        ]}
      >
        <Text style={[styles.title, { color: colors.textPrimary }]}>
          Welcome to {"\n"} Ovena rider app
        </Text>

        <Text style={[styles.subtitle, { color: colors.textMuted }]}>
          Choose Your Schedule and {"\n"} Maximize Your Earnings
        </Text>

        {/* FEATURE ROW */}
        <View style={styles.featureRow}>
          {FEATURES.map((f) => (
            <View key={f.icon} style={styles.featureItem}>
              <View style={[styles.featureIconWrap, { backgroundColor: colors.inputBg }]}>
                <Feather name={f.icon} size={20} color={colors.accentOrange} />
              </View>
              <Text style={[styles.featureLabel, { color: colors.textPrimary }]}>{f.label}</Text>
            </View>
          ))}
        </View>

        {/* Sign in → SignIn screen, which navigates to HomeScreen on success */}
        <TouchableOpacity
          style={[styles.primaryButton, { width: width * 0.9, backgroundColor: colors.accentOrange }]}
          onPress={() => navigation.navigate("SignIn")}
        >
          <Text style={styles.primaryButtonText}>Sign in</Text>
          <Feather name="arrow-right" size={18} color="#fff" style={styles.buttonIcon} />
        </TouchableOpacity>

        {/* Apply here → show Terms modal first, then go to Signup */}
        <TouchableOpacity
          style={[
            styles.secondaryButton,
            { width: width * 0.9, backgroundColor: colors.inputBg, borderColor: colors.accentOrange },
          ]}
          onPress={() => setModalVisible(true)}
        >
          <Text style={[styles.secondaryButtonText, { color: colors.textPrimary }]}>Apply here</Text>
          <Feather name="arrow-right" size={18} color={colors.textPrimary} style={styles.buttonIcon} />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("TermsScreen")}>
          <Text style={[styles.learnMore, { color: colors.textMuted }]}>
            New to Ovena? <Text style={{ color: colors.accentOrange, fontWeight: "700" }}>Learn more →</Text>
          </Text>
        </TouchableOpacity>

        <Text style={[styles.versionText, { color: colors.textMuted }]}>v4.9914.5</Text>
      </View>

      <TermsModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onContinue={handleContinue}
        onTermsPress={handleTermsPress}
      />
    </View>
  );
};

export default Login_SignUp;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  hero: {
    alignItems: "center",
    paddingHorizontal: 24,
    paddingBottom: 40,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  heroHeadline: {
    marginTop: 20,
    fontSize: 26,
    fontWeight: "700",
    color: "#fff",
    textAlign: "center",
    lineHeight: 32,
  },
  heroHeadlineBold: {
    fontWeight: "800",
  },
  heroHeadlineAccent: {
    fontWeight: "800",
    color: "#FFD27A",
  },
  heroSubtext: {
    marginTop: 12,
    fontSize: 14,
    color: "rgba(255,255,255,0.85)",
    textAlign: "center",
  },
  textContainer: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    borderWidth: 1,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -24,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
  },
  subtitle: {
    marginTop: 10,
    fontSize: 14,
    fontWeight: "500",
    textAlign: "center",
  },
  featureRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 22,
    marginBottom: 8,
  },
  featureItem: {
    flex: 1,
    alignItems: "center",
  },
  featureIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
  },
  featureLabel: {
    fontSize: 11,
    fontWeight: "600",
    textAlign: "center",
    lineHeight: 14,
  },
  primaryButton: {
    marginTop: 22,
    paddingVertical: 15,
    borderRadius: 50,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  primaryButtonText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 17,
    fontWeight: "600",
  },
  secondaryButton: {
    marginTop: 14,
    paddingVertical: 15,
    borderRadius: 50,
    borderWidth: 1.5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  secondaryButtonText: {
    textAlign: "center",
    fontSize: 17,
    fontWeight: "600",
  },
  buttonIcon: {
    marginLeft: 8,
  },
  learnMore: {
    marginTop: 16,
    fontSize: 13,
    textAlign: "center",
  },
  versionText: {
    textAlign: "center",
    fontSize: 12,
    marginTop: 14,
    opacity: 0.6,
  },
});