import { useRouter } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import React from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";

import { styles } from "@/constants/styles";
import { Ionicons } from "@expo/vector-icons";

import { Spacer } from "@/components/atoms/Spacer";
import { Text } from "@/components/atoms/Text";
import { CustomDropdown } from "@/components/CustomDropDown";
import FeedbackModal from "@/components/FeedbackModal";
import { Header } from "@/components/molecules/Header";

import { useBranches } from "@/hooks/StoreHubPage/useBranches";
import { useBranchHours } from "@/hooks/StoreHubPage/useBranchHours";
import { useStoreHubController } from "@/hooks/StoreHubPage/useStoreHubController";

import { BranchSection } from "@/components/StoreHubPage/BranchSection";
import { InstantSection } from "@/components/StoreHubPage/InstantSection";
import { ScheduledSection } from "@/components/StoreHubPage/ScheduledSection";

import ConfirmModal from "@/components/ConfirmModal";
import { ToggleSwitch } from "@/components/ToggleSwitch";
import { IconSymbol } from "@/components/ui/icon-symbol";
import api from "@/services/apiClient";
import { convertToISO, timeToNumber } from "@/utils/time";

export default function StoreHubPage() {
  const router = useRouter();

  const [isOpen, setIsOpen] = React.useState(false);
  const [loadingOpenState, setLoadingOpenState] = React.useState(false);

  const { branches, loading } = useBranches();
  const { apiHours } = useBranchHours(branches.find((b) => b)?.id);

  const [confirmVisible, setConfirmVisible] = React.useState(false);
  const [deleting, setDeleting] = React.useState(false);

  const {
    selectedBranch,
    setSelectedBranch,
    deliveryMethod,
    setDeliveryMethod,
    hours,
    setHours,
    preOrderTime,
    setPreOrderTime,
    finalOrderTime,
    setFinalOrderTime,
  } = useStoreHubController(branches, apiHours);

  const handleDeletePress = () => {
    if (!selectedBranch?.id) {
      showModal("No branch selected", "warning");
      return;
    }

    setConfirmVisible(true);
  };

  const confirmDelete = async () => {
    if (!selectedBranch?.id) return;

    try {
      setDeleting(true);

      await api.delete(`/business/branch/${selectedBranch.id}/delete/`);

      setConfirmVisible(false);
      showModal("Branch deleted successfully", "success");

      setTimeout(() => router.back(), 1000);
    } catch (e: any) {
      console.log(e);

      showModal(
        e?.response?.data?.message || "Failed to delete branch",
        "error",
      );
    } finally {
      setDeleting(false);
    }
  };

  /* ---------------- FETCH OPEN STATE ---------------- */
  const fetchOpenState = async (branchId: number) => {
    try {
      setLoadingOpenState(true);

      const res = await api.get(`/business/branches/${branchId}/close/`);

      console.log("GET /close response:", res.data);

      const today = new Date().getDay();

      // assuming array response
      const todayData = Array.isArray(res.data)
        ? res.data.find((d: any) => d.day === today)
        : res.data;

      if (todayData) {
        setIsOpen(!todayData.is_closed);
      }
    } catch (e) {
      console.log("Error fetching open state:", e);
    } finally {
      setLoadingOpenState(false);
    }
  };

  /* ---------------- TOGGLE HANDLER ---------------- */
  const handleToggleOpen = async (value: boolean) => {
    if (!selectedBranch) return;

    try {
      setIsOpen(value);

      const today = new Date().getDay();

      await api.patch(`/business/branches/${selectedBranch.id}/close/`, {
        day: today,
        is_closed: !value,
      });

      console.log("PATCH /close success:", {
        day: today,
        is_closed: !value,
      });
    } catch (e) {
      console.log("Error updating open state:", e);

      // rollback
      setIsOpen((prev) => !prev);

      showModal("Failed to update open status", "error");
    }
  };

  /* ---------------- SYNC ON BRANCH CHANGE ---------------- */
  React.useEffect(() => {
    if (selectedBranch?.id) {
      fetchOpenState(selectedBranch.id);
    }
  }, [selectedBranch?.id]);

  /* ---------------- MODAL ---------------- */
  const [modal, setModal] = React.useState({
    visible: false,
    message: "",
    variant: "info" as "success" | "error" | "warning" | "info",
  });

  const showModal = (
    message: string,
    variant: typeof modal.variant = "info",
  ) => {
    setModal({ visible: true, message, variant });
  };

  const closeModal = () => {
    setModal((prev) => ({ ...prev, visible: false }));
  };

  /* ---------------- VALIDATION ---------------- */
  const validateTimes = () => {
    for (const h of hours) {
      if (h.is_closed) continue;

      if (timeToNumber(h.open_time) >= timeToNumber(h.close_time)) {
        showModal("Invalid time range", "warning");
        return false;
      }
    }
    return true;
  };

  /* ---------------- SAVE ---------------- */
  const handleSaveChanges = async () => {
    if (!selectedBranch) return;

    try {
      await api.patch("/business/branch/edit/", {
        id: selectedBranch.id,
        name: selectedBranch.name,
        address: selectedBranch.address,
        latitude: selectedBranch.location?.latitude || 0,
        longitude: selectedBranch.location?.longitude || 0,
        delivery_method: deliveryMethod === "Instant" ? "instant" : "scheduled",
        pre_order_open_period:
          deliveryMethod === "Scheduled" ? convertToISO(preOrderTime) : null,
        final_order_time:
          deliveryMethod === "Scheduled" ? convertToISO(finalOrderTime) : null,
      });

      if (deliveryMethod === "Instant") {
        if (!validateTimes()) return;

        await api.put(`/business/branches/${selectedBranch.id}/hours/`, hours);
      }

      showModal("Branch updated successfully!", "success");

      setTimeout(() => router.back(), 1200);
    } catch (e: any) {
      showModal(
        e?.response?.data?.message || "Failed to update branch",
        "error",
      );
    }
  };

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <ActivityIndicator size="large" color="#F84E10" />
      </View>
    );
  }

  const isInstant = deliveryMethod === "Instant";

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView style={{ flex: 1 }}>
        <ScrollView>
          <View style={{ padding: 20 }}>
            <Header
              title="Store Hub"
              leftIcon={<ArrowLeft size={24} />}
              onLeftIconPress={() => router.back()}
              rightContent={
                <ToggleSwitch value={isOpen} onChange={handleToggleOpen} />
              }
            />

            <Spacer size="lg" />

            <BranchSection
              branches={branches}
              selectedBranch={selectedBranch}
              setSelectedBranch={setSelectedBranch}
            />

            <Spacer size="lg" />

            <CustomDropdown
              placeholder="Select a Delivery Method"
              label="Delivery Method"
              options={["Instant", "Scheduled"]}
              value={deliveryMethod}
              onChange={(v) => setDeliveryMethod(v as "Instant" | "Scheduled")}
            />

            <Spacer size="lg" />

            {deliveryMethod === "Scheduled" && (
              <ScheduledSection
                preOrderTime={preOrderTime}
                finalOrderTime={finalOrderTime}
                setPreOrderTime={setPreOrderTime}
                setFinalOrderTime={setFinalOrderTime}
              />
            )}

            {isInstant && <InstantSection hours={hours} setHours={setHours} />}

            <Spacer size="xl" />

            <TouchableOpacity
              style={styles.continueBtn}
              onPress={handleSaveChanges}
            >
              <Text style={styles.continueBtnText}>Save Changes</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        {/* FLOATING BUTTON */}
        <TouchableOpacity
          style={{
            position: "absolute",
            bottom: 100,
            right: 30,
            backgroundColor: "#000",
            padding: 16,
            borderRadius: 50,
          }}
          onPress={() => router.push("/screens/CreateStoreHub")}
        >
          <Ionicons name="add" size={24} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            position: "absolute",
            bottom: 175,
            right: 30,
            backgroundColor: "#ef0e0e",
            padding: 16,
            borderRadius: 50,
          }}
          onPress={handleDeletePress}
        >
          <IconSymbol name="TrashOutline" size={24} color="#fff" />
        </TouchableOpacity>

        <ConfirmModal
          visible={confirmVisible}
          title="Delete Branch"
          message="Are you sure you want to delete this branch? This action cannot be undone."
          confirmText="Delete"
          cancelText="Cancel"
          loading={deleting}
          variant="danger"
          onCancel={() => setConfirmVisible(false)}
          onConfirm={confirmDelete}
        />

        <FeedbackModal
          visible={modal.visible}
          message={modal.message}
          variant={modal.variant}
          onClose={closeModal}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
