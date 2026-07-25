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

const Login_SignUp: React.FC<Props> = ({ navigation }) => {
  const { colors } = useTheme();
  const [modalVisible, setModalVisible] = useState(false);
  const { width, height } = useWindowDimensions();

  const logoSize = Math.min(width * 0.7, 300);

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
      {/* LOGO */}
      <View style={styles.imageWrapper}>
        <Image
          source={require("../assets/dark_logo.png")}
          style={{ width: logoSize, height: logoSize }}
          resizeMode="contain"
        />
      </View>

      {/* CONTENT */}
      <View style={[
        styles.textContainer,
        { paddingVertical: height * 0.05, backgroundColor: colors.card, borderColor: colors.separatorColor },
      ]}>
        <Text style={[styles.title, { color: colors.textPrimary }]}>
          Welcome to {"\n"} Ovena rider app
        </Text>

        <Text style={[styles.subtitle, { color: colors.textMuted }]}>
          Choose Your Schedule and {"\n"} Maximize Your Earnings
        </Text>

        {/* Sign in → SignIn screen, which navigates to HomeScreen on success */}
        <TouchableOpacity
          style={[styles.primaryButton, { width: width * 0.9, backgroundColor: colors.accentOrange }]}
          onPress={() => navigation.navigate("SignIn")}
        >
          <Text style={styles.primaryButtonText}>Sign in</Text>
        </TouchableOpacity>

        {/* Apply here → show Terms modal first, then go to Signup */}
        <TouchableOpacity
          style={[styles.secondaryButton, { width: width * 0.9, backgroundColor: colors.inputBg }]}
          onPress={() => setModalVisible(true)}
        >
          <Text style={[styles.secondaryButtonText, { color: colors.textPrimary }]}>Apply here</Text>
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
  imageWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  textContainer: {
    width: "100%",
    alignItems: "center",
    borderWidth: 1,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
  },
  subtitle: {
    marginTop: 16,
    fontSize: 15,
    fontWeight: "500",
    textAlign: "center",
  },
  primaryButton: {
    marginTop: 30,
    paddingVertical: 15,
    borderRadius: 50,
  },
  primaryButtonText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 17,
    fontWeight: "600",
  },
  secondaryButton: {
    marginTop: 20,
    paddingVertical: 15,
    borderRadius: 50,
  },
  secondaryButtonText: {
    textAlign: "center",
    fontSize: 17,
    fontWeight: "600",
  },
  versionText: {
    textAlign: "center",
    fontSize: 13,
    marginTop: 20,
    opacity: 0.6,
  },
});