import { BusinessImagePicker } from "@/components/BusinessImagePicker";
import { BusinessLogoImagePicker } from "@/components/BusinessLogoImagePicker";
import { CustomDropdown } from "@/components/CustomDropDown";
import { CustomInput } from "@/components/CustomInput";
import FeedbackModal from "@/components/FeedbackModal";
import { PhoneInput } from "@/components/PhoneInput";
import { styles } from "@/constants/styles";
import { NavigationProps } from "@/types";
import { ArrowLeft } from "lucide-react-native";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
} from "react-native";

type ImageType = {
  uri: string;
  uploadedUrl?: string;
};

interface BusinessDetailsPageProps extends NavigationProps<void> {
  data: {
    businessName: string;
    businessTypes: string[];
    businessType: string;
    email: string;
    phoneNumber: string;
  };

  productImage: ImageType | null;
  businessLogo: ImageType | null;

  uploadProgress: number;
  isUploading?: boolean;

  uploadLogoProgress: number;
  isUploadingLogo?: boolean;

  onChangeBusinessName: (value: string) => void;
  onChangeBusinessType: (value: string) => void;
  onChangeEmail: (value: string) => void;
  onChangePhone: (value: string) => void;

  handleImageUpload: () => void;
  removeImage: () => void;

  handleLogoUpload: () => void;
  removeLogo: () => void;
}

const BusinessDetailsPage: React.FC<BusinessDetailsPageProps> = ({
  data,
  productImage,
  businessLogo,
  uploadProgress,
  isUploading = false,
  uploadLogoProgress,
  isUploadingLogo = false,
  onChangeBusinessName,
  onChangeBusinessType,
  onChangeEmail,
  onChangePhone,
  handleImageUpload,
  removeImage,
  handleLogoUpload,
  removeLogo,
  onNext,
  onBack,
}) => {
  const [emailError, setEmailError] = useState("");
  const [phoneError, setPhoneError] = useState("");

  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const showErrors = (errors: string[]) => {
    setModalMessage(errors.map((e) => `• ${e}`).join("\n"));
    setModalVisible(true);
  };

  /* ================= EMAIL ================= */

  const normalizeEmail = (email: string) => email.trim().toLowerCase();

  const validateEmail = (email: string) => {
    const normalized = normalizeEmail(email);
    const regex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;

    return {
      isValid: regex.test(normalized),
      normalized,
    };
  };

  /* ================= PHONE ================= */

  const normalizeNigerianPhone = (input: string): string => {
    let cleaned = input.replace(/[\s-()]/g, "");

    if (cleaned.startsWith("00")) cleaned = "+" + cleaned.slice(2);
    if (/^234\d{10}$/.test(cleaned)) cleaned = "+" + cleaned;
    if (/^0\d{10}$/.test(cleaned)) cleaned = "+234" + cleaned.slice(1);
    if (/^\d{10}$/.test(cleaned)) cleaned = "+234" + cleaned;

    return cleaned;
  };

  const validatePhone = (phone: string) => {
    const normalized = normalizeNigerianPhone(phone);

    if (!/^\+234\d{10}$/.test(normalized)) {
      return { isValid: false, normalized };
    }

    const local = normalized.replace("+234", "");

    const validPrefixes = [
      "701",
      "702",
      "703",
      "704",
      "705",
      "706",
      "707",
      "708",
      "709",
      "801",
      "802",
      "803",
      "804",
      "805",
      "806",
      "807",
      "808",
      "809",
      "810",
      "811",
      "812",
      "813",
      "814",
      "815",
      "816",
      "817",
      "818",
      "819",
      "901",
      "902",
      "903",
      "904",
      "905",
      "906",
      "907",
      "908",
      "909",
    ];

    return {
      isValid: validPrefixes.includes(local.substring(0, 3)),
      normalized,
    };
  };

  /* ================= VALIDATION ================= */

  const handleNext = () => {
    const errors: string[] = [];
    let isValid = true;

    const cleanedEmail = normalizeEmail(data.email);

    if (!data.businessName.trim()) {
      errors.push("Business name is required");
      isValid = false;
    }

    if (!data.businessType) {
      errors.push("Please select a business type");
      isValid = false;
    }

    if (!cleanedEmail) {
      errors.push("Email is required");
      isValid = false;
    } else {
      const { isValid: emailValid, normalized } = validateEmail(cleanedEmail);

      if (!emailValid) {
        errors.push(
          "Email must be a valid Gmail address (e.g example@gmail.com)",
        );
        isValid = false;
      } else {
        onChangeEmail(normalized);
      }
    }

    if (!data.phoneNumber.trim()) {
      errors.push("Phone number is required");
      isValid = false;
    } else {
      const { isValid: phoneValid, normalized } = validatePhone(
        data.phoneNumber,
      );

      if (!phoneValid) {
        errors.push("Enter a valid Nigerian phone number (e.g 08012345678)");
        isValid = false;
      } else {
        onChangePhone(normalized);
      }
    }

    // ✅ IMAGE VALIDATION (NOW CHECK BOTH)
    if (!productImage) {
      errors.push("Business image is required");
      isValid = false;
    }

    if (!businessLogo) {
      errors.push("Business logo is required");
      isValid = false;
    }

    if (!isValid) {
      showErrors(errors);
      return;
    }

    onNext();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          style={styles.container}
          showsVerticalScrollIndicator={false}
        >
          <TouchableOpacity style={styles.backButton} onPress={onBack}>
            <ArrowLeft size={22} />
          </TouchableOpacity>

          <Text style={styles.pageTitle}>Begin your Ovena experience</Text>

          <BusinessLogoImagePicker
            businessLogo={businessLogo}
            uploadLogoProgress={uploadLogoProgress}
            isUploadingLogo={isUploadingLogo}
            handleImageUpload={handleLogoUpload}
            removeImage={removeLogo}
          />

          <BusinessImagePicker
            productImage={productImage}
            uploadProgress={uploadProgress}
            isUploading={isUploading}
            handleImageUpload={handleImageUpload}
            removeImage={removeImage}
          />

          <CustomInput
            label="Business Name"
            placeholder="e.g Burger King"
            value={data.businessName}
            onChange={onChangeBusinessName}
            required
          />

          <CustomDropdown
            label="Business Type"
            options={data.businessTypes}
            placeholder="Select type"
            value={data.businessType}
            onChange={onChangeBusinessType}
            required
          />

          <CustomInput
            label="Email address"
            placeholder="e.g example@gmail.com"
            value={data.email}
            onChange={(value) => {
              onChangeEmail(value);
              if (emailError) setEmailError("");
            }}
            required
            type="email"
          />

          <PhoneInput
            value={data.phoneNumber}
            onChange={(value) => {
              onChangePhone(value);
              if (phoneError) setPhoneError("");
            }}
            required
          />

          <TouchableOpacity style={styles.continueBtn} onPress={handleNext}>
            <Text style={styles.continueBtnText}>Continue</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>

      <FeedbackModal
        visible={modalVisible}
        message={modalMessage}
        variant="error"
        onClose={() => setModalVisible(false)}
      />
    </SafeAreaView>
  );
};

export default BusinessDetailsPage;
