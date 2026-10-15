import React, { memo, useCallback, useMemo, useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  TextInput,
  Text,
  View,
  useWindowDimensions,
} from "react-native";

import { useTheme } from "@/constants/theme";
import { createStyles } from "@/constants/styles/CustomDropdown.styles";
import { CustomDropdownProps, DropdownOption } from "../types";

const CustomDropdownComponent: React.FC<CustomDropdownProps> = ({
  options,
  placeholder,
  value,
  onChange,
  label,
  required = false,
  disabled = false,
  renderOptionRight,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");

  const theme = useTheme();
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();

  const styles = createStyles(theme, screenWidth, screenHeight);

  const filteredOptions = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return options;
    }

    return options.filter((option) =>
      option.label.toLowerCase().includes(query),
    );
  }, [options, search]);

  const openDropdown = useCallback(() => {
    if (!disabled) {
      setIsOpen(true);
    }
  }, [disabled]);

  const closeDropdown = useCallback(() => {
    setSearch("");
    setIsOpen(false);
  }, []);

  const handleSelect = useCallback(
    (option: DropdownOption) => {
      onChange(option);
      closeDropdown();
    },
    [closeDropdown, onChange],
  );

  return (
    <View style={styles.inputContainer}>
      {/* Label */}
      {label && (
        <View style={styles.labelRow}>
          <Text style={styles.label}>{label}</Text>

          {required && <Text style={styles.required}>*</Text>}
        </View>
      )}

      {/* Dropdown Trigger */}
      <Pressable
        accessibilityRole="button"
        accessibilityState={{
          disabled,
          expanded: isOpen,
        }}
        disabled={disabled}
        onPress={openDropdown}
        style={({ pressed }) => [
          styles.dropdown,
          disabled && styles.dropdownDisabled,
          pressed && !disabled && styles.dropdownPressed,
        ]}
      >
        <Text
          numberOfLines={1}
          ellipsizeMode="tail"
          style={value ? styles.dropdownText : styles.dropdownPlaceholder}
        >
          {value?.label ?? placeholder}
        </Text>

        <Text style={styles.chevron}>{isOpen ? "▲" : "▼"}</Text>
      </Pressable>

      {/* Dropdown Modal */}
      <Modal
        transparent
        animationType="fade"
        visible={isOpen && !disabled}
        onRequestClose={closeDropdown}
        statusBarTranslucent
      >
        <Pressable style={styles.modalOverlay} onPress={closeDropdown}>
          <Pressable
            style={styles.modalWrapper}
            onPress={(event) => event.stopPropagation()}
          >
            <View style={styles.modalContent}>
              {/* Modal Header */}
              <View style={styles.modalHeader}>
                <View style={styles.modalTitleContainer}>
                  <Text style={styles.modalTitle}>
                    {label ?? "Select an option"}
                  </Text>

                  <Text style={styles.modalSubtitle}>
                    Choose from the available options
                  </Text>
                </View>

                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Close dropdown"
                  onPress={closeDropdown}
                  hitSlop={10}
                  style={styles.closeButton}
                >
                  <Text style={styles.closeButtonText}>×</Text>
                </Pressable>
              </View>

              {/* Search */}
              <View style={styles.searchContainer}>
                <Text style={styles.searchIcon}>⌕</Text>

                <TextInput
                  autoFocus
                  placeholder="Search..."
                  placeholderTextColor={theme.textSecondary}
                  value={search}
                  onChangeText={setSearch}
                  style={styles.searchInput}
                  returnKeyType="search"
                  autoCapitalize="none"
                  autoCorrect={false}
                  clearButtonMode="while-editing"
                />
              </View>

              {/* Options */}
              <ScrollView
                style={styles.optionsList}
                contentContainerStyle={
                  filteredOptions.length === 0
                    ? styles.emptyListContent
                    : styles.optionsListContent
                }
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
                bounces={false}
              >
                {filteredOptions.length > 0 ? (
                  filteredOptions.map((item, index) => {
                    const isSelected = item.value === value?.value;
                    const isLast = index === filteredOptions.length - 1;

                    return (
                      <Pressable
                        key={item.value}
                        accessibilityRole="button"
                        accessibilityState={{
                          selected: isSelected,
                        }}
                        onPress={() => handleSelect(item)}
                        style={({ pressed }) => [
                          styles.optionItem,
                          isSelected && styles.selectedOption,
                          isLast && styles.lastOption,
                          pressed && styles.optionPressed,
                        ]}
                      >
                        <Text
                          numberOfLines={2}
                          ellipsizeMode="tail"
                          style={[
                            styles.optionText,
                            isSelected && styles.selectedOptionText,
                          ]}
                        >
                          {item.label}
                        </Text>

                        <View style={styles.optionRight}>
                          {renderOptionRight?.(item, isSelected)}
                        </View>
                      </Pressable>
                    );
                  })
                ) : (
                  <View style={styles.emptyContainer}>
                    <Text style={styles.emptyIcon}>⌕</Text>

                    <Text style={styles.emptyTitle}>
                      No results found
                    </Text>

                    <Text style={styles.emptyText}>
                      Try searching with a different name.
                    </Text>
                  </View>
                )}
              </ScrollView>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
};

export const CustomDropdown = memo(CustomDropdownComponent);