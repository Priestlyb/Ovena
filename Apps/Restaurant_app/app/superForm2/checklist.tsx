import { usePhase2 } from "@/app/context/Phase2Context";
import { Spacer } from "@/components/atoms/Spacer";
import { ChecklistItem } from "@/components/CheckListItem";
import { Icons } from "@/constants/checklistIcons";
import { styles } from "@/constants/styles";
import api from "@/services/apiClient";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-root-toast";

/* ================= HELPERS ================= */
const clean = (val: any) => {
  if (val === null || val === undefined) return null;
  const str = String(val).trim();
  return str === "" ? null : str;
};

/* ================= COMPONENT ================= */
const ChecklistPage = ({ onBack }: any) => {
  const { phase2Data } = usePhase2();

  const [isSubmitting, setIsSubmitting] = useState(false); // ✅ NEW

  /* ================= COMPLETION ================= */
  const completionStatus = {
    completeProfile: phase2Data.branches?.length > 0,
    setupOperations: phase2Data.branches?.some((b) => {
      if (b.delivery_method === "scheduled") {
        return b.pre_order_open_period && b.final_order_time;
      }

      return b.operating_hours && b.operating_hours.length > 0;
    }),

    verifyBusiness: !!phase2Data.business_documents?.registered_business_name,

    setupPayments: !!phase2Data.payment?.account_number,
  };

  const completedCount = Object.values(completionStatus).filter(Boolean).length;
  const isAllComplete = completedCount === 4;

  /* ================= NAV ================= */
  const handleGroupPress = (route: string) => {
    router.push(route as any);
  };

  /* ================= SUBMIT ================= */
  const handlePhase2Submit = async () => {
    if (!isAllComplete || isSubmitting) return;

    setIsSubmitting(true); // ✅ START LOADING

    try {
      const payload = {
        branches:
          phase2Data.branches?.map((b) => {
            const isScheduled = b.delivery_method === "scheduled";

            return {
              name: clean(b.name),
              address: clean(b.address),
              latitude: b.latitude ?? null,
              longitude: b.longitude ?? null,

              delivery_method: clean(b.delivery_method),
              pre_order_open_period: isScheduled
                ? clean(b.pre_order_open_period)
                : null,

              final_order_time: isScheduled ? clean(b.final_order_time) : null,

              operating_hours: !isScheduled
                ? b.operating_hours?.map((h) => ({
                    day: h.day,
                    open_time: clean(h.open_time),
                    close_time: clean(h.close_time),
                    is_closed: h.is_closed ?? false,
                  })) || []
                : [],
            };
          }) || [],

        payment: {
          bank: clean(phase2Data.payment?.bank),
          account_number: clean(phase2Data.payment?.account_number),
          account_name: clean(phase2Data.payment?.account_name),
          bvn: clean(phase2Data.payment?.bvn),
        },

        registered_business_name: clean(
          phase2Data.business_documents?.registered_business_name,
        ),
        business_type: clean(phase2Data.business_documents?.business_type),
        tax_identification_number: clean(
          phase2Data.business_documents?.tax_identification_number,
        ),
        rc_number: clean(phase2Data.business_documents?.rc_number),
      };

      console.log("FINAL PAYLOAD:", JSON.stringify(payload, null, 2));

      await api.post("/accounts/onboard/phase2/", payload);

      Toast.show("Phase 2 submitted successfully!", {
        duration: Toast.durations.LONG,
        position: Toast.positions.BOTTOM,
      });

      router.push("/superForm2/menu-items");
    } catch (err: any) {
      console.error("SUBMIT ERROR:", err);

      const errorData = err?.response?.data;

      console.log("ERROR DATA:", errorData);
      console.log("ERROR STATUS:", err?.response?.status);

      let message = "❌ Submission failed. Please try again.";

      if (errorData?.branches && Array.isArray(errorData.branches)) {
        const branchErrors: string[] = [];

        errorData.branches.forEach((branch: any, index: number) => {
          if (!branch) return;

          Object.entries(branch).forEach(([field, errors]: any) => {
            if (Array.isArray(errors) && errors.length > 0) {
              branchErrors.push(
                `Branch ${index + 1}: ${field.replace("_", " ")} - ${errors[0]}`,
              );
            }
          });
        });

        if (branchErrors.length > 0) {
          message = branchErrors.join("\n");
        }
      } else if (typeof errorData === "object") {
        const firstError = Object.values(errorData)[0];
        if (Array.isArray(firstError)) {
          message = firstError[0];
        }
      }

      Toast.show(message, {
        duration: Toast.durations.LONG,
        position: Toast.positions.BOTTOM,
      });
    } finally {
      setIsSubmitting(false); // ✅ STOP LOADING
    }
  };

  /* ================= UI ================= */
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.checklistContainer}>
        <Spacer size="lg" />
        <Spacer size="lg" />

        <ScrollView showsVerticalScrollIndicator={false}>
          <Text style={styles.checklistMainTitle}>
            Just one more click away
          </Text>
          <Text style={styles.checklistMainTitle}>to get started</Text>
          <Text style={styles.checklistSubtitle}>
            Your final steps to process orders today!
          </Text>

          <ChecklistItem
            iconSource={Icons.branch}
            text="Add a branch"
            completed={completionStatus.completeProfile}
            onPress={() => handleGroupPress("/superForm2/profile")}
          />

          <Spacer size="lg" />

          <ChecklistItem
            iconSource={Icons.operation}
            text="Set up your operations"
            completed={completionStatus.setupOperations}
            onPress={() => handleGroupPress("/superForm2/operations")}
          />

          <Spacer size="lg" />

          <ChecklistItem
            iconSource={Icons.business}
            text="Verify your business"
            completed={completionStatus.verifyBusiness}
            onPress={() => handleGroupPress("/superForm2/business-documents")}
          />

          <Spacer size="lg" />

          <ChecklistItem
            iconSource={Icons.payment}
            text="Set up Payments"
            completed={completionStatus.setupPayments}
            onPress={() => handleGroupPress("/superForm2/payments")}
          />

          <View style={{ marginTop: 24 }}>
            <Text style={styles.checklistSubtitle}>
              {completedCount} of 4 groups completed
            </Text>
          </View>

          <View style={{ height: 20 }} />
        </ScrollView>

        {/* BUTTON */}
        <TouchableOpacity
          style={
            isAllComplete ? styles.beginOrderBtn : styles.beginOrderBtnDisabled
          }
          onPress={handlePhase2Submit}
          disabled={!isAllComplete || isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.beginOrderBtnText}>
              {isAllComplete
                ? "Begin order handling"
                : `Complete ${4 - completedCount} more ${
                    4 - completedCount === 1 ? "group" : "groups"
                  }`}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default ChecklistPage;
