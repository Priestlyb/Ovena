import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { styles } from "@/constants/SubscriptionPlansScreen.styles";
import { useBusinessPlans } from "@/hooks/subscriptions/useBusinessPlans";
import { useSaveCard } from "@/hooks/subscriptions/useSaveCard";

export default function SubscriptionPlansScreen() {
  const router = useRouter();

  const { plans, loading, error, refetch } = useBusinessPlans();

  const { saveCard, loading: savingCard } = useSaveCard();

  const [selectedPlanId, setSelectedPlanId] = useState<number | null>(null);

  const handleSelectPlan = async (plan: any) => {
    try {
      setSelectedPlanId(Number(plan.id));

      console.log("SELECTED PLAN");
      console.log(JSON.stringify(plan, null, 2));

      const email = "pbassey30official@gmail.com";

      if (!email) {
        throw new Error("User email not found");
      }

      console.log("SAVING CARD...");

      const saveCardResponse = await saveCard(email);

      console.log("SAVE CARD RESPONSE");
      console.log(JSON.stringify(saveCardResponse, null, 2));

      const paymentUrl =
        saveCardResponse?.authorization_url ||
        saveCardResponse?.payment_url ||
        saveCardResponse?.url ||
        saveCardResponse?.data?.authorization_url;

      if (!paymentUrl) {
        throw new Error("No payment URL returned from saveCard");
      }
      console.log("Payment URL:", paymentUrl);
      console.log("Plan ID:", plan.id);

      router.push({
        pathname: "/screens/PaymentScreen",
        params: {
          paymentUrl,
          planId: String(plan.id),
        },
      });
    } catch (err: any) {
      console.log("❌ PROCESS FAILED");
      console.log(
        JSON.stringify(err?.response?.data || err?.message || err, null, 2),
      );
    } finally {
      setSelectedPlanId(null);
    }
  };

  if (loading && plans.length === 0) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator size="large" color="#FF5920" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={refetch} />
        }
      >
        <Text style={styles.title}>Choose a Plan</Text>

        {/* <DeleteAccountButton /> */}

        <Text style={styles.subtitle}>
          Select the subscription that best fits your business.
        </Text>

        {error ? (
          <View style={styles.errorCard}>
            <Text style={styles.errorText}>
              {typeof error === "string"
                ? error
                : JSON.stringify(error, null, 2)}
            </Text>
          </View>
        ) : null}

        {!loading && plans.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyText}>
              No subscription plans available.
            </Text>
          </View>
        ) : (
          plans.map((plan: any) => (
            <View key={plan.id} style={styles.planCard}>
              <View style={styles.headerRow}>
                <Text style={styles.planName}>{plan.name}</Text>

                <View style={styles.audienceBadge}>
                  <Text style={styles.audienceText}>{plan.audience}</Text>
                </View>
              </View>

              <Text style={styles.price}>
                ₦{Number(plan.amount).toLocaleString()}
              </Text>

              <Text style={styles.interval}>billed {plan.interval}</Text>

              {!!plan.description && (
                <Text style={styles.description}>{plan.description}</Text>
              )}

              <View style={styles.infoRow}>
                <View style={styles.infoChip}>
                  <Text style={styles.infoChipText}>{plan.interval}</Text>
                </View>

                <View style={styles.infoChip}>
                  <Text style={styles.infoChipText}>{plan.audience}</Text>
                </View>
              </View>

              <TouchableOpacity
                style={[
                  styles.button,
                  savingCard &&
                    selectedPlanId === Number(plan.id) && {
                      opacity: 0.7,
                    },
                ]}
                disabled={savingCard && selectedPlanId === Number(plan.id)}
                onPress={() => handleSelectPlan(plan)}
              >
                {savingCard && selectedPlanId === Number(plan.id) ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text style={styles.buttonText}>Select Plan</Text>
                )}
              </TouchableOpacity>
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
