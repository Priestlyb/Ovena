// SignInScreen.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import { IconSymbol } from "../components/ui/icon-symbol";

/* 🔐 Stack Types */
type RootStackParamList = {
  Login_SignUp: undefined;
  SignIn: undefined;
  HomeScreen: undefined;
};

type SignInNavProp = NativeStackNavigationProp<
  RootStackParamList,
  "SignIn"
>;

const SignIn = () => {
  const navigation = useNavigation<SignInNavProp>();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSignIn = () => {
    // Navigate directly to HomeScreen
    navigation.navigate("HomeScreen");
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      {/* 🔙 Go Back */}
      <TouchableOpacity
        style={styles.backBtn}
        onPress={() => navigation.goBack()}
      >
        <IconSymbol name="ArrowLeft" size={24} color="#000000" />
      </TouchableOpacity>

      <Text style={styles.title}>Sign In</Text>

      <View style={styles.inputContainer}>
        {/* Email */}
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#A0A0A0"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />

        {/* Password */}
        <View style={styles.passwordWrapper}>
          <TextInput
            style={[styles.input, { flex: 1, marginBottom: 0 }]}
            placeholder="Password"
            placeholderTextColor="#A0A0A0"
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={setPassword}
          />

          <TouchableOpacity
            style={styles.eyeButton}
            onPress={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <IconSymbol name="EyeInvisibleIcon" size={24} color="#000000" />
            ) : (
              <IconSymbol name="EyeIcon" size={24} color="#000000" />
            )}
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity style={styles.forgotButton}>
        <Text style={styles.forgotText}>Forgot Password?</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={handleSignIn}>
        <Text style={styles.buttonText}>Sign In</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
};

export default SignIn;

// ===== Styles =====
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9F9FB",
    padding: 24,
    justifyContent: "center",
  },

  backBtn: {
    marginBottom: 16,
  },

  title: {
    fontSize: 32,
    fontWeight: "700",
    color: "#1B1B1F",
    marginBottom: 8,
  },

  inputContainer: {
    marginBottom: 24,
  },

  input: {
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
    fontSize: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },

  passwordWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingRight: 8,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },

  eyeButton: {
    paddingHorizontal: 8,
  },

  button: {
    backgroundColor: "#efeded",
    paddingVertical: 16,
    borderRadius: 50,
    alignItems: "center",
    marginBottom: 12,
  },

  buttonText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "600",
  },

  forgotButton: {
    alignSelf: "flex-start",
    marginBottom: 24,
  },
  forgotText: {
    color: "#D44C0C",
    fontSize: 14,
  },
});
