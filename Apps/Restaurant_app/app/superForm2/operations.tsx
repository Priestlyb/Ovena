import { useRouter } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import React, { useEffect, useMemo, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { usePhase2 } from "@/app/context/Phase2Context";
import { CustomDropdown } from "@/components/CustomDropDown";
import FeedbackModal from "@/components/FeedbackModal";
import { styles } from "@/constants/styles";
import { useCompletionStore } from "@/stores/completionStore";

/* ================= HELPERS ================= */
const formatTime = (time: string) => {
  if (!time) return "";

  const [timePart, modifier] = time.split(" ");
  if (!timePart || !modifier) return time;

  let [hours, minutes] = timePart.split(":").map(Number);

  if (modifier === "PM" && hours !== 12) hours += 12;
  if (modifier === "AM" && hours === 12) hours = 0;

  return `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}:00`;
};

const isSameTime = (t1: string, t2: string) => {
  return formatTime(t1) === formatTime(t2);
};

/* ================= TYPES ================= */
interface DayHours {
  open: string;
  close: string;
  is_closed: boolean;
}

interface Branch {
  name: string;
  address: string;
  latitude?: number | null;
  longitude?: number | null;
  delivery_method?: string | null;
  pre_order_open_period?: string | null;
  final_order_time?: string | null;
  operating_hours?: {
    day: number;
    open_time: string;
    close_time: string;
    is_closed: boolean;
  }[];
}

/* ================= COMPONENT ================= */
export default function OperationsPage() {
  const router = useRouter();
  const markGroupComplete = useCompletionStore(
    (state) => state.markGroupComplete,
  );
  const { phase2Data, updatePhase2 } = usePhase2();

  const branches: Branch[] = useMemo(
    () => (phase2Data.branches || []).map((b) => ({ ...b })),
    [phase2Data.branches],
  );

  const [selectedBranchIndex, setSelectedBranchIndex] = useState(0);
  const [deliveryMethod, setDeliveryMethod] = useState("");
  const [weeklyHours, setWeeklyHours] = useState<Record<number, DayHours>>({});

  const [preOrderTime, setPreOrderTime] = useState("12:00 AM");
  const [finalOrderTime, setFinalOrderTime] = useState("12:00 PM");

  const [modalVisible, setModalVisible] = useState(false);
  const [modalConfig, setModalConfig] = useState({
    message: "",
    variant: "info" as "success" | "error" | "warning" | "info",
  });

  const deliveryMethods = ["instant", "scheduled"];

  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  const timeSlots = Array.from({ length: 24 }, (_, i) => {
    const hour = i % 12 === 0 ? 12 : i % 12;
    const ampm = i < 12 ? "AM" : "PM";
    return `${hour.toString().padStart(2, "0")}:00 ${ampm}`;
  });

  useEffect(() => {
    const currentBranch = branches[selectedBranchIndex];
    if (!currentBranch) return;

    setDeliveryMethod(currentBranch.delivery_method || "");

    if (currentBranch.pre_order_open_period) {
      setPreOrderTime(currentBranch.pre_order_open_period);
    }

    if (currentBranch.final_order_time) {
      setFinalOrderTime(currentBranch.final_order_time);
    }

    const hours: Record<number, DayHours> = {};
    currentBranch.operating_hours?.forEach((h) => {
      hours[h.day] = {
        open: h.open_time,
        close: h.close_time,
        is_closed: h.is_closed,
      };
    });

    setWeeklyHours(hours);
  }, [selectedBranchIndex, branches]);

  /* =========================================================
     VALIDATION
  ========================================================== */
  const validate = () => {
    const errors: string[] = [];

    if (!branches.length) {
      errors.push("Please add a branch first");
    }

    if (!deliveryMethod) {
      errors.push("Select a delivery method");
    }

    /* ================= SCHEDULED ================= */
    if (deliveryMethod === "scheduled") {
      if (!preOrderTime) {
        errors.push("Select opening pre-order time");
      }

      if (!finalOrderTime) {
        errors.push("Select final order time");
      }

      if (
        preOrderTime &&
        finalOrderTime &&
        isSameTime(preOrderTime, finalOrderTime)
      ) {
        errors.push(
          "Opening pre-order time and final order time cannot be the same",
        );
      }
    }

    /* ================= INSTANT ================= */
    if (deliveryMethod === "instant") {
      const hasHours = Object.values(weeklyHours).some(
        (h) => h?.open && h?.close,
      );

      if (!hasHours) {
        errors.push("Set at least one operating day");
      }

      Object.entries(weeklyHours).forEach(([dayIndex, h]) => {
        if (h.is_closed) return;

        if (!h.open || !h.close) return;

        if (isSameTime(h.open, h.close)) {
          const dayName = days[Number(dayIndex)];

          errors.push(
            `${dayName}: Opening and closing times cannot be the same`,
          );
        }
      });
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

  /* =========================================================
     COPY MONDAY
  ========================================================== */
  const copyMondayToAll = () => {
    const monday = weeklyHours[0];

    if (!monday?.open || !monday?.close) {
      setModalConfig({
        message: "• Set Monday hours first",
        variant: "warning",
      });
      setModalVisible(true);
      return;
    }

    const updated: Record<number, DayHours> = {};
    for (let i = 0; i < 7; i++) updated[i] = { ...monday };
    setWeeklyHours(updated);
  };

  /* =========================================================
     SAVE
  ========================================================== */
  const saveOperations = () => {
    if (!validate()) return false;

    const updatedBranches = branches.map((b, idx) => {
      if (idx !== selectedBranchIndex) return b;

      return {
        ...b,
        delivery_method: deliveryMethod,
        pre_order_open_period:
          deliveryMethod === "scheduled" ? formatTime(preOrderTime) : null,
        final_order_time:
          deliveryMethod === "scheduled" ? formatTime(finalOrderTime) : null,
        operating_hours:
          deliveryMethod === "instant"
            ? Object.keys(weeklyHours).map((dayStr) => {
                const day = Number(dayStr);
                const hours = weeklyHours[day];

                return {
                  day,
                  open_time: formatTime(hours?.open || ""),
                  close_time: formatTime(hours?.close || ""),
                  is_closed: hours?.is_closed ?? false,
                };
              })
            : [],
      };
    });

    updatePhase2({ branches: updatedBranches });
    return true;
  };

  /* =========================================================
     CONTINUE
  ========================================================== */
  const handleContinue = () => {
    if (!saveOperations()) return;

    markGroupComplete("setupOperations");
    router.push("/superForm2/checklist");
  };

  const updateHours = (
    dayIndex: number,
    field: "open" | "close",
    value: string,
  ) => {
    setWeeklyHours((prev) => ({
      ...prev,
      [dayIndex]: {
        open: prev[dayIndex]?.open || "",
        close: prev[dayIndex]?.close || "",
        is_closed: prev[dayIndex]?.is_closed ?? false,
        [field]: value,
      },
    }));
  };

  const toggleClosed = (dayIndex: number, value: boolean) => {
    setWeeklyHours((prev) => ({
      ...prev,
      [dayIndex]: {
        open: prev[dayIndex]?.open || "",
        close: prev[dayIndex]?.close || "",
        is_closed: value,
      },
    }));
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
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ArrowLeft size={24} color="#111827" />
          </TouchableOpacity>

          <Text style={styles.pageTitle}>Set up your operations</Text>

          {/* Branch */}
          <CustomDropdown
            placeholder="Select One"
            label="Select Branch"
            options={branches.map((b) => b.name)}
            value={branches[selectedBranchIndex]?.name}
            onChange={(val) => {
              const idx = branches.findIndex((b) => b.name === val);
              if (idx !== -1) setSelectedBranchIndex(idx);
            }}
          />

          {/* Delivery */}
          <CustomDropdown
            placeholder="Select One"
            label="Delivery method"
            options={deliveryMethods}
            value={deliveryMethod}
            onChange={setDeliveryMethod}
          />

          {/* Scheduled */}
          {deliveryMethod === "scheduled" && (
            <>
              <CustomDropdown
                placeholder="Select opening time"
                label="Opening Pre-order Period"
                options={timeSlots}
                value={preOrderTime}
                onChange={setPreOrderTime}
              />
              <CustomDropdown
                placeholder="Select final order time"
                label="Final Order Time"
                options={timeSlots}
                value={finalOrderTime}
                onChange={setFinalOrderTime}
              />
            </>
          )}

          {/* Instant */}
          {deliveryMethod === "instant" && (
            <>
              <View style={localStyles.headerRow}>
                <Text style={styles.sectionTitle}>Weekly Operating Hours</Text>
                <TouchableOpacity
                  style={localStyles.copyBtn}
                  onPress={copyMondayToAll}
                >
                  <Text style={localStyles.copyText}>Same Date For All</Text>
                </TouchableOpacity>
              </View>

              {days.map((day, index) => (
                <View key={index} style={localStyles.dayBlock}>
                  {/* Day Header */}
                  <View style={localStyles.dayHeader}>
                    <Text style={localStyles.dayLabel}>{day}</Text>

                    <View style={localStyles.switchRow}>
                      <Text style={localStyles.closedText}>Closed</Text>

                      <Switch
                        value={weeklyHours[index]?.is_closed ?? false}
                        onValueChange={(value) => toggleClosed(index, value)}
                        trackColor={{
                          false: "#D1D5DB",
                          true: "#FF8C42",
                        }}
                        thumbColor="#FFFFFF"
                        ios_backgroundColor="#D1D5DB"
                      />
                    </View>
                  </View>

                  {/* Closed Message */}
                  {weeklyHours[index]?.is_closed && (
                    <Text style={localStyles.closedLabel}>
                      This branch is closed on {day}.
                    </Text>
                  )}

                  {/* Time Pickers */}
                  {!(weeklyHours[index]?.is_closed ?? false) && (
                    <View style={localStyles.hoursRow}>
                      <View style={localStyles.timeBox}>
                        <CustomDropdown
                          options={timeSlots}
                          value={weeklyHours[index]?.open || ""}
                          placeholder="Open"
                          onChange={(v) => updateHours(index, "open", v)}
                        />
                      </View>

                      <View style={localStyles.timeBox}>
                        <CustomDropdown
                          options={timeSlots}
                          value={weeklyHours[index]?.close || ""}
                          placeholder="Close"
                          onChange={(v) => updateHours(index, "close", v)}
                        />
                      </View>
                    </View>
                  )}
                </View>
              ))}
            </>
          )}

          <TouchableOpacity
            style={[styles.continueBtn, { marginTop: 30 }]}
            onPress={handleContinue}
          >
            <Text style={styles.continueBtnText}>Save & Continue</Text>
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

/* ================= LOCAL STYLES ================= */
const localStyles = StyleSheet.create({
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 24,
    marginBottom: 10,
  },
  copyBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "#FFB47E",
    borderRadius: 8,
  },
  copyText: { fontSize: 12, fontWeight: "600", color: "#000" },
  dayHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },

  switchRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  closedText: {
    marginRight: 8,
    fontSize: 13,
    color: "#6B7280",
  },

  closedLabel: {
    marginTop: 6,
    fontSize: 13,
    color: "#FF8C42",
    fontStyle: "italic",
  },
  dayBlock: {
    marginBottom: 16,
    padding: 14,
    backgroundColor: "#F9FAFB",
    borderRadius: 14,
  },
  dayLabel: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 10,
    color: "#111827",
  },
  hoursRow: { flexDirection: "row", justifyContent: "space-between" },
  timeBox: { flex: 1, marginRight: 8 },
});
