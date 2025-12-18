import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { StyleSheet } from "react-native";

export default function Otp() {
  return (
    <>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.otpHeader}>
          <TouchableOpacity onPress={() => router.replace("/login")}>
            <Ionicons name="arrow-back" size={25} />
          </TouchableOpacity>
          <Text style={{ fontSize: 17, fontWeight: "bold" }}>OTP Code</Text>
          <View style={{ width: 10, height: 10 }} />
        </View>

        <View>
          <Text style={{ fontSize: 17 }}>A four Digit code will be sent to your Number:</Text>
          <Text style={{ color: "#D9502E" }}>08067XXXX86</Text>
        </View>

        <View style={{ height: 100 }}>
          <TextInput
            placeholder="X X X X"
            keyboardType="phone-pad"
            style={styles.otpInput}
          />
        </View>
        <View style={{ flexDirection: "row", gap: 5, marginBottom: 15 }}>
          <Text>Resend Sms?</Text>
          <Text  style={{ color: "#D9502E", fontWeight: "bold" }}>Click here</Text>
        </View>
        <Text>Try another method.</Text>

        <TouchableOpacity onPress={() => router.replace("/screens/SignUpForm")} style={{ position: "absolute", bottom: 0, left: 30, right: 30, backgroundColor: "#D9502E", paddingVertical: 15, borderRadius: 12, alignItems: "center" }}>
          <Text style={{ color: "white", fontWeight: "bold" }}>Continue</Text>
        </TouchableOpacity>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    height: "90%",
    marginTop: 60,
    paddingHorizontal: 30,
  },
  otpHeader: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 50,
  },
  otpInput: {
    width: "100%",
    flex: 1,
    borderWidth: 2,
    borderColor: "#ddd",
    borderRadius: 12,
    marginVertical: 25,
    height: 50,
    paddingHorizontal: 12,
  },
});
