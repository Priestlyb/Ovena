import * as Location from "expo-location";
import { useRouter } from "expo-router";
import { ArrowLeft, Edit, MapPin, Trash2 } from "lucide-react-native";
import React, { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { usePhase2 } from "@/app/context/Phase2Context";
import { CustomInput } from "@/components/CustomInput";
import FeedbackModal from "@/components/FeedbackModal";
import { styles } from "@/constants/styles";
import { useCompletionStore } from "@/stores/completionStore";

interface Branch {
  name: string;
  address: string;
  latitude?: number | null;
  longitude?: number | null;
  delivery_method?: string | null;
  pre_order_open_period?: string | null;
  final_order_time?: string | null;
  operating_hours?: any[];
}

export default function ProfilePage() {
  const router = useRouter();
  const markGroupComplete = useCompletionStore(
    (state) => state.markGroupComplete,
  );

  const { phase2Data, updatePhase2 } = usePhase2();

  const [shopBranch, setShopBranch] = useState("");
  const [branchAddress, setBranchAddress] = useState("");
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const [isSaving, setIsSaving] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);
  const [modalConfig, setModalConfig] = useState({
    message: "",
    variant: "info" as "success" | "error" | "warning" | "info",
  });

  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);

  /* =========================================================
     GET LOCATION
  ========================================================== */
  const getLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        return { latitude: null, longitude: null };
      }

      const loc = await Location.getCurrentPositionAsync({});

      return {
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      };
    } catch (error: any) {
      return { latitude: null, longitude: null };
    }
  };

  /* =========================================================
     SAVE BRANCH (UPDATED VALIDATION)
  ========================================================== */
  const handleSaveBranch = async () => {
    if (isSaving) return;

    setIsSaving(true);

    try {
      const errors: string[] = [];

      if (!shopBranch.trim()) {
        errors.push("Branch name is required");
      }

      if (!branchAddress.trim()) {
        errors.push("Branch address is required");
      }

      if (errors.length > 0) {
        setModalConfig({
          message: errors.map((e) => `• ${e}`).join("\n"),
          variant: "error",
        });
        setModalVisible(true);
        return;
      }

      const { latitude, longitude } = await getLocation();

      /* 🚫 HARD BLOCK: NO LOCATION */
      if (
        latitude === null ||
        longitude === null ||
        isNaN(latitude) ||
        isNaN(longitude)
      ) {
        setModalConfig({
          message:
            "Location is required to add a branch.\n\nPlease enable GPS/location services and try again.",
          variant: "error",
        });
        setModalVisible(true);
        return;
      }

      const updatedBranches = [...(phase2Data.branches || [])];

      const existingBranch =
        editingIndex !== null ? updatedBranches[editingIndex] : {};

      const branchData: Branch = {
        ...existingBranch,
        name: shopBranch.trim(),
        address: branchAddress.trim(),
        latitude,
        longitude,
      };

      /* 🚫 FINAL SAFETY CHECK (NO INVALID BRANCH SAVED) */
      if (branchData.latitude === null || branchData.longitude === null) {
        setModalConfig({
          message: "This branch is missing location data and cannot be saved.",
          variant: "error",
        });
        setModalVisible(true);
        return;
      }

      if (editingIndex !== null) {
        updatedBranches[editingIndex] = branchData;
        setEditingIndex(null);
      } else {
        updatedBranches.push(branchData);
      }

      updatePhase2({ branches: updatedBranches });

      setShopBranch("");
      setBranchAddress("");

      setModalConfig({
        message:
          editingIndex !== null
            ? "Branch updated successfully"
            : "Branch added successfully",
        variant: "success",
      });
      setModalVisible(true);
    } finally {
      setIsSaving(false);
    }
  };

  /* =========================================================
      EDIT
  ========================================================== */
  const handleEditBranch = (index: number) => {
    const branch = phase2Data.branches[index];

    setShopBranch(branch.name);
    setBranchAddress(branch.address);
    setEditingIndex(index);
  };

  /* =========================================================
      DELETE 
  ========================================================== */
  const handleDeleteBranch = (index: number) => {
    setDeleteIndex(index);
    setModalConfig({
      message: "Are you sure you want to delete this branch?",
      variant: "warning",
    });
    setModalVisible(true);
  };

  const confirmDelete = () => {
    if (deleteIndex === null) return;

    const updated = [...phase2Data.branches];
    updated.splice(deleteIndex, 1);
    updatePhase2({ branches: updated });

    setDeleteIndex(null);

    setModalConfig({
      message: "Branch deleted successfully",
      variant: "success",
    });
    setModalVisible(true);
  };

  /* =========================================================
      CONTINUE
  ========================================================== */
  const handleContinue = () => {
    if ((phase2Data.branches || []).length === 0) {
      setModalConfig({
        message: "• Add at least one branch to continue",
        variant: "error",
      });
      setModalVisible(true);
      return;
    }

    markGroupComplete("completeProfile");
    router.push("/superForm2/checklist");
  };

  const isDisabled = isSaving || !shopBranch.trim() || !branchAddress.trim();

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView style={styles.container}>
          {/* HEADER */}
          <View style={styles.profileHeader}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <ArrowLeft size={24} color="#111827" />
            </TouchableOpacity>
            <Text style={styles.profileHeaderTitle}>Manage Branches</Text>
          </View>

          {/* FORM */}
          <Text style={styles.sectionTitle}>Add / Edit Branch</Text>
          <View style={styles.dividerLine} />

          <CustomInput
            label="Branch name"
            placeholder="e.g Lekki Branch"
            value={shopBranch}
            onChange={setShopBranch}
          />

          <CustomInput
            label="Branch address"
            placeholder="5 Admiralty Way, Lekki Phase 1"
            value={branchAddress}
            onChange={setBranchAddress}
          />

          {/* ADD / UPDATE */}
          <TouchableOpacity
            style={[styles.continueBtn, isDisabled && { opacity: 0.5 }]}
            onPress={handleSaveBranch}
            disabled={isDisabled}
          >
            {isSaving ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.continueBtnText}>
                {editingIndex !== null ? "Update Branch" : "Add Branch"}
              </Text>
            )}
          </TouchableOpacity>

          {/* LIST */}
          {phase2Data.branches?.length > 0 && (
            <>
              <Text style={[styles.sectionTitle, { marginTop: 24 }]}>
                Added Branches
              </Text>

              {phase2Data.branches.map((b: Branch, i: number) => {
                const hasLocation = b.latitude !== null && b.longitude !== null;

                return (
                  <View key={i} style={styles.branchItem}>
                    <View style={{ flex: 1 }}>
                      <View
                        style={{ flexDirection: "row", alignItems: "center" }}
                      >
                        <Text style={styles.branchName}>{b.name}</Text>

                        {hasLocation && (
                          <MapPin
                            size={16}
                            color="#16a34a"
                            style={{ marginLeft: 6 }}
                          />
                        )}
                      </View>

                      <Text style={styles.branchAddress}>{b.address}</Text>
                    </View>

                    <View style={styles.branchActions}>
                      <TouchableOpacity onPress={() => handleEditBranch(i)}>
                        <Edit size={20} color="#111827" />
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => handleDeleteBranch(i)}>
                        <Trash2 size={20} color="red" />
                      </TouchableOpacity>
                    </View>
                  </View>
                );
              })}
            </>
          )}

          {/* CONTINUE */}
          <TouchableOpacity
            style={[styles.continueBtn, { marginTop: 24 }]}
            onPress={handleContinue}
          >
            <Text style={styles.continueBtnText}>Continue</Text>
          </TouchableOpacity>

          <View style={{ height: 40 }} />
        </ScrollView>
      </KeyboardAvoidingView>

      {/* MODAL */}
      <FeedbackModal
        visible={modalVisible}
        message={modalConfig.message}
        variant={modalConfig.variant}
        onClose={() => {
          setModalVisible(false);
          if (deleteIndex !== null && modalConfig.variant === "warning") {
            confirmDelete();
          }
        }}
      />
    </SafeAreaView>
  );
}
