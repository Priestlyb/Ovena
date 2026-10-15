import React, { useEffect, useState } from "react";

import { useLocalSearchParams } from "expo-router";

import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/constants/theme";

import SignupLayout from "@/components/signup/SignupLayout";
import SignupButton from "@/components/signup/SignupButton";
import DobField from "@/components/signup/DobField";
import FormInput from "@/components/signup/FormInput";

import { useDobPicker } from "@/hooks/signup/useDobPicker";
import { useCompleteSignup } from "@/hooks/signup/useCompleteSignup";
import { useDeviceLocation } from "@/hooks/Location/useDeviceLocation";

export default function GoogleSignUpForm() {
  const { loginWithOAuth } = useAuth();
  const theme = useTheme();

  const params = useLocalSearchParams();

  const accessToken = (params.accessToken as string) || "";

  const [fullName, setFullName] = useState("");
  const [address, setAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [referral, setReferral] = useState("");

  const dob = useDobPicker();

  const { coords, loading: locationLoading, getLocation } = useDeviceLocation();

  useEffect(() => {
    getLocation();
  }, [getLocation]);

  const latitude = coords?.lat ?? null;
  const longitude = coords?.lng ?? null;

  const { loading, submit } = useCompleteSignup({
    accessToken,

    fullName,
    address,
    phoneNumber,
    referral,

    latitude,
    longitude,

    day: dob.day,
    month: dob.month,
    year: dob.year,

    onSuccess: async () => {
      await loginWithOAuth("google", accessToken, null, false);
    },
  });

  return (
    <SignupLayout>
      <FormInput
        label="Full Name"
        value={fullName}
        onChangeText={setFullName}
        placeholder="Enter your full name"
        placeholderTextColor={theme.textSecondary}
        autoCapitalize="words"
        returnKeyType="next"
      />

      <FormInput
        label="Address"
        value={address}
        onChangeText={setAddress}
        placeholder="Enter your address"
        placeholderTextColor={theme.textSecondary}
        autoCapitalize="words"
        returnKeyType="next"
      />

      <FormInput
        label="Phone Number"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
        placeholder="08012345678"
        placeholderTextColor={theme.textSecondary}
        keyboardType="phone-pad"
        maxLength={11}
        returnKeyType="done"
      />

      <DobField dob={dob} />

      <FormInput
        label="Referral Code (Optional)"
        value={referral}
        onChangeText={setReferral}
        placeholder="Referral Code"
        placeholderTextColor={theme.textSecondary}
        autoCapitalize="characters"
      />

      <SignupButton
        title="Continue"
        loading={loading}
        disabled={locationLoading || latitude == null || longitude == null}
        onPress={submit}
      />
    </SignupLayout>
  );
}
