// StoreHubCreatePage.tsx
import { useRouter } from "expo-router";
import { ArrowLeft, MessageCircle } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Linking,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";

import * as Location from "expo-location";

import { styles } from "@/constants/styles";

// Components
import { Spacer } from "@/components/atoms/Spacer";
import { Text } from "@/components/atoms/Text";
import { CustomDropdown } from "@/components/CustomDropDown";
import { CustomInput } from "@/components/CustomInput";
import FeedbackModal from "@/components/FeedbackModal";
import { FloatingChatButton } from "@/components/FloatingChatButton";
import { Header } from "@/components/molecules/Header";

import api from "@/services/apiClient";

/* ================= CONSTANTS ================= */
const DELIVERY_MAP = {
  Instant: "instant",
  Scheduled: "scheduled",
} as const;

/* ================= COMPONENT ================= */
export default function CreateStoreHub() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const [name, setName] = useState("");
  const [address, setAddress] = useState("");

  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);

  const [deliveryMethod, setDeliveryMethod] = useState<"Instant" | "Scheduled">(
    "Scheduled",
  );

  const [preOrderTime, setPreOrderTime] = useState("12:00 AM");
  const [finalOrderTime, setFinalOrderTime] = useState("12:00 PM");

  const [branchHours, setBranchHours] = useState(
    Array.from({ length: 7 }).map((_, i) => ({
      day: i,
      open_time: "09:00:00",
      close_time: "18:00:00",
      is_closed: false,
    })),
  );

  /* ================= FEEDBACK MODAL STATE ================= */
  const [feedback, setFeedback] = useState<{
    visible: boolean;
    message: string;
    title: string;
    variant: "success" | "error" | "warning" | "info";
    actionLabel?: string;
    onAction?: () => void;
  }>({
    visible: false,
    message: "",
    title: "",
    variant: "info",
  });

  const showFeedback = (
    message: string,
    variant: "success" | "error" | "warning" | "info" = "info",
    title?: string,
    actionLabel?: string,
    onAction?: () => void,
  ) => {
    setFeedback({
      visible: true,
      message,
      variant,
      title: title || "",
      actionLabel,
      onAction,
    });
  };

  const openLocationSettings = async () => {
    try {
      await Linking.openSettings();
    } catch (err) {
      console.log("Failed to open settings", err);
    }
  };

  const sleep = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  const getLocationWithRetry = async (retries = 3, delay = 1500) => {
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        const loc = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });

        if (loc?.coords?.latitude && loc?.coords?.longitude) {
          return loc;
        }
      } catch (err) {
        console.log(`Location attempt ${attempt} failed`, err);
      }

      if (attempt < retries) await sleep(delay);
    }

    try {
      const lastKnown = await Location.getLastKnownPositionAsync();
      if (lastKnown) return lastKnown;
    } catch (err) {
      console.log("Last known location failed", err);
    }

    return null;
  };

  /* ================= LOCATION FETCH ================= */
  useEffect(() => {
    (async () => {
      try {
        const enabled = await Location.hasServicesEnabledAsync();

        if (!enabled) {
          showFeedback(
            "Location services are turned off. Please enable them in settings.",
            "warning",
            "Enable Location",
            "Open Settings",
            openLocationSettings,
          );
          return;
        }

        const { status } = await Location.requestForegroundPermissionsAsync();

        if (status !== "granted") {
          showFeedback(
            "Location permission is required to continue.",
            "warning",
            "Permission Denied",
          );
          return;
        }

        const loc = await getLocationWithRetry(3, 1500);

        if (!loc) {
          showFeedback(
            "We couldn't detect your location. Try moving to an open area or enabling high accuracy GPS.",
            "error",
            "Location Error",
          );
          return;
        }

        setLatitude(loc.coords.latitude);
        setLongitude(loc.coords.longitude);
      } catch (err) {
        console.error("Location error:", err);

        showFeedback(
          "Something went wrong while fetching location.",
          "error",
          "Location Error",
        );
      }
    })();
  }, []);

  /* ================= HELPERS ================= */
  const convertToTime = (time: string) => {
    const [t, mod] = time.split(" ");
    let [h, m] = t.split(":").map(Number);

    if (mod === "PM" && h !== 12) h += 12;
    if (mod === "AM" && h === 12) h = 0;

    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:00`;
  };

  const formatTime = (time: string) => {
    let [h, m] = time.split(":").map(Number);
    const ampm = h >= 12 ? "PM" : "AM";
    h = h % 12 || 12;
    return `${h}:${String(m).padStart(2, "0")} ${ampm}`;
  };

  const timeToNumber = (time: string) => {
    const [h, m] = time.split(":").map(Number);
    return h * 60 + m;
  };

  const validateTimes = () => {
    for (const h of branchHours) {
      if (h.is_closed) continue;

      if (timeToNumber(h.open_time) >= timeToNumber(h.close_time)) {
        showFeedback("Opening time must be before closing time", "error");
        return false;
      }
    }
    return true;
  };

  /* ================= CREATE ================= */
  const handleCreateBranch = async () => {
    if (!name || !address) {
      showFeedback("Name and address are required", "error");
      return;
    }

    if (latitude === null || longitude === null) {
      showFeedback(
        "Unable to detect location. Please enable GPS and try again.",
        "error",
        "Location Required",
      );
      return;
    }

    if (deliveryMethod === "Instant" && !validateTimes()) return;

    setLoading(true);

    try {
      const payload = {
        name,
        address,
        latitude,
        longitude,
        delivery_method: DELIVERY_MAP[deliveryMethod],
        pre_order_open_period:
          deliveryMethod === "Scheduled" ? convertToTime(preOrderTime) : null,
        final_order_time:
          deliveryMethod === "Scheduled" ? convertToTime(finalOrderTime) : null,
        operating_hours:
          deliveryMethod === "Instant"
            ? branchHours.map((h) => ({
                day: h.day,
                open_time: h.is_closed ? null : h.open_time,
                close_time: h.is_closed ? null : h.close_time,
                is_closed: h.is_closed,
              }))
            : [],
      };

      console.log("Branch Details", payload);

      await api.post("/business/branch/edit/", payload);

      showFeedback("Branch created successfully!", "success", "Success");

      setTimeout(() => router.back(), 1200);
    } catch (error: any) {
      showFeedback(
        error?.response?.data?.message || "Failed to create branch",
        "error",
        "Error",
      );
    } finally {
      setLoading(false);
    }
  };

  /* ================= UI ================= */
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView>
        <View style={{ padding: 20 }}>
          <Header
            title="Create Branch"
            leftIcon={<ArrowLeft size={24} />}
            onLeftIconPress={() => router.back()}
          />

          <Spacer size="lg" />

          <CustomInput
            label="Branch Name"
            placeholder="Enter branch name"
            value={name}
            onChange={setName}
            required
          />

          <Spacer size="sm" />

          <CustomInput
            label="Branch Address"
            placeholder="Enter address"
            value={address}
            onChange={setAddress}
            required
          />

          <Spacer size="lg" />

          <CustomDropdown
            label="Delivery Method"
            placeholder="Select delivery method"
            options={["Instant", "Scheduled"]}
            value={deliveryMethod}
            onChange={(v) => setDeliveryMethod(v as "Instant" | "Scheduled")}
          />

          <Spacer size="lg" />

          {deliveryMethod === "Scheduled" && (
            <>
              <CustomDropdown
                placeholder="Select a Opening Scheduled Period"
                label="Opening Scheduled Period"
                options={TIME_OPTIONS}
                value={preOrderTime}
                onChange={setPreOrderTime}
              />

              <Spacer size="md" />

              <CustomDropdown
                placeholder="Select a Final Order Time"
                label="Final Order Time"
                options={TIME_OPTIONS}
                value={finalOrderTime}
                onChange={setFinalOrderTime}
              />
            </>
          )}

          <Spacer size="xl" />

          <TouchableOpacity
            style={styles.continueBtn}
            onPress={handleCreateBranch}
            disabled={loading}
          >
            <Text style={styles.continueBtnText}>
              {loading ? <ActivityIndicator color="#fff" /> : "Create Branch"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* FEEDBACK MODAL */}
      <FeedbackModal
        visible={feedback.visible}
        title={feedback.title}
        message={feedback.message}
        variant={feedback.variant}
        onClose={() => setFeedback((p) => ({ ...p, visible: false }))}
        actionLabel={feedback.actionLabel}
        onAction={feedback.onAction}
      />

      {/* FLOATING BUTTON */}
      <FloatingChatButton
        icon={<MessageCircle size={28} color="#fff" />}
        onPress={() => router.push("/screens/SupportPage")}
      />
    </SafeAreaView>
  );
}

/* ================= TIME OPTIONS ================= */
const TIME_OPTIONS = [
  "12:00 AM",
  "01:00 AM",
  "02:00 AM",
  "03:00 AM",
  "04:00 AM",
  "05:00 AM",
  "06:00 AM",
  "07:00 AM",
  "08:00 AM",
  "09:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "01:00 PM",
  "02:00 PM",
  "03:00 PM",
  "04:00 PM",
  "05:00 PM",
  "06:00 PM",
  "07:00 PM",
  "08:00 PM",
  "09:00 PM",
  "10:00 PM",
  "11:00 PM",
];
