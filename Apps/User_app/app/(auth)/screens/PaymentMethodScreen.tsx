import { StyleSheet, Text, TouchableOpacity, View, ScrollView } from "react-native";
import React from "react";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { router } from "expo-router";

export default function PaymentMethodScreen() {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.replace("/(auth)/screens/AccountScreen")}
            style={styles.backButton}
          >
            <IconSymbol name="ArrowLeftIcon" size={22} color="#000" />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Payment methods</Text>
          <View style={styles.headerSpacer} />
        </View>

        {/* Add Payment Method */}
        <View style={styles.addPaymentRow}>
          <Text style={styles.addPaymentText}>Add new payment method</Text>
          <Text style={styles.editText}>Edit</Text>
        </View>

        {/* Card Item */}
        <TouchableOpacity onPress={() => router.replace("/(auth)/screens/AccountScreen")}>
        <View style={styles.cardRow}>
          <View style={styles.cardLeft}>
            <IconSymbol name="CreditCardIcon" size={20} color="#000" />
            <Text style={styles.cardText}>Add new card</Text>
          </View>
          <IconSymbol name="ChevronRightIcon" size={20} color="#000" />
        </View>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 55,
  },
  scrollContainer: {
    paddingBottom: 20,
  },
  header: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 50,
    marginBottom: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  backButton: {
    padding: 10,
    borderColor: "#000",
    borderWidth: 1,
    borderRadius: 50,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
  },
  headerSpacer: {
    width: 34,
  },
  addPaymentRow: {
    paddingHorizontal: 30,
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },
  addPaymentText: {
    fontSize: 18,
  },
  editText: {
    backgroundColor: "#D9D9D9",
    color: "#000",
    fontWeight: "bold",
    padding: 5,
    borderRadius: 10,
  },
  cardRow: {
    paddingRight: 30,
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 20,
  },
  cardLeft: {
    paddingHorizontal: 30,
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  cardText: {
    fontSize: 16,
  },
});