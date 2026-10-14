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
import { useTheme } from "../context/ThemeContext";

export interface SelectFieldOption {
  label: string;
  value: string;
}

interface SelectFieldProps {
  label: string;
  /** Either a flat string list (label === value) or explicit {label, value} pairs */
  options: string[] | SelectFieldOption[];
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  /** Shows a red border + error text below the trigger, matching FormInput's error styling */
  error?: string;
}

function normalizeOptions(options: string[] | SelectFieldOption[]): SelectFieldOption[] {
  if (options.length === 0) return [];
  return typeof options[0] === "string"
    ? (options as string[]).map((o) => ({ label: o, value: o }))
    : (options as SelectFieldOption[]);
}

const SelectField: React.FC<SelectFieldProps> = ({
  label,
  options,
  value,
  onChange,
  placeholder = "Select",
  error,
}) => {
  const { colors } = useTheme();
  const [open, setOpen] = useState(false);

  const normalized  = normalizeOptions(options);
  const selectedOpt = normalized.find((o) => o.value === value);
  const errorColor  = colors.accentRed ?? "#e53935";

  return (
    <View style={styles.wrapper}>
      <Text style={[styles.label, { color: colors.textPrimary }]}>{label}</Text>
      <TouchableOpacity
        style={[
          styles.trigger,
          {
            backgroundColor: colors.inputBg ?? colors.card,
            borderColor:     error ? errorColor : colors.separatorColor,
            borderWidth:     error ? 1.5 : 1,
          },
        ]}
        onPress={() => setOpen(true)}
        activeOpacity={0.75}
      >
        <Text
          style={[
            styles.triggerText,
            { color: selectedOpt ? colors.textPrimary : colors.textMuted },
          ]}
        >
          {selectedOpt?.label ?? placeholder}
        </Text>
        <IconSymbol name="ChevronDownIcon" size={18} color={colors.iconColor} />
      </TouchableOpacity>
      {error ? <Text style={[styles.errorText, { color: errorColor }]}>{error}</Text> : null}

      <Modal visible={open} transparent animationType="slide" onRequestClose={() => setOpen(false)}>
        <TouchableOpacity
          style={styles.modalWrap}
          activeOpacity={1}
          onPress={() => setOpen(false)}
        >
          <SafeAreaView edges={["bottom"]} style={styles.sheetSafeArea}>
            <TouchableOpacity activeOpacity={1} onPress={() => {}}>
              <View style={[styles.sheet, { backgroundColor: colors.card }]}>
                <View style={[styles.sheetHandle, { backgroundColor: colors.separatorColor }]} />
                <Text style={[styles.sheetTitle, { color: colors.textPrimary }]}>{label}</Text>
                <FlatList
                  data={normalized}
                  keyExtractor={(item) => item.value}
                  renderItem={({ item }) => {
                    const isActive = item.value === value;
                    return (
                      <TouchableOpacity
                        style={[
                          styles.option,
                          { borderBottomColor: colors.separatorColor },
                          isActive && { backgroundColor: `${colors.accentOrange}1A` },
                        ]}
                        onPress={() => {
                          onChange(item.value);
                          setOpen(false);
                        }}
                      >
                        <Text
                          style={[
                            styles.optionText,
                            { color: isActive ? colors.accentOrange : colors.textPrimary },
                            isActive && styles.optionTextActive,
                          ]}
                        >
                          {item.label}
                        </Text>
                        {isActive && (
                          <IconSymbol name="CheckmarkIcon" size={16} color={colors.accentOrange} />
                        )}
                      </TouchableOpacity>
                    );
                  }}
                />
              </View>
            </TouchableOpacity>
          </SafeAreaView>
        </TouchableOpacity>
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
    marginBottom: 8,
  },
  trigger: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 1,
  },
  triggerText: {
    fontSize: 15,
  },
  errorText: {
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
  /* Modal sheet */
  modalWrap: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  sheetSafeArea: {
    // Keeps the sheet's rounded corners clipped correctly above the home indicator
  },
  sheet: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 12,
    paddingBottom: 32,
    maxHeight: 420,
  },
  sheetHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 16,
  },
  sheetTitle: {
    fontSize: 16,
    fontWeight: "700",
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
  },
  optionText: {
    fontSize: 15,
  },
  optionTextActive: {
    fontWeight: "600",
  },
});