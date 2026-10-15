import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";

import { styles } from "@/constants/styles/PaymentMethodScreen.styles";
import { useOrderPayment } from "@/hooks/orders/useOrderPayment";
import { useTheme } from "@/constants/theme";
import { IconSymbol } from "@/components/ui/icon-symbol";
import FeedbackModal from "@/components/FeedbackModal";

type PaymentMethod = "points" | "paystack";

const PaymentMethodScreen = () => {
  const router = useRouter();

  const { orderId, branchId, businessId } = useLocalSearchParams<{
    orderId: string;
    branchId?: string;
    businessId?: string;
  }>();

  const theme = useTheme();

  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>("points");

  const [feedback, setFeedback] = useState<{
    visible: boolean;
    title?: string;
    message: string;
    variant: "success" | "error" | "warning" | "info";
  }>({
    visible: false,
    message: "",
    variant: "info",
  });

  const { mutate: makePayment, isPending } = useOrderPayment();

  const showFeedback = (
    message: string,
    variant: "success" | "error" | "warning" | "info",
    title?: string,
  ) => {
    setFeedback({
      visible: true,
      message,
      variant,
      title,
    });
  };

  const handlePayment = () => {
    if (!orderId) {
      showFeedback("Order ID is missing.", "error", "Payment Error");

      return;
    }

    makePayment(
      {
        orderId,
        method: selectedMethod,
      },
      {
        onSuccess: (data) => {
          //console.log("ORDER PAYMENT RESPONSE:", data);

          // =====================================
          // PAYSTACK
          // =====================================

          if (selectedMethod === "paystack") {
            //console.log("Paystack payment response:", data);

            if (!data?.payment_url) {
              showFeedback(
                "Payment was initialized, but the Paystack payment URL is unavailable.",
                "error",
                "Payment Error",
              );

              return;
            }

            router.push({
              pathname: "/screens/PaymentScreen",
              params: {
                orderId: String(data.order_id ?? orderId),
                paymentUrl: String(data.payment_url),
                branchId: String(branchId ?? ""),
                businessId: String(businessId ?? ""),
              },
            });

            return;
          }

          // =====================================
          // POINTS
          // =====================================

          showFeedback(
            "Your order has been paid for with points.",
            "success",
            "Payment Successful",
          );
        },

        onError: (error: any) => {
          console.log(
            "ORDER PAYMENT ERROR:",
            error?.response?.data || error?.message,
          );

          const message =
            error?.response?.data?.message ||
            error?.response?.data?.detail ||
            error?.message ||
            "Something went wrong while processing your payment.";

          showFeedback(message, "error", "Payment Failed");
        },
      },
    );
  };

  const paymentOptions = [
    {
      id: "points" as PaymentMethod,
      title: "Pay with Points",
      description: "Use your available points to pay for this order.",
      icon: "CoinsIcon" as const,
    },
    {
      id: "paystack" as PaymentMethod,
      title: "Pay with Paystack",
      description: "Pay securely using your card or other Paystack options.",
      icon: "CreditCardIcon" as const,
    },
  ];

  return (
    <SafeAreaView
      style={[
        styles.container,
        {
          backgroundColor: theme.background,
        },
      ]}
    >
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={[
            styles.backButton,
            {
              backgroundColor: theme.surface,
            },
          ]}
        >
          <IconSymbol
            name="ArrowLeftIcon"
            size={22}
            color={theme.textPrimary}
          />
        </TouchableOpacity>

        <Text
          style={[
            styles.headerTitle,
            {
              color: theme.textPrimary,
            },
          ]}
        >
          Payment Method
        </Text>

        <View style={styles.headerSpacer} />
      </View>

      {/* CONTENT */}
      <View style={styles.content}>
        <Text
          style={[
            styles.title,
            {
              color: theme.textPrimary,
            },
          ]}
        >
          Choose how you'd like to pay
        </Text>

        <Text
          style={[
            styles.subtitle,
            {
              color: theme.textSecondary,
            },
          ]}
        >
          Select a payment method to continue with your order.
        </Text>

        {/* PAYMENT OPTIONS */}
        <View style={styles.optionsContainer}>
          {paymentOptions.map((option) => {
            const isSelected = selectedMethod === option.id;

            return (
              <TouchableOpacity
                key={option.id}
                activeOpacity={0.8}
                onPress={() => setSelectedMethod(option.id)}
                style={[
                  styles.paymentCard,
                  {
                    backgroundColor: theme.surface,
                    borderColor: isSelected ? theme.primary : theme.border,
                  },
                  isSelected && styles.selectedCard,
                ]}
              >
                {/* PAYMENT ICON */}
                <View
                  style={[
                    styles.iconContainer,
                    {
                      backgroundColor: isSelected
                        ? theme.decorCircle
                        : theme.background,
                    },
                  ]}
                >
                  <IconSymbol
                    name={option.icon}
                    size={25}
                    color={isSelected ? theme.primary : theme.textSecondary}
                  />
                </View>

                {/* PAYMENT INFORMATION */}
                <View style={styles.paymentInfo}>
                  <Text
                    style={[
                      styles.paymentTitle,
                      {
                        color: theme.textPrimary,
                      },
                    ]}
                  >
                    {option.title}
                  </Text>

                  <Text
                    style={[
                      styles.paymentDescription,
                      {
                        color: theme.textSecondary,
                      },
                    ]}
                  >
                    {option.description}
                  </Text>
                </View>

                {/* RADIO BUTTON */}
                <View
                  style={[
                    styles.radio,
                    {
                      borderColor: isSelected ? theme.primary : theme.border,
                    },
                  ]}
                >
                  {isSelected && (
                    <View
                      style={[
                        styles.radioInner,
                        {
                          backgroundColor: theme.primary,
                        },
                      ]}
                    >
                      <IconSymbol
                        name="CheckIcon"
                        size={12}
                        color={theme.background}
                      />
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* CONTINUE BUTTON */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={handlePayment}
          disabled={isPending}
          style={[
            styles.continueButton,
            {
              backgroundColor: theme.primary,
              opacity: isPending ? 0.7 : 1,
            },
          ]}
        >
          {isPending ? (
            <ActivityIndicator color={theme.icon} />
          ) : (
            <Text style={[styles.continueText]}>
              Continue with{" "}
              {selectedMethod === "points" ? "Points" : "Paystack"}
            </Text>
          )}
        </TouchableOpacity>
      </View>

      {/* FEEDBACK MODAL */}
      <FeedbackModal
        visible={feedback.visible}
        title={feedback.title}
        message={feedback.message}
        variant={feedback.variant}
        onClose={() =>
          setFeedback((prev) => ({
            ...prev,
            visible: false,
          }))
        }
      />
    </SafeAreaView>
  );
};

export default PaymentMethodScreen;
