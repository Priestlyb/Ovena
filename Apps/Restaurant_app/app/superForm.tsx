import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, View } from "react-native";

import * as ImagePicker from "expo-image-picker";

import BusinessDetailsPage from "./screens/businessDetails";
import EmailVerificationPage from "./screens/emailVerification";
import LocationPage from "./screens/locationPage";
import PasswordPage from "./screens/passwordCreation";
import ChecklistPage from "./superForm2/checklist";

import { useAuth } from "@/app/_layout";
import { BUSINESS_TYPES, COUNTRIES } from "@/constants/onboardingOptions";
import api from "@/services/apiClient";
import { getAccessToken } from "@/utils/authStorage";

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
type ImageType = {
  uri: string;
  uploadedUrl?: string;
};

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

  const [productImage, setProductImage] = useState<ImageType | null>(null);
  const [businessLogo, setBusinessLogo] = useState<ImageType | null>(null);

  const [currentStep, setCurrentStep] = useState<FormStep>(FormStep.Location);
  const [initializing, setInitializing] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  /* ================= FORM HELPERS ================= */

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

  /* ================= IMAGE PICKER (FIXED) ================= */

  const pickImage = async (setter: (img: ImageType | null) => void) => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert("Permission required", "Allow access to photos.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });

    if (result.canceled) return;

    const asset = result.assets[0];

    setter({
      uri: asset.uri,
    });
  };

  const handleImageUpload = () => pickImage(setProductImage);
  const handleLogoUpload = () => pickImage(setBusinessLogo);

  /* ================= PHONE FORMAT ================= */

  const formatPhone = (phone: string) => {
    let cleaned = phone.trim();
    if (cleaned.startsWith("0")) return "+234" + cleaned.slice(1);
    if (!cleaned.startsWith("+234")) return "+234" + cleaned;
    return cleaned;
  };

  /* ================= VALIDATION ================= */

  const validateForm = () => {
    if (!formData.businessName) return "Business name is required";
    if (!formData.businessType) return "Business type is required";
    if (!formData.selectedCountry) return "Country is required";
    if (!formData.businessAddress) return "Address is required";
    if (!formData.email) return "Email is required";
    if (!formData.phoneNumber) return "Phone number is required";
    if (!formData.password) return "Password is required";

    if (!productImage) return "Business image is required";
    if (!businessLogo) return "Business logo is required";

    if (!formData.email.includes("@")) return "Invalid email format";

    if (formData.password !== formData.confirmPassword)
      return "Passwords do not match";

    return null;
  };

  /* ================= SUBMIT ================= */

  const submitOnboarding = async () => {
    const errorMsg = validateForm();
    if (errorMsg) {
      Alert.alert("Validation Error", errorMsg);
      return;
    }

    setSubmitting(true);

    try {
      const token = await getAccessToken();
      if (!token) {
        Alert.alert("Error", "You are not logged in.");
        return;
      }

      const payload = new FormData();

      payload.append("business_name", formData.businessName);
      payload.append("business_type", formData.businessType);
      payload.append("country", formData.selectedCountry);
      payload.append("business_address", formData.businessAddress);
      payload.append("email", formData.email);
      payload.append("phone_number", formatPhone(formData.phoneNumber));
      payload.append("password", formData.password);

      if (productImage?.uri) {
        payload.append("business_image", {
          uri: productImage.uri,
          name: `business_${Date.now()}.jpg`,
          type: "image/jpeg",
        } as any);
      }

      if (businessLogo?.uri) {
        payload.append("business_logo", {
          uri: businessLogo.uri,
          name: `logo_${Date.now()}.jpg`,
          type: "image/jpeg",
        } as any);
      }

      console.log("========== IMAGES ==========");
      console.log("Product:", productImage?.uri);
      console.log("Logo:", businessLogo?.uri);
      console.log("============================");

      const response = await api.put("/accounts/onboard/phase1/", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      goToStep(FormStep.Checklist);
    } catch (err: any) {
      console.log("ERROR:", err);
      Alert.alert(
        "Onboarding Failed",
        err?.response?.data?.message || "Something went wrong",
      );
    } finally {
      setSubmitting(false);
    }
  };

  /* ================= INIT ================= */

  useEffect(() => {
    setCurrentStep(FormStep.Location);
    setInitializing(false);
  }, []);

  if (initializing || submitting) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  /* ================= UI ================= */

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
                productImage={productImage}
                businessLogo={businessLogo}
                uploadProgress={0}
                uploadLogoProgress={0}
                isUploading={false}
                isUploadingLogo={false}
                handleImageUpload={handleImageUpload}
                handleLogoUpload={handleLogoUpload}
                removeImage={() => setProductImage(null)}
                removeLogo={() => setBusinessLogo(null)}
              />
            );

          case FormStep.Password:
            return (
              <PasswordPage
                data={{
                  email: formData.email,
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
            return <ChecklistPage />;

          default:
            return null;
        }
      })()}
    </>
  );
}
