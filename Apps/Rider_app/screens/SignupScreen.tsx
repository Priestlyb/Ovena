import React, { useState, useRef, useEffect } from "react";
import {
  View, StyleSheet, Text, TouchableOpacity,
  Animated, Dimensions, Alert, ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { IconSymbol } from "../components/ui/icon-symbol";
import PersonalStep, { PersonalStepRef } from "../components/signup/PersonalInformation";
import DocumentStep, { DocumentStepRef } from "../components/signup/IdentificationDocumentation";
import WorkStep, {
  WorkAvailabilityState,
  DEFAULT_WORK_AVAILABILITY,
} from "../components/signup/WorkAvailability";
import SafetyAndReliability, {
  SafetyReliabilityState,
  DEFAULT_SAFETY_STATE,
} from "../components/signup/SafetyAndReliability";
import BankDetails, { BankDetailsRef, BankData, DEFAULT_BANK_DATA } from "../components/signup/BankDetails";
import VerifyIdentity from "../components/signup/VerifyIdentity";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import {
  submitPersonalInfo,
  submitDocInfo,
  submitWorkAndSafety,
  submitBankAndSelfie,
  getOnboardingStatus,
} from "../services/signupApi";
import { useAppData } from "../context/appDataContext";
import { useTheme } from "../context/ThemeContext";

type RootStackParamList = {
  Login_SignUp: undefined;
  Signup: undefined;
  HomeScreen: undefined;
};

type SignupNavProp = NativeStackNavigationProp<RootStackParamList, "Signup">;

const screenWidth = Dimensions.get("window").width;

// ── Step map ──────────────────────────────────────────────────────────────────
// Internal steps 1–6 map to 4 visible progress bar segments:
//
//   Step 1 → progress segment 1  (Personal Information)
//   Step 2 → progress segment 2  (Identification & Documentation)
//   Step 3 → progress segment 3  (Work Availability)       ─┐ submitted
//   Step 4 → progress segment 3  (Safety & Reliability)    ─┘ together
//   Step 5 → progress segment 4  (Bank Details)            ─┐ submitted
//   Step 6 → progress segment 4  (Verify Identity)         ─┘ together

const PROGRESS_SEGMENTS = 4;

const STEP_TO_SEGMENT: Record<number, number> = {
  1: 0,
  2: 1,
  3: 2,
  4: 2,
  5: 3,
  6: 3,
};

// ── Resume support ────────────────────────────────────────────────────────────
// The backend tracks onboarding progress in terms of its own submission
// phases (1 = personal info, 2 = identification/docs, 3 = work+safety,
// 4 = bank+selfie). GET /api/accounts/onboard/driver/status/ returns
// `current_phase`, i.e. how many of those phases have been submitted so far.
// We map that onto the internal 6-step wizard so a returning applicant is
// dropped back at the first *unsubmitted* step instead of restarting at 1.
//
//   current_phase 0 → nothing submitted yet   → step 1 (Personal Info)
//   current_phase 1 → phase/1/ done           → step 2 (Identification & Docs)
//   current_phase 2 → phase/2/ done           → step 3 (Work Availability)
//   current_phase 3 → phase/3/ done           → step 5 (Bank Details)
//   current_phase 4 → phase/4/ done           → all_phases_complete, handled separately
const PHASE_TO_RESUME_STEP: Record<number, number> = {
  0: 1,
  1: 2,
  2: 3,
  3: 5,
};

// Keys used to persist the in-progress applicant's auth token locally so the
// app can resume their status check on relaunch — separate from the main
// driver-session token so an in-progress signup never clobbers a logged-in
// driver's session.
const ONBOARDING_TOKEN_KEY = "@ovena_onboarding_access_token";
const ONBOARDING_REFRESH_KEY = "@ovena_onboarding_refresh_token";

export default function Signup() {
  const navigation = useNavigation<SignupNavProp>();
  const { colors } = useTheme();

  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authToken, setAuthToken] = useState("");
  const [refreshToken, setRefreshToken] = useState("");
  // True while we check for a saved in-progress application on mount —
  // keeps the wizard from flashing step 1 before we know where to resume.
  const [checkingStatus, setCheckingStatus] = useState(true);
  const { refresh } = useAppData();

  // ── Step refs (for child-driven validation) ───────────────────────────────
  const personalRef = useRef<PersonalStepRef>(null);
  const docRef      = useRef<DocumentStepRef>(null);
  const bankRef     = useRef<BankDetailsRef>(null);

  // ── Step 1 state ──────────────────────────────────────────────────────────
  const [personalInfo, setPersonalInfo] = useState({
    first_name: "", last_name: "", phone_number: "", email: "",
    gender: "", birth_date: { day: "", month: "", year: "" },
    next_of_kin_name: "", next_of_kin_phone: "",
    residential_address: "", next_of_kin_address: "", password: "",
  });

  // ── Step 2 state ──────────────────────────────────────────────────────────
  const [docInfo, setDocInfo] = useState({
    drivers_license: "", nin: "", bvn: "", vehicleType: "",
    vehicleMake: "", plateNumber: "", guarantorName: "", guarantorPhone: "",
    guarantorTwoName: "", guarantorTwoPhone: "",
  });

  // ── Step 3 state — Work Availability ─────────────────────────────────────
  const [workAvailability, setWorkAvailability] =
    useState<WorkAvailabilityState>(DEFAULT_WORK_AVAILABILITY);

  // ── Step 4 state — Safety & Reliability ──────────────────────────────────
  const [safetyReliability, setSafetyReliability] =
    useState<SafetyReliabilityState>(DEFAULT_SAFETY_STATE);

  // ── Step 5 state — Bank Details ───────────────────────────────────────────
  const [bankDetails, setBankDetails] = useState<BankData>(DEFAULT_BANK_DATA);

  // ── Step 6 state — Selfie ─────────────────────────────────────────────────
  const [faceImage, setFaceImage] = useState("");

  // ── Resume-in-progress-application check ─────────────────────────────────
  // On mount: look for a saved token from a previous, incomplete signup
  // attempt. If one exists, ask the backend where the applicant left off and
  // jump straight there. If there's no saved token, this is a fresh signup
  // and we just fall through to step 1 as before.
  useEffect(() => {
    (async () => {
      try {
        const savedToken = await AsyncStorage.getItem(ONBOARDING_TOKEN_KEY);
        if (!savedToken) {
          console.log("🆕 No saved onboarding token — starting fresh at step 1.");
          return;
        }

        console.log("🔄 Saved onboarding token found — checking application status…");
        const status = await getOnboardingStatus(savedToken);
        console.log("📋 Onboarding status:", JSON.stringify(status, null, 2));

        setAuthToken(savedToken);
        const savedRefresh = await AsyncStorage.getItem(ONBOARDING_REFRESH_KEY);
        if (savedRefresh) setRefreshToken(savedRefresh);

        if (status.all_phases_complete) {
          // Nothing left to fill in — the application has already been
          // submitted in full and is presumably awaiting review.
          Alert.alert(
            "Application Already Submitted",
            status.reviewer_note ||
              `Your application is ${status.submission_status || "under review"}. We'll notify you once it's been reviewed.`
          );
          await AsyncStorage.multiRemove([ONBOARDING_TOKEN_KEY, ONBOARDING_REFRESH_KEY]);
          navigation.goBack();
          return;
        }

        const resumeStep = PHASE_TO_RESUME_STEP[status.current_phase] ?? 1;
        console.log(`↪️ Resuming at internal step ${resumeStep} (backend phase ${status.current_phase})`);
        setStep(resumeStep);

        // NOTE: `phase_data` from the status response isn't hydrated into
        // personalInfo/docInfo/etc. here — its exact shape per phase isn't
        // pinned down yet. Once confirmed, prefill the relevant step state
        // from status.phase_data here so returning applicants see their
        // previously-entered values instead of blank fields.
      } catch (err) {
        // Don't block signup on a failed status check — just start fresh.
        console.error("⚠️ Could not fetch onboarding status, starting fresh:", err);
      } finally {
        setCheckingStatus(false);
      }
    })();
  }, []);

  // ── Progress bar animation ────────────────────────────────────────────────
  const animatedValue = useRef(new Animated.Value(0)).current;
  const indicatorWidth = screenWidth / PROGRESS_SEGMENTS - 40;
  const segmentPositions = Array.from(
    { length: PROGRESS_SEGMENTS },
    (_, i) => i * indicatorWidth
  );

  useEffect(() => {
    const segment = STEP_TO_SEGMENT[step] ?? 0;
    Animated.spring(animatedValue, {
      toValue: segmentPositions[segment],
      useNativeDriver: true,
      stiffness: 200, damping: 20, mass: 1,
    }).start();
  }, [step]);

  // ── Navigation ────────────────────────────────────────────────────────────
  const handleGoBack = () => {
    if (step === 1) navigation.goBack();
    else setStep((prev) => prev - 1);
  };

  // ── Continue / submit handler ─────────────────────────────────────────────
  const handleContinue = async () => {
    if (step === 1 && personalRef.current) {
      if (!personalRef.current.triggerValidation()) return;
    }
    if (step === 2 && docRef.current) {
      if (!docRef.current.triggerValidation()) return;
    }
    if (step === 5 && bankRef.current) {
      if (!bankRef.current.triggerValidation()) return;
    }

    setIsSubmitting(true);
    try {
      switch (step) {

        // ── Step 1: Personal Info ──────────────────────────────────────────
        case 1: {
          const { birth_date, ...rest } = personalInfo;
          const payload = {
            ...rest,
            birth_date: `${birth_date.year}-${String(birth_date.month).padStart(2, "0")}-${String(birth_date.day).padStart(2, "0")}`,
          };
          console.log("📦 Step 1 payload:", JSON.stringify(payload, null, 2));
          const res = await submitPersonalInfo(payload);
          setAuthToken(res.access);
          setRefreshToken(res.refresh);
          // Persist so the app can resume this application if the user
          // backgrounds/kills the app before finishing the remaining steps.
          await AsyncStorage.setItem(ONBOARDING_TOKEN_KEY, res.access);
          await AsyncStorage.setItem(ONBOARDING_REFRESH_KEY, res.refresh);
          break;
        }

        // ── Step 2: Identification & Documentation ─────────────────────────
        case 2: {
          console.log("📦 Step 2 payload:", JSON.stringify(docInfo, null, 2));
          await submitDocInfo(docInfo, authToken);
          break;
        }

        // ── Step 3: Work Availability ──────────────────────────────────────
        // No API call yet — just advance to step 4 (Safety & Reliability).
        case 3: {
          console.log("📦 Step 3 — work availability collected (not yet submitted):");
          console.log(JSON.stringify(workAvailability, null, 2));
          break;
        }

        // ── Step 4: Safety & Reliability ──────────────────────────────────
        // Safety form validates itself before calling handleContinue.
        // Submit work + safety together to phase/3/.
        case 4: {
          console.log("📦 Step 4 — submitting work + safety together:");
          console.log("  Work:", JSON.stringify(workAvailability, null, 2));
          console.log("  Safety:", JSON.stringify(safetyReliability, null, 2));
          await submitWorkAndSafety(workAvailability, safetyReliability, authToken);
          break;
        }

        // ── Step 5: Bank Details ───────────────────────────────────────────
        // No API call yet — just advance to step 6 (Verify Identity).
        case 5: {
          console.log("📦 Step 5 — bank details collected (not yet submitted):");
          console.log(JSON.stringify(bankDetails, null, 2));
          break;
        }

        // ── Step 6: Verify Identity ────────────────────────────────────────
        // Submit bank details + selfie together to phase/4/.
        // On success, reset the stack and navigate to HomeScreen.
        case 6: {
          console.log("📦 Step 6 — submitting bank details + selfie together:");
          console.log("  Bank:", JSON.stringify(bankDetails, null, 2));
          console.log("  Selfie URI:", faceImage);
          await submitBankAndSelfie(bankDetails, faceImage, authToken);

          // Onboarding is complete — promote the onboarding token into the
          // app's real session keys ("accessToken"/"refreshToken"). These are
          // what AppDataContext and AccountScreen's sign-out actually read;
          // without this the user lands on HomeScreen holding no recognized
          // session, so the app never fetches their data and they appear
          // signed out even though signup just succeeded.
          await AsyncStorage.setItem("accessToken", authToken);
          await AsyncStorage.setItem("refreshToken", refreshToken);

          // The onboarding-specific resume token is no longer needed now
          // that the real session is established.
          await AsyncStorage.multiRemove([ONBOARDING_TOKEN_KEY, ONBOARDING_REFRESH_KEY]);

          // Navigate immediately — do NOT put navigation.reset inside an Alert
          // callback. The component may unmount before the user taps OK, which
          // causes "Cannot read property isready of undefined".
          refresh();
          navigation.reset({ index: 0, routes: [{ name: "HomeScreen" }] });
          return; // done — don't advance step
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

  // ── Render active step ────────────────────────────────────────────────────
  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <PersonalStep
            ref={personalRef}
            personalInfo={personalInfo}
            setPersonalInfo={setPersonalInfo}
          />
        );
      case 2:
        return (
          <DocumentStep
            ref={docRef}
            docInfo={docInfo}
            setDocInfo={setDocInfo}
          />
        );
      case 3:
        return (
          <WorkStep
            workAvailability={workAvailability}
            setWorkAvailability={setWorkAvailability}
          />
        );
      case 4:
        // SafetyAndReliability owns its Continue button — passes isSubmitting
        // so it can show the spinner while the API call is in flight.
        return (
          <SafetyAndReliability
            data={safetyReliability}
            setData={setSafetyReliability}
            onBack={handleGoBack}
            onContinue={handleContinue}
            isSubmitting={isSubmitting}
          />
        );
      case 5:
        return (
          <BankDetails
            ref={bankRef}
            data={bankDetails}
            setData={setBankDetails}
          />
        );
      case 6:
        // VerifyIdentity owns its Continue button — passes isSubmitting
        // so it can show the spinner while the API call is in flight.
        return (
          <VerifyIdentity
            image={faceImage}
            setImage={setFaceImage}
            onContinue={handleContinue}
            onBack={handleGoBack}
            isSubmitting={isSubmitting}
          />
        );
      default:
        return null;
    }
  };

  // Steps 4 and 6 manage their own Continue buttons internally
  const showOuterContinue = step !== 4 && step !== 6;

  // While we're checking for a resumable application, show a blocking
  // spinner instead of the wizard so the user never sees step 1 flash
  // before we jump them to their actual saved step.
  if (checkingStatus) {
    return (
      <View style={[styles.container, styles.centered, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.accentOrange} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Progress bar */}
      <View style={styles.progressHeader}>
        <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
          <IconSymbol name="ArrowLeft" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <View style={[styles.progressContainer, { backgroundColor: colors.inputBg }]}>
          <Animated.View
            style={[
              styles.progressIndicator,
              { width: indicatorWidth, backgroundColor: colors.accentOrange, transform: [{ translateX: animatedValue }] },
            ]}
          />
        </View>
      </View>

      {renderStep()}

      {/* Outer Continue — hidden on steps that own their own button */}
      {showOuterContinue && (
        <TouchableOpacity
          style={[
            styles.continueButton,
            { backgroundColor: colors.accentOrange },
            isSubmitting && { opacity: 0.6 },
          ]}
          onPress={handleContinue}
          disabled={isSubmitting}
        >
          {isSubmitting
            ? <ActivityIndicator color="#fff" />
            : <Text style={styles.continueText}>Continue</Text>
          }
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 50 },
  centered: { justifyContent: "center", alignItems: "center" },
  progressHeader: {
    flexDirection: "row", alignItems: "center",
    marginHorizontal: 20, marginBottom: 10,
  },
  backButton: { marginRight: 35 },
  progressContainer: {
    flex: 1, height: 15,
    borderRadius: 20, overflow: "hidden",
  },
  progressIndicator: {
    height: "100%",
    borderRadius: 20, position: "absolute", left: 0,
  },
  continueButton: {
    margin: 20, padding: 15, borderRadius: 50,
  },
  continueText: {
    color: "#fff", textAlign: "center", fontSize: 18, fontWeight: "bold",
  },
});