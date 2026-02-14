// App.tsx
import "react-native-gesture-handler"; // ✅ MUST be first

import React, { useEffect, useRef } from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, View, Animated, Dimensions } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import Login_SignUp from "./screens/Login_SignUp";
import TermsScreen from "./screens/TermsScreen";
import Signup from "./screens/SignupScreen";
import Signin from "./screens/SigninScreen";
import HomeScreen from "./screens/HomeScreen";

/* ---------- Navigation Types ---------- */
type RootStackParamList = {
  Splash: undefined;
  Login_SignUp: undefined;
  TermsScreen: undefined;
  Signup: undefined;
  SignIn: undefined;
  HomeScreen: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
type SplashProps = NativeStackScreenProps<RootStackParamList, "Splash">;

const { width } = Dimensions.get("window");

/* ---------- Splash Screen ---------- */
function SplashScreen({ navigation }: SplashProps) {
  const scaleAnim = useRef(new Animated.Value(0.5)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const translateYAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 4,
          tension: 50,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(translateYAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]),
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.05,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]),
    ]).start(() => {
      navigation.replace("Login_SignUp");
    });
  }, []);

  return (
    <View style={styles.container}>
      <Animated.Image
        source={require("./assets/bright_logo.png")}
        style={[
          styles.image,
          {
            transform: [{ scale: scaleAnim }, { translateY: translateYAnim }],
            opacity: opacityAnim,
          },
        ]}
        resizeMode="contain"
      />
      <StatusBar hidden />
    </View>
  );
}

/* ---------- App Root ---------- */
export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Splash" component={SplashScreen} />
          <Stack.Screen name="Login_SignUp" component={Login_SignUp} />
          <Stack.Screen name="TermsScreen" component={TermsScreen} />
          <Stack.Screen name="Signup" component={Signup} />
          <Stack.Screen name="SignIn" component={Signin} />
          <Stack.Screen name="HomeScreen" component={HomeScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}

/* ---------- Styles ---------- */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#D44C0C",
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: width * 0.6,
    height: width * 0.6,
  },
});
