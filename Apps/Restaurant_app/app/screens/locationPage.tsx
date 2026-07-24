import { CustomDropdown } from "@/components/CustomDropDown";
import { CustomInput } from "@/components/CustomInput";
import FeedbackModal from "@/components/FeedbackModal";
import { styles } from "@/constants/styles";
import { NavigationProps } from "@/types";
import { useRouter } from "expo-router";
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

/* =========================================================
   STRICT PROPS
========================================================= */
interface LocationPageProps extends NavigationProps<void> {
  data: {
    countries: string[];
    selectedCountry: string;
    businessAddress: string;
  };
  onChangeCountry: (value: string) => void;
  onChangeAddress: (value: string) => void;
}

/* =========================================================
   COMPONENT
========================================================= */
const LocationPage: React.FC<LocationPageProps> = ({
  data,
  onChangeCountry,
  onChangeAddress,
  onNext,
  onBack,
}) => {
  const safeData = data ?? {
    countries: [],
    selectedCountry: "",
    businessAddress: "",
  };

  const router = useRouter();

  /* =========================================================
     MODAL STATE
  ========================================================= */
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  /* =========================================================
     VALIDATION
  ========================================================= */
  const validateFields = () => {
    const errors: string[] = [];

    if (!safeData.selectedCountry) {
      errors.push("Please select a country");
    }

    if (!safeData.businessAddress.trim()) {
      errors.push("Business address is required");
    }

    if (errors.length > 0) {
      setModalMessage(errors.join("\n"));
      setModalVisible(true);
      return false;
    }

    return true;
  };

  const handleContinue = () => {
    if (!validateFields()) return;
    onNext();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          style={[styles.container, styles.locationContainer]}
          showsVerticalScrollIndicator={false}
        >
          {/* Back Button */}
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.push("/")}
          >
            <ArrowLeft size={22} />
          </TouchableOpacity>

          <Text style={styles.pageTitle}>Pinpoint your current food Spot</Text>

          {/* Country Dropdown */}
          <CustomDropdown
            label="Country"
            options={safeData.countries}
            placeholder="Select Country"
            value={safeData.selectedCountry}
            onChange={onChangeCountry}
            required
          />

          {/* Business Address */}
          <CustomInput
            label="Business Address"
            placeholder="Enter address"
            value={safeData.businessAddress}
            onChange={onChangeAddress}
            required
          />

          {/* Continue Button */}
          <TouchableOpacity style={styles.continueBtn} onPress={handleContinue}>
            <Text style={styles.continueBtnText}>Continue</Text>
          </TouchableOpacity>
        </ScrollView>

        {/* FEEDBACK MODAL */}
        <FeedbackModal
          visible={modalVisible}
          message={modalMessage}
          variant="error"
          onClose={() => setModalVisible(false)}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default LocationPage;

//GOOGLE AUTOCOMPLETE

{
  /*
  import { CustomDropdown } from "@/components/CustomDropDown";
import FeedbackModal from "@/components/FeedbackModal";
import GoogleAddressInput from "@/components/GoogleAddressInput";
import { styles } from "@/constants/styles";
import { NavigationProps } from "@/types";
import { GoogleLocation } from "@/types/google";
import { useRouter } from "expo-router";
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

interface LocationPageProps extends NavigationProps<void> {
  data: {
    countries: string[];
    selectedCountry: string;
    businessAddress: string;
  };

  onChangeCountry: (value: string) => void;

  onChangeAddress: (value: string) => void;
}

const LocationPage: React.FC<LocationPageProps> = ({
  data,
  onChangeCountry,
  onChangeAddress,
  onNext,
}) => {
  const safeData = data ?? {
    countries: [],
    selectedCountry: "",
    businessAddress: "",
  };

  const router = useRouter();

  const GOOGLE_API_KEY =
    process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY ??
    "AIzaSyBhNS_oIZJQ_1yVpTumNF5NrsBrNt6rsBY";

  const [modalVisible, setModalVisible] = useState(false);

  const [modalMessage, setModalMessage] = useState("");

  const validateFields = () => {
    const errors: string[] = [];

    if (!safeData.selectedCountry) {
      errors.push("Please select a country");
    }

    if (!safeData.businessAddress.trim()) {
      errors.push("Business address is required");
    }

    if (errors.length > 0) {
      setModalMessage(errors.join("\n"));
      setModalVisible(true);

      return false;
    }

    return true;
  };

  console.log("Google Key:", GOOGLE_API_KEY);

  const handleContinue = () => {
    if (!validateFields()) {
      return;
    }

    onNext();
  };

  const handleLocationSelected = (location: GoogleLocation) => {
    console.log("Selected Location");

    console.log(location);

    onChangeAddress(location.address);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          style={[styles.container, styles.locationContainer]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Back 

          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.push("/")}
          >
            <ArrowLeft size={22} />
          </TouchableOpacity>

          <Text style={styles.pageTitle}>Pinpoint your current food Spot</Text>

          {/* Country 

          <CustomDropdown
            label="Country"
            options={safeData.countries}
            placeholder="Select Country"
            value={safeData.selectedCountry}
            onChange={onChangeCountry}
            required
          />

          {/* Google Address 

          <GoogleAddressInput
            label="Business Address"
            placeholder="Search your business address"
            required
            value={safeData.businessAddress}
            apiKey={GOOGLE_API_KEY}
            country="ng"
            onChangeText={onChangeAddress}
            onSelectLocation={handleLocationSelected}
          />

          {/* Continue 

          <TouchableOpacity style={styles.continueBtn} onPress={handleContinue}>
            <Text style={styles.continueBtnText}>Continue</Text>
          </TouchableOpacity>
        </ScrollView>

        <FeedbackModal
          visible={modalVisible}
          message={modalMessage}
          variant="error"
          onClose={() => setModalVisible(false)}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default LocationPage;
 
  */
}
