import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, View } from "react-native";

import BusinessDetailsPage from "./screens/businessDetails";
import EmailVerificationPage from "./screens/emailVerification";
import LocationPage from "./screens/locationPage";
import PasswordPage from "./screens/passwordCreation";
import ChecklistPage from "./superForm2/checklist";

import { useAuth } from "@/app/_layout";
import { BUSINESS_TYPES, COUNTRIES } from "@/constants/onboardingOptions";
import api from "@/services/apiClient";
import { getAccessToken } from "@/utils/authStorage";

import SuccessModal from "@/components/SuccessModal";

/* ========================================================= */
export enum FormStep {
  Location = 1,
  BusinessDetails,
  Password,
  EmailVerification,
  Checklist,
}

/* ========================================================= */
export interface FormData {
  selectedCountry: string;
  businessAddress: string;
  businessName: string;
  businessType: string;
  email: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
}

/* ========================================================= */
export default function SuperForm() {
  const {} = useAuth();

  const [formData, setFormData] = useState<FormData>({
    selectedCountry: "",
    businessAddress: "",
    businessName: "",
    businessType: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
  });

  const [currentStep, setCurrentStep] = useState<FormStep>(FormStep.Location);
  const [initializing, setInitializing] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [showSuccess, setShowSuccess] = useState(false);

  /* ========================================================= */
  const updateField = <K extends keyof FormData>(
    field: K,
    value: FormData[K],
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const goToStep = (step: FormStep) => setCurrentStep(step);

  const handleNext = (step?: FormStep) => {
    if (step) return goToStep(step);
    goToStep((currentStep + 1) as FormStep);
  };

  /* ========================================================= */
  const formatPhone = (phone: string) => {
    let cleaned = phone.trim();

    if (cleaned.startsWith("0")) return "+234" + cleaned.slice(1);
    if (!cleaned.startsWith("+234")) return "+234" + cleaned;

    return cleaned;
  };

  /* ========================================================= */
  const validateForm = () => {
    if (!formData.businessName) return "Business name is required";
    if (!formData.businessType) return "Business type is required";
    if (!formData.selectedCountry) return "Country is required";
    if (!formData.businessAddress) return "Address is required";
    if (!formData.email) return "Email is required";
    if (!formData.phoneNumber) return "Phone number is required";
    if (!formData.password) return "Password is required";

    if (!formData.email.includes("@")) return "Invalid email format";

    if (formData.password !== formData.confirmPassword)
      return "Passwords do not match";

    return null;
  };

  /* ========================================================= */
  const cleanPayload = (payload: any) => {
    const cleaned: any = {};

    Object.keys(payload).forEach((key) => {
      const value = payload[key];
      if (value !== undefined && value !== null && value !== "") {
        cleaned[key] = value;
      }
    });

    return cleaned;
  };

  /* ========================================================= */
  const handleSuccessClose = () => {
    setShowSuccess(false);
    goToStep(FormStep.Checklist);
  };

  /* ========================================================= */
  const submitOnboarding = async () => {
    const errorMsg = validateForm();
    if (errorMsg) {
      Alert.alert("Validation Error", errorMsg);
      return;
    }

    setSubmitting(true);

    try {
      const rawPayload = {
        business_name: formData.businessName,
        business_type: formData.businessType,
        country: formData.selectedCountry,
        business_address: formData.businessAddress,
        email: formData.email,
        phone_number: formatPhone(formData.phoneNumber),
        password: formData.password,
      };

      const payload = cleanPayload(rawPayload);

      console.log("ONBOARD PAYLOAD:", JSON.stringify(payload, null, 2));

      const token = await getAccessToken();

      if (!token) {
        Alert.alert("Error", "You are not logged in.");
        return;
      }

      const response = await api.post("/accounts/onboard/phase1/", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      console.log("ONBOARD SUCCESS:", response.data);

      setShowSuccess(true);
    } catch (err: any) {
      console.log("FULL ERROR:", err);
      console.log("STATUS:", err?.response?.status);
      console.log("BACKEND ERROR:", err?.response?.data);

      let message = "Something went wrong";

      if (err?.response?.data) {
        const data = err.response.data;

        // handle DRF / Laravel / Node formats
        if (typeof data === "string") {
          message = data;
        } else if (data.message) {
          message = data.message;
        } else {
          // extract first error
          const firstKey = Object.keys(data)[0];
          if (firstKey) {
            message = Array.isArray(data[firstKey])
              ? data[firstKey][0]
              : data[firstKey];
          }
        }
      }

      Alert.alert("Onboarding Failed", message);
    } finally {
      setSubmitting(false);
    }
  };

  /* ========================================================= */
  useEffect(() => {
    let isMounted = true;

    const initStep = async () => {
      try {
        goToStep(FormStep.Location);
      } catch (err) {
        console.error("INIT ERROR:", err);
      } finally {
        if (isMounted) setInitializing(false);
      }
    };

    initStep();

    return () => {
      isMounted = false;
    };
  }, []);

  /* ========================================================= */
  if (initializing || submitting) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator size="large" />
      </View>
    );
  }

  /* ========================================================= */
  return (
    <>
      {(() => {
        switch (currentStep) {
          case FormStep.Location:
            return (
              <LocationPage
                data={{
                  countries: COUNTRIES,
                  selectedCountry: formData.selectedCountry,
                  businessAddress: formData.businessAddress,
                }}
                onChangeCountry={(v) => updateField("selectedCountry", v)}
                onChangeAddress={(v) => updateField("businessAddress", v)}
                onNext={() => handleNext()}
                onBack={() => {}}
              />
            );

          case FormStep.BusinessDetails:
            return (
              <BusinessDetailsPage
                data={{
                  businessName: formData.businessName,
                  businessTypes: BUSINESS_TYPES,
                  businessType: formData.businessType,
                  email: formData.email,
                  phoneNumber: formData.phoneNumber,
                }}
                onChangeBusinessName={(v) => updateField("businessName", v)}
                onChangeBusinessType={(v) => updateField("businessType", v)}
                onChangeEmail={(v) => updateField("email", v)}
                onChangePhone={(v) => updateField("phoneNumber", v)}
                onNext={() => handleNext()}
                onBack={() => goToStep(FormStep.Location)}
              />
            );

          case FormStep.Password:
            return (
              <PasswordPage
                data={{
                  password: formData.password,
                  confirmPassword: formData.confirmPassword,
                }}
                onChangePassword={(v) => updateField("password", v)}
                onChangeConfirmPassword={(v) =>
                  updateField("confirmPassword", v)
                }
                onNext={() => handleNext(FormStep.EmailVerification)}
                onBack={() => goToStep(FormStep.BusinessDetails)}
              />
            );

          case FormStep.EmailVerification:
            return (
              <EmailVerificationPage
                email={formData.email}
                onNext={submitOnboarding}
                onBack={() => goToStep(FormStep.Password)}
              />
            );

          case FormStep.Checklist:
            return (
              <ChecklistPage
                completionStatus={{
                  verifyBusiness: false,
                  completeProfile: false,
                  setupPayments: false,
                  setupOperations: false,
                  addMenuItems: false,
                }}
                onBack={() => goToStep(FormStep.EmailVerification)}
                onSubmit={() => console.log("Checklist completed")}
              />
            );

          default:
            return null;
        }
      })()}

      <SuccessModal
        visible={showSuccess}
        message="Account created successfully"
        onClose={handleSuccessClose}
      />
    </>
  );
}
