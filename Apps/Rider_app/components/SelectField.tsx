// components/SelectField.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  FlatList,
  
} from "react-native";
import { IconSymbol } from "./ui/icon-symbol";
import { SafeAreaView } from "react-native-safe-area-context";

interface SelectFieldProps {
  label: string;
  options: string[];
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
}

const SelectField: React.FC<SelectFieldProps> = ({
  label,
  options,
  value,
  onChange,
  placeholder = "Select",
}) => {
  const [open, setOpen] = useState(false);

  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity
        style={styles.trigger}
        onPress={() => setOpen(true)}
        activeOpacity={0.75}
      >
        <Text style={[styles.triggerText, !value && styles.placeholder]}>
          {value || placeholder}
        </Text>
        <IconSymbol name="ChevronDownIcon" size={18} color="#555" />
      </TouchableOpacity>

      <Modal visible={open} transparent animationType="slide">
        <SafeAreaView style={styles.modalWrap}>
          <View style={styles.sheet}>
            <View style={styles.sheetHandle} />
            <Text style={styles.sheetTitle}>{label}</Text>
            <FlatList
              data={options}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[styles.option, item === value && styles.optionActive]}
                  onPress={() => {
                    onChange(item);
                    setOpen(false);
                  }}
                >
                  <Text
                    style={[
                      styles.optionText,
                      item === value && styles.optionTextActive,
                    ]}
                  >
                    {item}
                  </Text>
                  {item === value && (
                    <IconSymbol name="CheckmarkIcon" size={16} color="#D44C0C" />
                  )}
                </TouchableOpacity>
              )}
            />
          </View>
        </SafeAreaView>
      </Modal>
    </View>
  );
};

export default SelectField;

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: "#111",
    marginBottom: 8,
  },
  trigger: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 14,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 1,
  },
  triggerText: {
    fontSize: 15,
    color: "#111",
  },
  placeholder: {
    color: "#bbb",
  },
  /* Modal sheet */
  modalWrap: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  sheet: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 12,
    paddingBottom: 32,
    maxHeight: "60%",
  },
  sheetHandle: {
    width: 40,
    height: 4,
    backgroundColor: "#e0e0e0",
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 16,
  },
  sheetTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111",
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f5f5f5",
  },
  optionActive: {
    backgroundColor: "#FFF8EE",
  },
  optionText: {
    fontSize: 15,
    color: "#333",
  },
  optionTextActive: {
    color: "#D44C0C",
    fontWeight: "600",
  },
});