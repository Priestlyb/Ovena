import React, { useState } from "react";
import {
  View, Text, StyleSheet, TextInput, ScrollView,
  KeyboardAvoidingView, TouchableWithoutFeedback,
  Keyboard, Platform, Image, Alert, ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system/legacy";
import { IconSymbol } from "../../components/ui/icon-symbol";
import FormInput from "../FormInput";

// ── State shape ───────────────────────────────────────────────────────────────

export interface SafetyReliabilityState {
  trafficRules: string;   // "yes" | "no"
  helmet: string;         // "yes" | "no"
  punctuality: string;    // "excellent" | "good" | "fair" | "poor"
  healthIssue: string;    // "yes" | "no"
  healthDetails: string;  // free text — only when healthIssue === "yes"
  reason: string;         // free text
  availability: string;   // free text
  bagImage: string;       // local file:// URI
}

export const DEFAULT_SAFETY_STATE: SafetyReliabilityState = {
  trafficRules: "",
  helmet: "",
  punctuality: "",
  healthIssue: "",
  healthDetails: "",
  reason: "",
  availability: "",
  bagImage: "",
};

// ── Validation ────────────────────────────────────────────────────────────────

type ErrorMap = Partial<Record<keyof SafetyReliabilityState, string>>;

export function validateSafety(d: SafetyReliabilityState): ErrorMap {
  const errors: ErrorMap = {};
  if (!d.trafficRules)   errors.trafficRules  = "Please answer this question.";
  if (!d.helmet)         errors.helmet        = "Please answer this question.";
  if (!d.punctuality)    errors.punctuality   = "Please rate your punctuality.";
  if (!d.healthIssue)    errors.healthIssue   = "Please answer this question.";
  if (d.healthIssue === "yes" && !d.healthDetails.trim())
    errors.healthDetails = "Please describe your health condition.";
  if (!d.reason.trim())  errors.reason        = "Please tell us why you want to work with us.";
  if (!d.availability.trim()) errors.availability = "Please tell us when you can start.";
  if (!d.bagImage)       errors.bagImage      = "Please upload an image of your delivery bag.";
  return errors;
}

export function isSafetyValid(errors: ErrorMap): boolean {
  return Object.keys(errors).length === 0;
}

// ── Props ─────────────────────────────────────────────────────────────────────

interface SafetyAndReliabilityProps {
  data: SafetyReliabilityState;
  setData: React.Dispatch<React.SetStateAction<SafetyReliabilityState>>;
  onBack: () => void;
  onContinue: () => void;
  isSubmitting?: boolean; // passed from SignupScreen to drive the spinner
}

// ── Component ─────────────────────────────────────────────────────────────────

const SafetyAndReliability: React.FC<SafetyAndReliabilityProps> = ({
  data, setData, onBack, onContinue, isSubmitting = false,
}) => {
  const [errors, setErrors] = useState<ErrorMap>({});
  const [bagLoading, setBagLoading] = useState(false);

  // ── Helpers ───────────────────────────────────────────────────────────────
  const set = (patch: Partial<SafetyReliabilityState>) =>
    setData((prev) => ({ ...prev, ...patch }));

  const clearError = (field: keyof SafetyReliabilityState) =>
    setErrors((prev) => { const e = { ...prev }; delete e[field]; return e; });

  // ── Bag image picker ──────────────────────────────────────────────────────
  const pickBagImage = async () => {
    setBagLoading(true);
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ["image/jpeg", "image/png", "image/jpg"],
        copyToCacheDirectory: true,
        multiple: false,
      });
      if (result.canceled) return;

      const uri = result.assets[0].uri;
      const info = await FileSystem.getInfoAsync(uri);
      console.log("🎒 Bag image file info:", info);

      if (!info.exists || info.size === 0) {
        Alert.alert("File Error", "The selected file could not be read. Please try another photo.");
        return;
      }

      set({ bagImage: uri });
      clearError("bagImage");
      console.log("🎒 Bag image ready:", uri, "size:", info.size);
    } catch (err) {
      Alert.alert("Error", "Could not open the file picker. Please try again.");
      console.error("Bag image picker error:", err);
    } finally {
      setBagLoading(false);
    }
  };

  // ── Validate then hand off to parent ─────────────────────────────────────
  const handleContinue = () => {
    const errs = validateSafety(data);
    setErrors(errs);
    if (!isSafetyValid(errs)) return;
    onContinue();
  };

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <KeyboardAvoidingView
      style={{ flex: 1, paddingHorizontal: 20 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.title}>Safety & Reliability</Text>

          {/* ── Traffic rules ─────────────────────────────────────────────── */}
          <FormInput
            variant="buttons"
            label="Are you willing to follow traffic rules strictly?"
            options={[
              { value: "yes", label: "Yes" },
              { value: "no",  label: "No"  },
            ]}
            selected={data.trafficRules ? [data.trafficRules] : []}
            onSelect={(vals) => {
              set({ trafficRules: vals[0] ?? "" });
              clearError("trafficRules");
            }}
            multiple={false}
            buttonsPerRow={2}
            error={errors.trafficRules}
          />

          {/* ── Helmet & gear ─────────────────────────────────────────────── */}
          <FormInput
            variant="buttons"
            label="Are you willing to wear a helmet and safety gear?"
            options={[
              { value: "yes", label: "Yes" },
              { value: "no",  label: "No"  },
            ]}
            selected={data.helmet ? [data.helmet] : []}
            onSelect={(vals) => {
              set({ helmet: vals[0] ?? "" });
              clearError("helmet");
            }}
            multiple={false}
            buttonsPerRow={2}
            error={errors.helmet}
          />

          {/* ── Punctuality ───────────────────────────────────────────────── */}
          <FormInput
            variant="buttons"
            label="How would you rate your punctuality?"
            options={[
              { value: "excellent", label: "Excellent" },
              { value: "good",      label: "Good"      },
              { value: "fair",      label: "Fair"      },
              { value: "poor",      label: "Poor"      },
            ]}
            selected={data.punctuality ? [data.punctuality] : []}
            onSelect={(vals) => {
              set({ punctuality: vals[0] ?? "" });
              clearError("punctuality");
            }}
            multiple={false}
            buttonsPerRow={2}
            error={errors.punctuality}
          />

          {/* ── Health condition ──────────────────────────────────────────── */}
          <FormInput
            variant="buttons"
            label="Do you have any health conditions that could affect your work?"
            options={[
              { value: "yes", label: "Yes" },
              { value: "no",  label: "No"  },
            ]}
            selected={data.healthIssue ? [data.healthIssue] : []}
            onSelect={(vals) => {
              set({
                healthIssue: vals[0] ?? "",
                healthDetails: vals[0] === "no" ? "" : data.healthDetails,
              });
              clearError("healthIssue");
            }}
            multiple={false}
            buttonsPerRow={2}
            error={errors.healthIssue}
          />

          {/* Health details — only shown when "yes" ──────────────────────── */}
          {data.healthIssue === "yes" && (
            <View style={styles.textAreaWrapper}>
              <Text style={styles.textAreaLabel}>Please describe your condition</Text>
              <TextInput
                style={[styles.textArea, errors.healthDetails ? styles.textAreaError : null]}
                placeholder="e.g. Mild asthma, managed with inhaler…"
                placeholderTextColor="#999"
                value={data.healthDetails}
                onChangeText={(t) => { set({ healthDetails: t }); clearError("healthDetails"); }}
                multiline
              />
              {errors.healthDetails
                ? <Text style={styles.errorText}>{errors.healthDetails}</Text>
                : null}
            </View>
          )}

          {/* ── Why work with us ──────────────────────────────────────────── */}
          <View style={styles.textAreaWrapper}>
            <Text style={styles.textAreaLabel}>
              Why do you want to work as a delivery rider with us?
            </Text>
            <TextInput
              style={[styles.textArea, errors.reason ? styles.textAreaError : null]}
              placeholder="e.g. Flexible work and good pay…"
              placeholderTextColor="#999"
              value={data.reason}
              onChangeText={(t) => { set({ reason: t }); clearError("reason"); }}
              multiline
            />
            {errors.reason
              ? <Text style={styles.errorText}>{errors.reason}</Text>
              : null}
          </View>

          {/* ── How soon can you start ────────────────────────────────────── */}
          <View style={styles.textAreaWrapper}>
            <Text style={styles.textAreaLabel}>How soon can you start if selected?</Text>
            <TextInput
              style={[styles.textArea, errors.availability ? styles.textAreaError : null]}
              placeholder="e.g. Immediately, In 2 weeks…"
              placeholderTextColor="#999"
              value={data.availability}
              onChangeText={(t) => { set({ availability: t }); clearError("availability"); }}
              multiline
            />
            {errors.availability
              ? <Text style={styles.errorText}>{errors.availability}</Text>
              : null}
          </View>

          {/* ── Delivery bag image ────────────────────────────────────────── */}
          <Text style={styles.textAreaLabel}>Upload an image of your Delivery Bag</Text>
          <TouchableOpacity
            style={[styles.uploadBox, errors.bagImage ? styles.uploadBoxError : null]}
            onPress={pickBagImage}
            activeOpacity={0.75}
            disabled={bagLoading || isSubmitting}
          >
            {bagLoading ? (
              <ActivityIndicator size="large" color="#D44C0C" />
            ) : data.bagImage ? (
              <>
                <Image
                  source={{ uri: data.bagImage }}
                  style={styles.previewImage}
                  resizeMode="cover"
                />
                <View style={styles.changeOverlay}>
                  <IconSymbol name="IdCard" size={18} color="#fff" />
                  <Text style={styles.changeText}>Tap to change</Text>
                </View>
              </>
            ) : (
              <>
                <IconSymbol
                  name="IdCard"
                  size={28}
                  color={errors.bagImage ? "#e53935" : "#888"}
                />
                <Text style={[
                  styles.uploadPrompt,
                  errors.bagImage ? { color: "#e53935" } : null,
                ]}>
                  Choose Picture
                </Text>
                <Text style={styles.uploadSubtext}>JPG, PNG supported</Text>
              </>
            )}
          </TouchableOpacity>
          {errors.bagImage
            ? <Text style={styles.errorText}>{errors.bagImage}</Text>
            : null}

          {/* ── Continue ─────────────────────────────────────────────────── */}
          <TouchableOpacity
            style={[styles.continueBtn, isSubmitting && { opacity: 0.6 }]}
            onPress={handleContinue}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text style={styles.continueText}>Continue</Text>
            )}
          </TouchableOpacity>

        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default SafetyAndReliability;

