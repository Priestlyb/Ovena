import { StyleSheet } from "react-native";
import { ThemeColors } from "@/constants/theme";

export const createStyles = (
  theme: ThemeColors,
  screenWidth: number,
  screenHeight: number,
) =>
  StyleSheet.create({
    // ============================================================================
    // INPUT
    // ============================================================================

    inputContainer: {
      width: "100%",
      marginVertical: 10,
    },

    labelRow: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 8,
    },

    label: {
      fontSize: 15,
      lineHeight: 20,
      fontWeight: "600",
      color: theme.textPrimary,
    },

    required: {
      marginLeft: 3,
      fontSize: 15,
      lineHeight: 20,
      fontWeight: "600",
      color: theme.error,
    },

    // ============================================================================
    // DROPDOWN TRIGGER
    // ============================================================================

    dropdown: {
      width: "100%",
      minHeight: 54,

      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",

      paddingHorizontal: 16,
      paddingVertical: 14,

      backgroundColor: theme.surface,
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: 12,

      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.06,
      shadowRadius: 5,
      elevation: 2,
    },

    dropdownPressed: {
      opacity: 0.75,
    },

    dropdownDisabled: {
      opacity: 0.45,
    },

    dropdownText: {
      flex: 1,
      minWidth: 0,
      marginRight: 12,

      fontSize: 16,
      lineHeight: 22,
      fontWeight: "500",
      color: theme.textPrimary,
    },

    dropdownPlaceholder: {
      flex: 1,
      minWidth: 0,
      marginRight: 12,

      fontSize: 16,
      lineHeight: 22,
      color: theme.textSecondary,
    },

    chevron: {
      width: 22,
      textAlign: "center",

      fontSize: 11,
      fontWeight: "700",
      color: theme.icon,
    },

    // ============================================================================
    // MODAL
    // ============================================================================

    modalOverlay: {
      flex: 1,

      justifyContent: "center",
      alignItems: "center",

      paddingHorizontal: screenWidth < 380 ? 16 : 20,
      paddingVertical: 24,

      backgroundColor: "rgba(0, 0, 0, 0.55)",
    },

    modalWrapper: {
      width: "100%",
      maxWidth: 520,

      // Keeps the modal away from the very top/bottom
      maxHeight: screenHeight * 0.82,
    },

    modalContent: {
      width: "100%",

      backgroundColor: theme.surface,

      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: 18,

      overflow: "hidden",

      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 8,
      },
      shadowOpacity: 0.2,
      shadowRadius: 18,
      elevation: 10,
    },

    // ============================================================================
    // MODAL HEADER
    // ============================================================================

    modalHeader: {
      width: "100%",

      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",

      paddingHorizontal: 18,
      paddingTop: 18,
      paddingBottom: 14,

      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: theme.border,
    },

    modalTitleContainer: {
      flex: 1,
      minWidth: 0,
      paddingRight: 12,
    },

    modalTitle: {
      fontSize: 17,
      lineHeight: 22,
      fontWeight: "700",
      color: theme.textPrimary,
    },

    modalSubtitle: {
      marginTop: 3,

      fontSize: 13,
      lineHeight: 18,
      color: theme.textSecondary,
    },

    closeButton: {
      width: 34,
      height: 34,

      alignItems: "center",
      justifyContent: "center",

      borderRadius: 17,
      backgroundColor: theme.background,
    },

    closeButtonText: {
      marginTop: -2,

      fontSize: 25,
      lineHeight: 28,
      fontWeight: "300",
      color: theme.textSecondary,
    },

    // ============================================================================
    // SEARCH
    // ============================================================================

    searchContainer: {
      width: "100%",
      height: 50,

      flexDirection: "row",
      alignItems: "center",

      marginTop: 14,
      marginBottom: 10,

      paddingHorizontal: 14,

      backgroundColor: theme.background,

      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: 12,
    },

    searchIcon: {
      width: 22,

      marginRight: 8,

      fontSize: 22,
      lineHeight: 24,
      color: theme.textSecondary,
    },

    searchInput: {
      flex: 1,
      minWidth: 0,

      height: "100%",

      paddingHorizontal: 0,
      paddingVertical: 0,

      fontSize: 15,
      color: theme.textPrimary,

      backgroundColor: "transparent",
    },

    // ============================================================================
    // OPTIONS
    // ============================================================================

    optionsList: {
      width: "100%",

      maxHeight: Math.min(screenHeight * 0.55, 420),
    },

    optionsListContent: {
      paddingBottom: 4,
    },

    optionItem: {
      minHeight: 54,

      width: "100%",

      flexDirection: "row",
      alignItems: "center",

      paddingHorizontal: 18,
      paddingVertical: 14,

      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: theme.border,
    },

    optionPressed: {
      opacity: 0.7,
    },

    selectedOption: {
      backgroundColor:
        theme.background === "#0E0E10"
          ? "rgba(217, 80, 46, 0.14)"
          : "#FFF3EE",
    },

    lastOption: {
      borderBottomWidth: 0,
    },

    optionText: {
      flex: 1,
      minWidth: 0,

      marginRight: 12,

      fontSize: 15,
      lineHeight: 21,
      fontWeight: "400",
      color: theme.textPrimary,
    },

    selectedOptionText: {
      fontWeight: "600",
      color: theme.primary,
    },

    optionRight: {
      flexShrink: 0,

      alignItems: "center",
      justifyContent: "center",
    },

    // ============================================================================
    // EMPTY STATE
    // ============================================================================

    emptyListContent: {
      flexGrow: 1,
    },

    emptyContainer: {
      minHeight: 180,

      alignItems: "center",
      justifyContent: "center",

      paddingHorizontal: 24,
      paddingVertical: 30,
    },

    emptyIcon: {
      marginBottom: 10,

      fontSize: 30,
      color: theme.textSecondary,
    },

    emptyTitle: {
      marginBottom: 4,

      fontSize: 15,
      lineHeight: 21,
      fontWeight: "600",
      color: theme.textPrimary,
      textAlign: "center",
    },

    emptyText: {
      fontSize: 13,
      lineHeight: 19,
      color: theme.textSecondary,
      textAlign: "center",
    },

    // ============================================================================
    // LEGACY / SHARED INPUT STYLES
    // ============================================================================

    inputWrapper: {
      position: "relative",
    },

    textInput: {
      backgroundColor: theme.surface,
      borderRadius: 12,
      padding: 16,
      fontSize: 16,
      color: theme.textPrimary,
      borderWidth: 1,
      borderColor: theme.border,

      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.06,
      shadowRadius: 5,
      elevation: 2,
    },

    passwordToggle: {
      position: "absolute",
      right: 16,
      top: 16,
    },

    eyeIcon: {
      fontSize: 20,
      color: theme.primary,
    },
  });