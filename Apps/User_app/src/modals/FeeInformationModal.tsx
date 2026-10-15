// components/FeeInformation.tsx

import { IconSymbol } from "@/components/ui/icon-symbol";
import { useTheme } from "@/constants/theme";

import React from "react";

import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";

type FeeInformationProps = {
  visible: boolean;
  onClose: () => void;

  serviceFee?: number;
  deliveryFee?: number;
  processingFee?: number;
  weatherFees?: number;
};

export default function FeeInformation({
  visible,
  onClose,
  serviceFee = 0,
  deliveryFee = 0,
  processingFee = 0,
  weatherFees = 0,
}: FeeInformationProps) {
  const theme = useTheme();

  const styles = createStyles(theme);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* HEADER */}
          <View style={styles.header}>
            <Text style={styles.title}>How our fees work?</Text>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.content}
          >
            {/* OPERATIONAL FEES */}

            <Text style={styles.rowTitle}>Operational fees</Text>

            <View style={styles.row}>
              <IconSymbol name="BagOutline" size={25} color={theme.icon} />

              <View style={styles.textContainer}>
                <Text style={styles.label}>Small Order (Below ₦5,000)</Text>

                <Text style={styles.description}>
                  To help cover the costs for low-order amount
                </Text>
              </View>

              <Text style={styles.value}>₦{processingFee.toFixed(2)}</Text>
            </View>

            <View style={styles.row}>
              <IconSymbol name="SettingsIcon" size={25} color={theme.icon} />

              <View style={styles.textContainer}>
                <Text style={styles.label}>Service Fee</Text>

                <Text style={styles.description}>
                  This fee helps us maintain the platform and support our
                  operations team. It is calculated as 4% of your order total
                  per restaurant.
                </Text>
              </View>

              <Text style={styles.value}>₦{serviceFee.toFixed(2)}</Text>
            </View>

            <View style={styles.divider} />

            {/* COURIER FEES */}

            <Text style={styles.rowTitle}>Courier fees</Text>

            <View style={styles.row}>
              <IconSymbol name="DeliveryIcon" size={25} color={theme.icon} />

              <View style={styles.textContainer}>
                <Text style={styles.label}>Delivery Fees</Text>

                <Text style={styles.description}>
                  Charged per restaurant to help us process and manage your
                  order.
                </Text>
              </View>

              <Text style={styles.value}>₦{deliveryFee.toFixed(2)}</Text>
            </View>

            <View style={styles.row}>
              <IconSymbol name="WeatherIcon" size={25} color={theme.icon} />

              <View style={styles.textContainer}>
                <Text style={styles.label}>Bad Weather</Text>

                <Text style={styles.description}>
                  To equitably compensate couriers for their efforts in adverse
                  weather conditions.
                </Text>
              </View>

              <Text style={styles.value}>₦{weatherFees.toFixed(2)}</Text>
            </View>
          </ScrollView>

          <TouchableOpacity style={styles.button} onPress={onClose}>
            <Text style={styles.buttonText}>Got It</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const createStyles = (theme: any) =>
  StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: "rgba(0,0,0,0.45)",
      justifyContent: "flex-end",
    },

    container: {
      backgroundColor: theme.background,
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      paddingHorizontal: 20,
      paddingTop: 20,
      paddingBottom: 30,
      minHeight: 350,
    },

    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 20,
    },

    title: {
      fontSize: 20,
      fontWeight: "700",
      color: theme.textPrimary,
    },

    content: {
      paddingBottom: 20,
    },

    rowTitle: {
      fontSize: 16,
      fontWeight: "600",
      color: theme.textPrimary,
      marginBottom: 12,
    },

    row: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: 14,
      gap: 10,
    },

    textContainer: {
      flex: 1,
      marginLeft: 8,
    },

    label: {
      fontSize: 15,
      color: theme.textPrimary,
      marginBottom: 5,
      fontWeight: "500",
    },

    description: {
      fontSize: 14,
      lineHeight: 22,
      color: theme.textSecondary,
    },

    value: {
      fontSize: 15,
      fontWeight: "600",
      color: theme.textPrimary,
    },

    divider: {
      height: 1,
      backgroundColor: theme.border,
      marginVertical: 8,
    },

    button: {
      marginTop: 20,
      backgroundColor: theme.primary,
      borderRadius: 20,
      paddingVertical: 16,
      alignItems: "center",
    },

    buttonText: {
      color: "#FFFFFF",
      fontSize: 16,
      fontWeight: "600",
    },
  });
