// app/(tabs)/branch-hours.tsx
import FeedbackModal from "@/components/FeedbackModal";
import { Header } from "@/components/molecules/Header";
import { StoreHubTimeSelector } from "@/components/StoreHub_TimeSelector";
import api from "@/services/apiClient";
import { useRouter } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type BranchHour = {
  day: number;
  open_time: string;
  close_time: string;
};

// Day mapping
const WEEK_DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

// Format backend time → UI time
const formatTime = (time: string) => {
  if (!time) return "";
  return time.slice(0, 5);
};

// FIX: Convert ANY format → backend safe HH:mm:ss
const normalizeTime = (time: string) => {
  if (!time) return "";

  // already backend format
  if (time.includes(":") && !time.includes("AM") && !time.includes("PM")) {
    const [h, m] = time.split(":");
    return `${h}:${m}:00`;
  }

  // AM/PM conversion
  const [timePart, modifier] = time.split(" ");

  let [hours, minutes] = timePart.split(":").map(Number);

  if (modifier === "PM" && hours !== 12) hours += 12;
  if (modifier === "AM" && hours === 12) hours = 0;

  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:00`;
};

export default function WorkingHourScreen() {
  const router = useRouter();

  const [data, setData] = useState<BranchHour[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // TOAST STATE
  const [toast, setToast] = useState({
    visible: false,
    title: "",
    message: "",
    variant: "info" as "success" | "error" | "warning" | "info",
  });

  const showToast = (
    title: string,
    message: string,
    variant: "success" | "error" | "warning" | "info" = "info",
  ) => {
    setToast({
      visible: true,
      title,
      message,
      variant,
    });
  };

  const fetchBranchHours = async () => {
    try {
      const res = await api.get("/business/branches/hours/");
      setData(res.data);
      console.log("Branch data", res.data);
    } catch (error: any) {
      console.log(
        "❌ Error fetching branch hours:",
        error?.response?.data || error.message,
      );

      showToast("Error", "Failed to load branch hours", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBranchHours();
  }, []);

  const handleOpenChange = (index: number, value: string) => {
    const updated = [...data];
    updated[index].open_time = value;
    setData(updated);
  };

  const handleCloseChange = (index: number, value: string) => {
    const updated = [...data];
    updated[index].close_time = value;
    setData(updated);
  };

  const getDayName = (day: number) => WEEK_DAYS[day] ?? `Unknown Day (${day})`;

  // FIXED UPDATE API CALL
  const updateBranchHours = async () => {
    try {
      setSaving(true);

      const payload = data.map((item) => ({
        day: item.day,
        open_time: normalizeTime(item.open_time),
        close_time: normalizeTime(item.close_time),
        is_closed: !item.open_time || !item.close_time,
      }));

      await api.put("/business/branches/hours/", payload);

      showToast("Success", "Working hours updated successfully", "success");
    } catch (error: any) {
      console.log(
        "❌ Error updating branch hours:",
        error?.response?.data || error.message,
      );

      showToast(
        "Error",
        error?.response?.data?.message || "Failed to update working hours",
        "error",
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#F65513" />
      </View>
    );
  }

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "#fff",
        paddingTop: Platform.OS === "android" ? 50 : 0,
      }}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.container}>
          <Header
            title="Working Hours"
            leftIcon={<ArrowLeft size={24} color="#111827" />}
            onLeftIconPress={() => router.back()}
          />

          {data.map((item, index) => (
            <View key={item.day} style={styles.row}>
              <Text style={styles.dayText}>{getDayName(item.day)}</Text>

              <StoreHubTimeSelector
                openingTime={formatTime(item.open_time)}
                closingTime={formatTime(item.close_time)}
                onOpeningTimeChange={(val) => handleOpenChange(index, val)}
                onClosingTimeChange={(val) => handleCloseChange(index, val)}
              />
            </View>
          ))}

          {/* SAVE BUTTON */}
          <TouchableOpacity
            style={styles.saveButton}
            onPress={updateBranchHours}
            disabled={saving}
          >
            {saving ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.saveText}>Save Changes</Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* TOAST */}
      <FeedbackModal
        visible={toast.visible}
        title={toast.title}
        message={toast.message}
        variant={toast.variant}
        onClose={() => setToast((prev) => ({ ...prev, visible: false }))}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 25,
    paddingBottom: 50,
    gap: 10,
  },
  row: {
    gap: 20,
    marginBottom: 10,
  },
  dayText: {
    fontSize: 15,
    fontWeight: "500",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  saveButton: {
    backgroundColor: "#F65513",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 25,
  },
  saveText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
