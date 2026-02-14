import React, { useState, useRef, useEffect } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Animated,
  Dimensions,
} from "react-native";
import { IconSymbol } from "../components/ui/icon-symbol";
import PersonalStep from "../components/signup/PersonalInformation";
import DocumentStep from "../components/signup/IdentificationDocumentation";
import WorkAvailability from "../components/signup/WorkAvailability";
import SafetyAndReliability from "../components/signup/SafetyAndReliability";
import BankDetails from "../components/signup/BankDetails";
import VerifyIdentity from "../components/signup/VerifyIdentity";
import { useRouter } from "expo-router"; // Make sure expo-router is installed

const screenWidth = Dimensions.get("window").width;

export default function Signup() {
  const router = useRouter(); // Router hook

  const steps = [1, 2, 3, 4, 5, 6];
  const [step, setStep] = useState(1);

  /* STEP 1 */
  const [personalInfo, setPersonalInfo] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    gender: "",
    dob: { day: "", month: "", year: "" },
    address: "",
  });

  /* STEP 2 */
  const [docInfo, setDocInfo] = useState({
    licensePicture: "",
    nin: "",
    bvn: "",
    vehicleType: "",
    vehicleMake: "",
    plateNumber: "",
    guarantorName: "",
    guarantorPhone: "",
  });

  /* STEP 3 */
  const [workAvailability, setWorkAvailability] = useState({
    fullTime: false,
    partTime: false,
    days: [] as string[],
    times: [] as string[],
    previousDelivery: [] as string[],
    localRoutes: [] as string[],
    gpsUsed: [] as string[],
    cashOnDelivery: [] as string[],
  });

  /* STEP 4 */
  const [safetyReliability, setSafetyReliability] = useState({
    trafficRules: "",
    helmet: "",
    punctuality: "",
    healthIssue: "",
    healthDetails: "",
    reason: "",
    availability: "",
    bagImage: "",
  });

  /* STEP 5 */
  const [bankDetails, setBankDetails] = useState({
    bank: "",
    accountNumber: "",
    accountName: "",
  });

  /* STEP 6 */
  const [faceImage, setFaceImage] = useState<string>("");

  // Animated progress
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

  const handleGoBack = () => {
    if (step === 1) {
      router.back(); // Navigate to previous screen
    } else {
      setStep(step - 1);
    }
  };

  const handleContinue = () => {
    // Step 6 -> submit or navigate to next page
    if (step === 6) {
      router.push("/next-screen"); // Replace with your target route
      return;
    }

    // For all other steps, move to next step
    setStep(step + 1);
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <PersonalStep
            personalInfo={personalInfo}
            setPersonalInfo={setPersonalInfo}
          />
        );

      case 2:
        return <DocumentStep docInfo={docInfo} setDocInfo={setDocInfo} />;

      case 3:
        return (
          <WorkAvailability
            workAvailability={workAvailability}
            setWorkAvailability={setWorkAvailability}
          />
        );

      case 4:
        return (
          <SafetyAndReliability
            data={safetyReliability}
            setData={setSafetyReliability}
            onBack={handleGoBack}
            onContinue={handleContinue} // Continue moves to step 5
          />
        );

      case 5:
        return <BankDetails data={bankDetails} setData={setBankDetails} />;

      case 6:
        return (
          <VerifyIdentity
            image={faceImage}
            setImage={setFaceImage}
            onContinue={handleContinue} // Uses router.push() to go to next page
            onBack={handleGoBack}
          />
        );

      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      {/* Progress + Back */}
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

      {step !== 4 && (
        <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
          <Text style={styles.continueText}>
            {step === 6 ? "Next" : "Continue"}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 50, backgroundColor: "#fff" },

  progressHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 20,
    marginBottom: 10,
  },

  backButton: { marginRight: 35 },

  progressContainer: {
    flex: 1,
    height: 15,
    backgroundColor: "#F5F5F5",
    borderRadius: 20,
    overflow: "hidden",
  },

  progressIndicator: {
    height: "100%",
    backgroundColor: "#D44C0C",
    borderRadius: 20,
    position: "absolute",
    left: 0,
  },

  continueButton: {
    margin: 20,
    backgroundColor: "#D44C0C",
    padding: 15,
    borderRadius: 50,
  },

  continueText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
  },
});
