import { useRouter } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { usePhase2 } from "@/app/context/Phase2Context";
import { Spacer } from "@/components/atoms/Spacer";
import { CustomDropdown } from "@/components/CustomDropDown";
import { CustomInput } from "@/components/CustomInput";
import FeedbackModal from "@/components/FeedbackModal";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { styles } from "@/constants/styles";
import { useCompletionStore } from "@/stores/completionStore";
import * as DocumentPicker from "expo-document-picker";

export default function BusinessDocumentsPage() {
  const router = useRouter();
  const { phase2Data, updatePhase2 } = usePhase2();
  const markGroupComplete = useCompletionStore(
    (state) => state.markGroupComplete,
  );

  const [documentImage, setDocumentImage] = useState<string | null>(null);
  const [businessType, setBusinessType] = useState("");
  const [registeredName, setRegisteredName] = useState("");
  const [taxId, setTaxId] = useState("");
  const [rcNumber, setRcNumber] = useState("");

  const [modalVisible, setModalVisible] = useState(false);
  const [modalConfig, setModalConfig] = useState({
    message: "",
    variant: "info" as "success" | "error" | "warning" | "info",
  });

  const businessTypes = [
    "Limited Liability Company",
    "Sole Proprietorship",
    "Partnership",
    "Corporation",
  ];

  /* ================= INIT ================= */
  useEffect(() => {
    const docs = phase2Data.business_documents;

    setBusinessType(docs.business_type ?? "");
    setRegisteredName(docs.registered_business_name ?? "");
    setTaxId(docs.tax_identification_number ?? "");
    setRcNumber(docs.rc_number ?? "");
    setDocumentImage(docs.document_image || null);
  }, [phase2Data.business_documents]);

  /* ================= HELPERS ================= */
  const clean = (val: string) => String(val || "").trim();

  const normalizeBusinessType = (type: string) => clean(type);

  const formatTIN = (value: string) => {
    const cleaned = value.replace(/\s/g, "");
    if (!cleaned.startsWith("TIN-")) {
      return "TIN-" + cleaned.replace(/^TIN-*/, "");
    }
    return cleaned;
  };

  const formatRC = (value: string) => {
    const cleaned = value.replace(/\s/g, "");
    if (!cleaned.startsWith("RC-")) {
      return "RC-" + cleaned.replace(/^RC-*/, "");
    }
    return cleaned;
  };

  /* ================= DOCUMENT PICKER ================= */
  const pickDocumentImage = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: ["application/pdf", "image/jpeg", "image/png"],
      copyToCacheDirectory: true,
      multiple: false,
    });

    if (result.canceled) return;

    setDocumentImage(result.assets[0].uri);
  };

  /* ================= VALIDATION ================= */
  const validate = () => {
    const errors: string[] = [];

    const cleaned = {
      businessType: clean(businessType),
      registeredName: clean(registeredName),
      taxId: clean(taxId),
      rcNumber: clean(rcNumber),
    };

    if (!cleaned.businessType) {
      errors.push("Select business type");
    }

    if (!cleaned.registeredName) {
      errors.push("Enter registered business name");
    }

    if (!cleaned.taxId) {
      errors.push("Enter tax identification number");
    } else {
      if (!cleaned.taxId.startsWith("TIN-")) {
        errors.push("TIN must start with 'TIN-' (e.g TIN-00123456)");
      }
      if (cleaned.taxId.length <= 4) {
        errors.push("Enter a valid TIN number");
      }
    }

    if (!cleaned.rcNumber) {
      errors.push("Enter RC number");
    } else {
      if (!cleaned.rcNumber.startsWith("RC-")) {
        errors.push("RC Number must start with 'RC-' (e.g RC-987654)");
      }
      if (cleaned.rcNumber.length <= 3) {
        errors.push("Enter a valid RC number");
      }
    }

    if (!documentImage) {
      errors.push("Upload your business document");
    }

    if (errors.length > 0) {
      setModalConfig({
        message: errors.map((e) => `• ${e}`).join("\n"),
        variant: "error",
      });
      setModalVisible(true);
      return false;
    }

    return true;
  };

  /* ================= SAVE ================= */
  const saveData = () => {
    if (!validate()) return false;

    const payload = {
      business_type: normalizeBusinessType(businessType),
      registered_business_name: clean(registeredName),
      tax_identification_number: clean(taxId),
      rc_number: clean(rcNumber),
      document_image: documentImage ?? "",
    };

    console.log("SAVING BUSINESS DOCS:", payload);

    updatePhase2({
      business_documents: payload,
    });

    return true;
  };

  /* ================= CONTINUE ================= */
  const handleContinue = () => {
    if (!saveData()) return;

    markGroupComplete("verifyBusiness");
    router.push("/superForm2/checklist");
  };

  /* ================= UI ================= */
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
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ArrowLeft size={24} color="#111827" />
          </TouchableOpacity>

          <Text style={styles.pageTitle}>Verify your business</Text>
          <Text style={styles.subtitle}>
            Enter your official business information
          </Text>

          <Spacer size="xxl" />

          <Text
            style={{
              fontSize: 15,
              fontWeight: "600",
              marginTop: 20,
              marginBottom: 10,
              color: "#111827",
            }}
          >
            Business Document <Text style={{ color: "red" }}>*</Text>
          </Text>

          <TouchableOpacity
            onPress={pickDocumentImage}
            style={{
              borderWidth: 1,
              borderStyle: "dashed",
              borderColor: "#D1D5DB",
              borderRadius: 12,
              height: 180,
              overflow: "hidden",
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "#F9FAFB",
            }}
          >
            {documentImage ? (
              documentImage.toLowerCase().endsWith(".pdf") ? (
                <View
                  style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                    paddingHorizontal: 20,
                  }}
                >
                  <View>
                    <IconSymbol name="FileIcon" size={25} color="#333" />
                  </View>

                  <Text
                    style={{
                      marginTop: 12,
                      fontSize: 16,
                      fontWeight: "600",
                      color: "#111827",
                      textAlign: "center",
                    }}
                  >
                    PDF Selected
                  </Text>

                  <Text
                    style={{
                      marginTop: 6,
                      color: "#6B7280",
                      textAlign: "center",
                    }}
                    numberOfLines={2}
                  >
                    {documentImage.split("/").pop()}
                  </Text>
                </View>
              ) : (
                <Image
                  source={{ uri: documentImage }}
                  style={{
                    width: "100%",
                    height: "100%",
                  }}
                  resizeMode="cover"
                />
              )
            ) : (
              <>
                <Text
                  style={{
                    fontWeight: "600",
                    fontSize: 16,
                    color: "#374151",
                  }}
                >
                  Upload Business Document
                </Text>

                <Text
                  style={{
                    marginTop: 6,
                    color: "#6B7280",
                    fontSize: 13,
                  }}
                >
                  Tap to choose a PDF or image
                </Text>
              </>
            )}
          </TouchableOpacity>

          <Spacer size="xl" />

          <CustomDropdown
            label="Business Type"
            options={businessTypes}
            placeholder="Select business type"
            value={businessType}
            onChange={setBusinessType}
            required
          />

          <CustomInput
            label="Registered Business Name"
            placeholder="e.g Chidi's Kitchen Ltd"
            value={registeredName}
            onChange={setRegisteredName}
            required
          />

          <CustomInput
            label="Tax Identification Number"
            placeholder="e.g TIN-00123456"
            value={taxId}
            onChange={(val) => setTaxId(formatTIN(val))}
            required
          />

          <CustomInput
            label="RC Number"
            placeholder="e.g RC-987654"
            value={rcNumber}
            onChange={(val) => setRcNumber(formatRC(val))}
            required
          />

          <TouchableOpacity
            style={[styles.continueBtn, { marginTop: 30 }]}
            onPress={handleContinue}
          >
            <Text style={styles.continueBtnText}>Continue</Text>
          </TouchableOpacity>

          <View style={{ height: 50 }} />
        </ScrollView>
      </KeyboardAvoidingView>

      {/* MODAL */}
      <FeedbackModal
        visible={modalVisible}
        message={modalConfig.message}
        variant={modalConfig.variant}
        onClose={() => setModalVisible(false)}
      />
    </SafeAreaView>
  );
}
