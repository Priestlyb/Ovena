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

interface BusinessDetailsPageProps extends NavigationProps<void> {
  data: {
    businessName: string;
    businessTypes: string[];
    businessType: string;
    email: string;
    phoneNumber: string;
  };
  onChangeBusinessName: (value: string) => void;
  onChangeBusinessType: (value: string) => void;
  onChangeEmail: (value: string) => void;
  onChangePhone: (value: string) => void;
}

const BusinessDetailsPage: React.FC<BusinessDetailsPageProps> = ({
  data,
  onChangeBusinessName,
  onChangeBusinessType,
  onChangeEmail,
  onChangePhone,
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

  /* =========================================================
     EMAIL
  ========================================================= */

  const normalizeEmail = (email: string) => {
    return email.trim().toLowerCase();
  };

  const validateEmail = (email: string) => {
    const normalized = normalizeEmail(email);

    const regex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;

    return {
      isValid: regex.test(normalized),
      normalized,
    };
  };

  /* =========================================================
     PHONE (STRICT NIGERIAN VALIDATION)
  ========================================================= */

  const normalizeNigerianPhone = (input: string): string => {
    let cleaned = input.replace(/[\s-()]/g, "");

    if (cleaned.startsWith("00")) {
      cleaned = "+" + cleaned.slice(2);
    }

    if (/^234\d{10}$/.test(cleaned)) {
      cleaned = "+" + cleaned;
    }

    if (/^0\d{10}$/.test(cleaned)) {
      cleaned = "+234" + cleaned.slice(1);
    }

    if (/^\d{10}$/.test(cleaned)) {
      cleaned = "+234" + cleaned;
    }

    return cleaned;
  };

  const validatePhone = (phone: string) => {
    const normalized = normalizeNigerianPhone(phone);

    // must match +234XXXXXXXXXX
    if (!/^\+234\d{10}$/.test(normalized)) {
      return { isValid: false, normalized };
    }

    const local = normalized.replace("+234", "");

    // ✅ VALID NIGERIAN PREFIXES
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

    const prefix = local.substring(0, 3);

    if (!validPrefixes.includes(prefix)) {
      return { isValid: false, normalized };
    }

    return { isValid: true, normalized };
  };

  /* =========================================================
     VALIDATION LOGIC
  ========================================================= */

  const handleNext = () => {
    const errors: string[] = [];
    let isValid = true;

    const cleanedEmail = normalizeEmail(data.email);

    // Business Name
    if (!data.businessName.trim()) {
      errors.push("Business name is required");
      isValid = false;
    }

    // Business Type
    if (!data.businessType) {
      errors.push("Please select a business type");
      isValid = false;
    }

    // Email
    if (!cleanedEmail) {
      const msg = "Email is required";
      errors.push(msg);
      setEmailError(msg);
      isValid = false;
    } else {
      const { isValid: emailValid, normalized } = validateEmail(cleanedEmail);

      if (!emailValid) {
        const msg =
          "Email must be a valid Gmail address (e.g example@gmail.com)";
        errors.push(msg);
        setEmailError(msg);
        isValid = false;
      } else {
        setEmailError("");
        onChangeEmail(normalized);
      }
    }

    // Phone
    if (!data.phoneNumber.trim()) {
      const msg = "Phone number is required";
      errors.push(msg);
      setPhoneError(msg);
      isValid = false;
    } else {
      const { isValid: phoneValid, normalized } = validatePhone(
        data.phoneNumber,
      );

      if (!phoneValid) {
        const msg = "Enter a valid Nigerian phone number (e.g 08012345678)";
        errors.push(msg);
        setPhoneError(msg);
        isValid = false;
      } else {
        setPhoneError("");
        onChangePhone(normalized);
      }
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
