import React, { useEffect, useState } from "react";

import { useAuth } from "@/context/AuthContext";
import { useDeliveryMethod } from "@/context/DeliveryMethodContext";

import SignupLayout from "@/components/signup/SignupLayout";
import SignupButton from "@/components/signup/SignupButton";
import DobField from "@/components/signup/DobField";
import FormInput from "@/components/signup/FormInput";

import { useDobPicker } from "@/hooks/signup/useDobPicker";
import { useDeviceLocation } from "@/hooks/Location/useDeviceLocation";
import { useOtpSignup } from "@/hooks/signup/useOtpSignup";

export default function OtpSignUpForm() {
  const { accessToken, completeOtpSignup, logout } = useAuth();
  const { isPickingUpFood } = useDeliveryMethod();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [referral, setReferral] = useState("");

  const { coords, loading: locationLoading, getLocation } = useDeviceLocation();

  useEffect(() => {
    getLocation();
  }, [getLocation]);

  const latitude = coords?.lat ?? null;
  const longitude = coords?.lng ?? null;

  const dob = useDobPicker();

  const { loading, submit } = useOtpSignup({
    accessToken,
    completeOtpSignup,
    logout,

    fullName,
    email,
    referral,
    address,

    latitude,
    longitude,

    isPickingUpFood,

    day: dob.day,
    month: dob.month,
    year: dob.year,
  });

  const isDisabled =
    loading ||
    locationLoading ||
    latitude == null ||
    longitude == null ||
    !fullName.trim() ||
    !email.trim() ||
    !address.trim() ||
    dob.day == null ||
    dob.month == null ||
    dob.year == null;

  return (
    <SignupLayout>
      <FormInput
        label="Full Name"
        icon="ProfileIcon"
        value={fullName}
        onChangeText={setFullName}
        placeholder="Enter your full name"
        autoCapitalize="words"
        returnKeyType="next"
      />

      <FormInput
        label="Email"
        icon="EmailIcon"
        value={email}
        onChangeText={setEmail}
        placeholder="Enter your email"
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        returnKeyType="next"
      />

      <FormInput
        label="Address"
        icon="MapPinIcon"
        value={address}
        onChangeText={setAddress}
        placeholder="Enter your address"
        autoCapitalize="words"
        returnKeyType="next"
      />

      <DobField dob={dob} />

      <FormInput
        label="Referral (Optional)"
        icon="TagIcon"
        value={referral}
        onChangeText={setReferral}
        placeholder="Referral Code"
        autoCapitalize="characters"
        autoCorrect={false}
        returnKeyType="done"
      />

      <SignupButton
        title={
          locationLoading
            ? "Create Account"
            : loading
              ? "Please wait..."
              : "Create Account"
        }
        loading={loading}
        disabled={isDisabled}
        onPress={submit}
      />
    </SignupLayout>
  );
}
