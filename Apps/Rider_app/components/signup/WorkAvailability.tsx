import React, { useRef } from "react";
import {
  ScrollView,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Animated,
  LayoutAnimation,
  Platform,
  UIManager,
} from "react-native";

export interface WorkAvailabilityState {
  fullTime: boolean;
  partTime: boolean;
  days: string[];
  times: string[];
  previousDelivery: string[];
  localRoutes: string[];
  gpsUsed: string[];
  cashOnDelivery: string[];
}

interface WorkStepProps {
  workAvailability: WorkAvailabilityState;
  setWorkAvailability: React.Dispatch<
    React.SetStateAction<WorkAvailabilityState>
  >;
}

// Enable Layout Animation for Android
if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function WorkStep({
  workAvailability,
  setWorkAvailability,
}: WorkStepProps) {
  const daysOptions = [
    "Mon",
    "Tue",
    "Wed",
    "Thu",
    "Fri",
    "Sat",
    "Sun",
    "Everyday",
  ];
  const timesOptions = ["Morning", "Afternoon", "Evening", "Late Night"];
  const previousDeliveryOptions = ["Yes", "No"];
  const localRoutesOptions = [
    "Very familiar",
    "Somewhat familiar",
    "Not familiar",
  ];
  const gpsUsedOptions = ["Yes", "No"];
  const cashOnDeliveryOptions = ["Yes", "No"];

  const safeArray = (arr?: string[]) => (Array.isArray(arr) ? arr : []);

  const animatePress = (scaleRef: Animated.Value) => {
    Animated.sequence([
      Animated.timing(scaleRef, {
        toValue: 0.95,
        duration: 80,
        useNativeDriver: true,
      }),
      Animated.timing(scaleRef, {
        toValue: 1,
        duration: 80,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const toggleBoolean = (field: "fullTime" | "partTime") => {
    LayoutAnimation.easeInEaseOut();
    setWorkAvailability((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const toggleItem = (
    field:
      | "days"
      | "times"
      | "previousDelivery"
      | "localRoutes"
      | "gpsUsed"
      | "cashOnDelivery",
    value: string
  ) => {
    LayoutAnimation.easeInEaseOut();

    const list = safeArray(workAvailability[field]);

    setWorkAvailability((prev) => ({
      ...prev,
      [field]: list.includes(value)
        ? list.filter((i) => i !== value)
        : [...list, value],
    }));
  };

  const renderOptionButtons = (
    label: string,
    options: string[],
    selectedItems: string[],
    onPress: (value: string) => void
  ) => (
    <View style={{ marginVertical: 12 }}>
      <Text style={styles.label}>{label}</Text>

      <View style={styles.optionContainer}>
        {options.map((opt) => {
          const isSelected = selectedItems.includes(opt);
          const scale = useRef(new Animated.Value(1)).current;

          return (
            <Animated.View
              key={opt}
              style={{ transform: [{ scale }], width: "45%" }}
            >
              <TouchableOpacity
                style={[
                  styles.optionButton,
                  isSelected && styles.optionButtonSelected,
                ]}
                onPress={() => {
                  animatePress(scale);
                  onPress(opt);
                }}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.optionText,
                    isSelected && styles.optionTextSelected,
                  ]}
                >
                  {opt}
                </Text>
              </TouchableOpacity>
            </Animated.View>
          );
        })}
      </View>
    </View>
  );

  return (
    <>
      <View style={styles.header}>
        <Text style={styles.headerText}>Work Availability</Text>
      </View>

      <ScrollView
        style={styles.form}
        contentContainerStyle={{ paddingVertical: 5 }}
      >
        {/* Full / Part Time */}
        <Text style={styles.label}>Availability to Work</Text>

        <View style={styles.optionContainer}>
          {["fullTime", "partTime"].map((type) => {
            const isSelected =
              workAvailability[type as "fullTime" | "partTime"];
            const scale = useRef(new Animated.Value(1)).current;

            return (
              <Animated.View
                key={type}
                style={{ transform: [{ scale }], width: "45%" }}
              >
                <TouchableOpacity
                  style={[
                    styles.optionButton,
                    isSelected && styles.optionButtonSelected,
                  ]}
                  onPress={() => {
                    animatePress(scale);
                    toggleBoolean(type as "fullTime" | "partTime");
                  }}
                  activeOpacity={0.8}
                >
                  <Text
                    style={[
                      styles.optionText,
                      isSelected && styles.optionTextSelected,
                    ]}
                  >
                    {type === "fullTime" ? "Full-time" : "Part-time"}
                  </Text>
                </TouchableOpacity>
              </Animated.View>
            );
          })}
        </View>

        {renderOptionButtons(
          "What days are you available?",
          daysOptions,
          safeArray(workAvailability.days),
          (v) => toggleItem("days", v)
        )}

        {renderOptionButtons(
          "What times of the day are you available?",
          timesOptions,
          safeArray(workAvailability.times),
          (v) => toggleItem("times", v)
        )}

        {renderOptionButtons(
          "Have you worked as a delivery rider before?",
          previousDeliveryOptions,
          safeArray(workAvailability.previousDelivery),
          (v) => toggleItem("previousDelivery", v)
        )}
        <Text>If Yes, for how long? ___________</Text>

        {renderOptionButtons(
          "How familiar are you with local routes?",
          localRoutesOptions,
          safeArray(workAvailability.localRoutes),
          (v) => toggleItem("localRoutes", v)
        )}

        {renderOptionButtons(
          "Have you used a GPS or map app for deliveries?",
          gpsUsedOptions,
          safeArray(workAvailability.gpsUsed),
          (v) => toggleItem("gpsUsed", v)
        )}

        {renderOptionButtons(
          "Can you handle cash on delivery?",
          cashOnDeliveryOptions,
          safeArray(workAvailability.cashOnDelivery),
          (v) => toggleItem("cashOnDelivery", v)
        )}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  form: { flex: 1, padding: 20 },
  header: { alignItems: "center", marginBottom: 20, marginTop: 10 },
  headerText: { fontSize: 20, fontWeight: "bold", color: "#333" },

  label: {
    fontWeight: "bold",
    fontSize: 15,
    marginBottom: 6,
    color: "#333",
  },

  optionContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 20,
    justifyContent: "space-between",
  },

  optionButton: {
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 15,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 15,
    marginBottom: 15,
    backgroundColor: "#fff",

    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },

  optionButtonSelected: {
    backgroundColor: "#d35400",
    borderColor: "#d35400",
  },

  optionText: { color: "#000", fontSize: 13 },
  optionTextSelected: { color: "#fff", fontWeight: "bold" },
});