// ── Styles ────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  title: {
    fontSize: 22, fontWeight: "700", textAlign: "center",
    marginBottom: 10, marginTop: 6,
  },

  // Text areas
  textAreaWrapper: { marginVertical: 10 },
  textAreaLabel: { fontWeight: "600", fontSize: 15, color: "#333", marginBottom: 6 },
  textArea: {
    borderWidth: 1, borderColor: "#ccc", borderRadius: 12,
    padding: 12, minHeight: 80, fontSize: 14, color: "#111",
    backgroundColor: "#fff", textAlignVertical: "top",
    shadowColor: "#000", shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06, shadowRadius: 3, elevation: 2,
  },
  textAreaError: { borderColor: "#e53935", borderWidth: 1.5 },

  // Bag image upload
  uploadBox: {
    height: 160, borderWidth: 1, borderColor: "#ccc", borderRadius: 15,
    justifyContent: "center", alignItems: "center", marginTop: 8,
    backgroundColor: "#F5F5F5", overflow: "hidden",
    shadowColor: "#000", shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08, shadowRadius: 4, elevation: 3,
  },
  uploadBoxError: { borderColor: "#e53935", borderWidth: 1.5 },
  uploadPrompt: { color: "#555", fontSize: 15, marginTop: 8 },
  uploadSubtext: { color: "#aaa", fontSize: 12, marginTop: 4 },
  previewImage: { width: "100%", height: "100%", borderRadius: 15 },
  changeOverlay: {
    position: "absolute", bottom: 0, left: 0, right: 0,
    backgroundColor: "rgba(0,0,0,0.45)", paddingVertical: 8,
    flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 6,
  },
  changeText: { color: "#fff", fontSize: 13, fontWeight: "600" },

  // Error text
  errorText: { color: "#e53935", fontSize: 12, marginTop: 4, marginLeft: 4 },

  // Continue button
  continueBtn: {
    marginTop: 24, marginBottom: 30,
    backgroundColor: "#D44C0C", padding: 15, borderRadius: 50,
    alignItems: "center",
  },
  continueText: {
    textAlign: "center", color: "#fff", fontWeight: "bold", fontSize: 18,
  },
});