import { usePhase2 } from "@/app/context/Phase2Context";
import { Spacer } from "@/components/atoms/Spacer";
import { ChecklistItem } from "@/components/CheckListItem";
import FeedbackModal from "@/components/FeedbackModal";
import { Icons } from "@/constants/checklistIcons";
import { styles } from "@/constants/styles";
import usePhase2Submit from "@/hooks/onboarding/usePhase2Submit";
import { router } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const ChecklistPage = () => {
  const { phase2Data } = usePhase2();

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

  const {
    isSubmitting,
    feedbackVisible,
    feedbackMessage,
    setFeedbackVisible,
    handlePhase2Submit,
  } = usePhase2Submit({
    phase2Data,
    isAllComplete,
  });

  const handleGroupPress = (route: string) => {
    router.push(route as any);
  };

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

        <FeedbackModal
          visible={feedbackVisible}
          variant="warning"
          title="Missing Delivery Method"
          message={feedbackMessage}
          actionLabel="Go to Operations"
          onAction={() => router.push("/superForm2/operations")}
          onClose={() => setFeedbackVisible(false)}
        />
      </View>
    </SafeAreaView>
  );
};

export default ChecklistPage;
