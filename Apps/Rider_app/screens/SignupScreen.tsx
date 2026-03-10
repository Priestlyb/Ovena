import React, { useState, useRef, useEffect } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Animated,
  Dimensions,
  Alert,
  ActivityIndicator,
} from "react-native";
import { IconSymbol } from "../components/ui/icon-symbol";
import PersonalStep from "../components/signup/PersonalInformation";
import DocumentStep from "../components/signup/IdentificationDocumentation";
import WorkAvailability from "../components/signup/WorkAvailability";
import SafetyAndReliability from "../components/signup/SafetyAndReliability";
import BankDetails from "../components/signup/BankDetails";
import VerifyIdentity from "../components/signup/VerifyIdentity";
import { useRouter } from "expo-router";
import {
  submitPersonalInfo,
  submitDocInfo,
  submitWorkAvailability,
  submitSafetyReliability,
  submitBankDetails,
  submitSelfie,
} from "../services/signupApi";

const screenWidth = Dimensions.get("window").width;

export default function Signup() {
  const router = useRouter();
  const steps = [1, 2, 3, 4, 5, 6];
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Token received from Step 1, used for all subsequent requests
  const [authToken, setAuthToken] = useState<string>("");

  /* ── per-step state ── */
  const [personalInfo, setPersonalInfo] = useState({
    first_name: "", last_name: "", phone_number: "", email: "",
     gender: "", 
    birth_date: { day: "", month: "", year: "" },
    next_of_kin_name: "", next_of_kin_phone: "",  residential_address: "", referre_code: "", 
    password: "",
  });

  const [docInfo, setDocInfo] = useState({
    licensePicture: "", nin: "", bvn: "", vehicleType: "",
    vehicleMake: "", plateNumber: "", guarantorName: "", guarantorPhone: "",
  });

  const [workAvailability, setWorkAvailability] = useState({
    fullTime: false, partTime: false,
    days: [] as string[], times: [] as string[],
    previousDelivery: [] as string[], localRoutes: [] as string[],
    gpsUsed: [] as string[], cashOnDelivery: [] as string[],
  });

  const [safetyReliability, setSafetyReliability] = useState({
    trafficRules: "", helmet: "", punctuality: "",
    healthIssue: "", healthDetails: "", reason: "",
    availability: "", bagImage: "",
  });

  const [bankDetails, setBankDetails] = useState({
    bank: "", accountNumber: "", accountName: "",
  });

  const [faceImage, setFaceImage] = useState<string>("");

  /* ── animated progress bar ── */
  const animatedValue = useRef(new Animated.Value(0)).current;
  const indicatorWidth = screenWidth / steps.length - 40;
  const positions = steps.map((_, i) => i * indicatorWidth);

  useEffect(() => {
    Animated.spring(animatedValue, {
      toValue: positions[step - 1],
      useNativeDriver: true,
      stiffness: 200,
      damping: 20,
      mass: 1,
    }).start();
  }, [step]);

  /* ── per-step submission ── */
  const handleContinue = async () => {
  setIsSubmitting(true);
  try {
    switch (step) {

      case 1: {
  // Format birth_date from { day, month, year } → "YYYY-MM-DD"
  const { birth_date, ...rest } = personalInfo;
  const formattedPayload = {
    ...rest,
    birth_date: `${birth_date.year}-${String(birth_date.month).padStart(2, "0")}-${String(birth_date.day).padStart(2, "0")}`,
  };

  console.log("📦 Step 1 - Personal Info:", JSON.stringify(formattedPayload, null, 2));
  const res = await submitPersonalInfo(formattedPayload);
  setAuthToken(res.token);
  break;
}

      case 2: {
        console.log("📦 Step 2 - Doc Info:", JSON.stringify(docInfo, null, 2));
        await submitDocInfo(docInfo, authToken);
        break;
      }

      case 3: {
        console.log("📦 Step 3 - Work Availability:", JSON.stringify(workAvailability, null, 2));
        await submitWorkAvailability(workAvailability, authToken);
        break;
      }

      case 4: {
        console.log("📦 Step 4 - Safety & Reliability:", JSON.stringify(safetyReliability, null, 2));
        await submitSafetyReliability(safetyReliability, authToken);
        break;
      }

      case 5: {
        console.log("📦 Step 5 - Bank Details:", JSON.stringify(bankDetails, null, 2));
        await submitBankDetails(bankDetails, authToken);
        break;
      }

      case 6: {
        console.log("📦 Step 6 - Selfie URI:", JSON.stringify({ faceImage }, null, 2));
        await submitSelfie(faceImage, authToken);
        Alert.alert("Success 🎉", "Registration complete!", [
          { text: "OK", onPress: () => router.push("/next-screen") },
        ]);
        return;
      }
    }

    setStep((prev) => prev + 1);

  } catch (err: any) {
    Alert.alert(
      "Submission Failed",
      err?.message ?? "Something went wrong. Please try again."
    );
  } finally {
    setIsSubmitting(false);
  }
};

  const handleGoBack = () => {
    if (step === 1) router.back();
    else setStep((prev) => prev - 1);
  };

  /* ── render ── */
  const renderStep = () => {
    switch (step) {
      case 1:
        return <PersonalStep personalInfo={personalInfo} setPersonalInfo={setPersonalInfo} />;
      case 2:
        return <DocumentStep docInfo={docInfo} setDocInfo={setDocInfo} />;
      case 3:
        return <WorkAvailability workAvailability={workAvailability} setWorkAvailability={setWorkAvailability} />;
      case 4:
        return (
          <SafetyAndReliability
            data={safetyReliability}
            setData={setSafetyReliability}
            onBack={handleGoBack}
            onContinue={handleContinue}
          />
        );
      case 5:
        return <BankDetails data={bankDetails} setData={setBankDetails} />;
      case 6:
        return (
          <VerifyIdentity
            image={faceImage}
            setImage={setFaceImage}
            onContinue={handleContinue}
            onBack={handleGoBack}
          />
        );
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.progressHeader}>
        <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
          <IconSymbol name="ArrowLeft" size={24} color="#000" />
        </TouchableOpacity>
        <View style={styles.progressContainer}>
          <Animated.View
            style={[
              styles.progressIndicator,
              { width: indicatorWidth, transform: [{ translateX: animatedValue }] },
            ]}
          />
        </View>
      </View>

      {renderStep()}

      {/* Steps 4 & 6 have their own Continue button inside the component */}
      {step !== 4 && step !== 6 && (
        <TouchableOpacity
          style={[styles.continueButton, isSubmitting && { opacity: 0.6 }]}
          onPress={handleContinue}
          disabled={isSubmitting}
        >
          {isSubmitting
            ? <ActivityIndicator color="#fff" />
            : <Text style={styles.continueText}>
                {step === 5 ? "Submit" : "Continue"}
              </Text>
          }
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 50, backgroundColor: "#fff" },
  progressHeader: {
    flexDirection: "row", alignItems: "center",
    marginHorizontal: 20, marginBottom: 10,
  },
  backButton: { marginRight: 35 },
  progressContainer: {
    flex: 1, height: 15, backgroundColor: "#F5F5F5",
    borderRadius: 20, overflow: "hidden",
  },
  progressIndicator: {
    height: "100%", backgroundColor: "#D44C0C",
    borderRadius: 20, position: "absolute", left: 0,
  },
  continueButton: {
    margin: 20, backgroundColor: "#D44C0C",
    padding: 15, borderRadius: 50,
  },
  continueText: {
    color: "#fff", textAlign: "center",
    fontSize: 18, fontWeight: "bold",
  },
});