import React, { FC } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
} from "react-native";

export interface SafetyReliabilityState {
  trafficRules: string;
  helmet: string;
  punctuality: string;
  healthIssue: string;
  healthDetails: string;
  reason: string;
  availability: string;
  bagImage: string;
}

interface SafetyAndReliabilityProps {
  data: SafetyReliabilityState;
  setData: React.Dispatch<React.SetStateAction<SafetyReliabilityState>>;
  onBack: () => void;
  onContinue: () => void;
}

const SafetyAndReliability: FC<SafetyAndReliabilityProps> = ({
  data,
  setData,
  onBack,
  onContinue,
}) => {
  return (
    <View style={{ flex: 1, paddingHorizontal: 20 }}>
      <Text style={styles.title}>Safety & Reliability</Text>

      {/* Traffic Rules */}
      <Text style={styles.question}>
        Are you willing to follow traffic rules strictly?
      </Text>

      <View style={styles.row}>
        <OptionButton
          label="Yes"
          active={data.trafficRules === "Yes"}
          onPress={() => setData((p) => ({ ...p, trafficRules: "Yes" }))}
        />
        <OptionButton
          label="No"
          active={data.trafficRules === "No"}
          onPress={() => setData((p) => ({ ...p, trafficRules: "No" }))}
        />
      </View>

      {/* Helmet */}
      <Text style={styles.question}>
        Are you willing to wear a helmet and safety gear?
      </Text>

      <View style={styles.row}>
        <OptionButton
          label="Yes"
          active={data.helmet === "Yes"}
          onPress={() => setData((p) => ({ ...p, helmet: "Yes" }))}
        />
        <OptionButton
          label="No"
          active={data.helmet === "No"}
          onPress={() => setData((p) => ({ ...p, helmet: "No" }))}
        />
      </View>

      {/* Punctuality */}
      <Text style={styles.question}>How would you rate your punctuality?</Text>

      <View style={styles.row}>
        {["Excellent", "Good", "Fair", "Poor"].map((x) => (
          <OptionButton
            key={x}
            label={x}
            active={data.punctuality === x}
            onPress={() => setData((p) => ({ ...p, punctuality: x }))}
          />
        ))}
      </View>

      {/* Health */}
      <Text style={styles.question}>
        Do you have any health conditions that could affect your work?
      </Text>

      <View style={styles.row}>
        <OptionButton
          label="Yes"
          active={data.healthIssue === "Yes"}
          onPress={() => setData((p) => ({ ...p, healthIssue: "Yes" }))}
        />
        <OptionButton
          label="No"
          active={data.healthIssue === "No"}
          onPress={() => setData((p) => ({ ...p, healthIssue: "No" }))}
        />
      </View>

      {data.healthIssue === "Yes" && (
        <TextInput
          placeholder="If Yes, please specify..."
          style={styles.textInput}
          value={data.healthDetails}
          onChangeText={(text) =>
            setData((p) => ({ ...p, healthDetails: text }))
          }
          multiline
        />
      )}

      {/* Reason */}
      <Text style={styles.question}>
        Why do you want to work as a delivery rider with us?
      </Text>
      <TextInput
        style={styles.textInput}
        multiline
        value={data.reason}
        onChangeText={(text) => setData((p) => ({ ...p, reason: text }))}
      />

      {/* Availability */}
      <Text style={styles.question}>How soon can you start if selected?</Text>
      <TextInput
        style={styles.textInput}
        multiline
        value={data.availability}
        onChangeText={(text) => setData((p) => ({ ...p, availability: text }))}
      />

      {/* Upload */}
      <Text style={styles.question}>Upload an image of your Delivery Bag</Text>

      <TouchableOpacity style={styles.uploadBox}>
        <Text style={{ textAlign: "center", color: "#777" }}>
          Choose Picture
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.continueBtn} onPress={onContinue}>
        <Text style={styles.continueText}>Continue</Text>
      </TouchableOpacity>
    </View>
  );
};

const OptionButton = ({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) => (
  <TouchableOpacity
    onPress={onPress}
    style={[styles.option, active && styles.optionActive]}
  >
    <Text style={{ color: "#000" }}>{label}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  title: {
    fontSize: 22,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 10,
  },
  question: {
    fontSize: 14,
    marginTop: 10,
  },
  row: {
    flexDirection: "row",
    gap: 10,
    marginTop: 8,
  },
  option: {
    borderWidth: 1,
    borderColor: "#ccc",
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 12,
    backgroundColor: "#fff",
  },
  optionActive: {
    borderColor: "#D44C0C",
    backgroundColor: "#FFE3D5",
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    marginTop: 10,
    padding: 10,
    minHeight: 80,
  },
  uploadBox: {
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: "#ccc",
    borderRadius: 12,
    height: 120,
    justifyContent: "center",
    marginTop: 10,
  },
  continueBtn: {
    marginTop: 20,
    backgroundColor: "#D44C0C",
    padding: 15,
    borderRadius: 50,
  },
  continueText: {
    textAlign: "center",
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
  },
});

export default SafetyAndReliability;
