import { styles } from "@/constants/styles";
import React, { useEffect, useMemo, useState } from "react";
import {
    Modal,
    Pressable,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { CustomDropdownProps } from "../types";

export const BankCustomDropdown: React.FC<CustomDropdownProps> = ({
  options,
  placeholder,
  value,
  onChange,
  label,
  required = false,
  renderOptionRight,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filteredOptions = useMemo(() => {
    if (!search.trim()) return options;

    return options.filter((option) =>
      option.toLowerCase().includes(search.toLowerCase()),
    );
  }, [options, search]);

  useEffect(() => {
    if (!isOpen) {
      setSearch("");
    }
  }, [isOpen]);

  return (
    <View style={styles.inputContainer}>
      {label && (
        <View style={styles.labelRow}>
          <Text style={styles.label}>{label}</Text>
          {required && <Text style={styles.required}> *</Text>}
        </View>
      )}

      <TouchableOpacity
        style={styles.dropdown}
        onPress={() => setIsOpen(true)}
        activeOpacity={0.8}
      >
        <Text style={value ? styles.dropdownText : styles.dropdownPlaceholder}>
          {value || placeholder}
        </Text>

        <Text style={styles.chevron}>{isOpen ? "▲" : "▼"}</Text>
      </TouchableOpacity>

      <Modal
        visible={isOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsOpen(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setIsOpen(false)}>
          <Pressable
            style={styles.modalContent}
            onPress={(e) => e.stopPropagation()}
          >
            <TextInput
              placeholder="Search bank..."
              placeholderTextColor="#999"
              value={search}
              onChangeText={setSearch}
              style={{
                height: 46,
                borderWidth: 1,
                borderColor: "#E5E7EB",
                borderRadius: 10,
                paddingHorizontal: 14,
                marginHorizontal: 12,
                marginTop: 12,
                marginBottom: 10,
                fontSize: 16,
                backgroundColor: "#FFF",
              }}
            />

            <ScrollView
              style={styles.optionsList}
              keyboardShouldPersistTaps="handled"
            >
              {filteredOptions.length > 0 ? (
                filteredOptions.map((option, index) => {
                  const selected = option === value;

                  return (
                    <TouchableOpacity
                      key={option}
                      style={[
                        styles.optionItem,
                        index === filteredOptions.length - 1 &&
                          styles.lastOption,
                        {
                          flexDirection: "row",
                          justifyContent: "space-between",
                          alignItems: "center",
                        },
                      ]}
                      onPress={() => {
                        onChange(option);
                        setIsOpen(false);
                      }}
                    >
                      <Text style={styles.optionText}>{option}</Text>

                      {renderOptionRight?.(option, selected)}
                    </TouchableOpacity>
                  );
                })
              ) : (
                <View
                  style={{
                    paddingVertical: 24,
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      color: "#999",
                      fontSize: 15,
                    }}
                  >
                    No banks found
                  </Text>
                </View>
              )}
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
};
