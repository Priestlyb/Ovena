import React, { useEffect, useState } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  StyleSheet,
} from "react-native";

import { useTheme, ThemeColors } from "@/constants/theme";

import type {
  RatingPayload,
  BranchComplaintType,
  DriverComplaintType,
} from "@/hooks/ratings/useRateOrder";

type RatingData = Omit<RatingPayload, "order_id">;

interface RatingModalProps {
  visible: boolean;
  loading?: boolean;
  showDriverRating?: boolean;

  onClose: () => void;
  onSubmit: (data: RatingData) => void;
}

const STAR_COUNT = 5;

const branchComplaints = [
  { label: "Cold food", value: "COLD_FOOD" as BranchComplaintType },
  {
    label: "Unhygienic / Dirty environment",
    value: "DIRTY_ENVIRONMENT" as BranchComplaintType,
  },
  { label: "Wrong order", value: "WRONG_ORDER" as BranchComplaintType },
  {
    label: "Slow service / Delayed preparation",
    value: "DELAYED_PREPARATION" as BranchComplaintType,
  },
  { label: "Rude staff", value: "RUDE_STAFF" as BranchComplaintType },
  { label: "Other", value: "OTHER" as BranchComplaintType },
];

const driverComplaints = [
  { label: "Late delivery", value: "LATE_DELIVERY" as DriverComplaintType },
  { label: "Rude driver", value: "RUDE_DRIVER" as DriverComplaintType },
  { label: "Unsafe driving", value: "UNSAFE_DRIVING" as DriverComplaintType },
  {
    label: "Went to wrong address",
    value: "WRONG_ADDRESS" as DriverComplaintType,
  },
  { label: "Other", value: "OTHER" as DriverComplaintType },
];

export default function RatingModal({
  visible,
  loading = false,
  showDriverRating = false,
  onClose,
  onSubmit,
}: RatingModalProps) {
  const theme = useTheme();
  const styles = createStyles(theme);

  const [branchStars, setBranchStars] = useState(5);
  const [branchReview, setBranchReview] = useState("");

  const [driverStars, setDriverStars] = useState(5);
  const [driverReview, setDriverReview] = useState("");

  const [branchComplaint, setBranchComplaint] = useState<BranchComplaintType>();

  const [driverComplaint, setDriverComplaint] = useState<DriverComplaintType>();

  useEffect(() => {
    if (!visible) {
      setBranchStars(5);
      setBranchReview("");
      setBranchComplaint(undefined);
      setDriverComplaint(undefined);
      setDriverStars(5);
      setDriverReview("");
    }
  }, [visible]);

  const renderStars = (value: number, onChange: (rating: number) => void) => (
    <View style={styles.starRow}>
      {Array.from({ length: STAR_COUNT }).map((_, i) => {
        const star = i + 1;

        return (
          <TouchableOpacity
            key={star}
            onPress={() => onChange(star)}
            style={styles.starButton}
          >
            <Text style={[styles.star, star <= value && styles.starActive]}>
              ★
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={styles.title}>Rate your order</Text>

            <Text style={styles.section}>Restaurant</Text>

            {renderStars(branchStars, setBranchStars)}

            <TextInput
              placeholder="Write a review..."
              placeholderTextColor={theme.textSecondary}
              multiline
              value={branchReview}
              onChangeText={setBranchReview}
              maxLength={225}
              style={styles.textArea}
            />

            <Text style={styles.characterCount}>{branchReview.length}/225</Text>

            <Text style={styles.label}>Complaint (optional)</Text>

            <View style={styles.complaintContainer}>
              {branchComplaints.map((item) => (
                <TouchableOpacity
                  key={item.value}
                  style={[
                    styles.chip,
                    branchComplaint === item.value && styles.activeChip,
                  ]}
                  onPress={() => setBranchComplaint(item.value)}
                >
                  <Text
                    style={[
                      styles.chipText,
                      branchComplaint === item.value && styles.activeChipText,
                    ]}
                  >
                    {item.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {showDriverRating && (
              <>
                <Text style={styles.section}>Driver</Text>

                {renderStars(driverStars, setDriverStars)}

                <TextInput
                  placeholder="Review the driver..."
                  placeholderTextColor={theme.textSecondary}
                  multiline
                  value={driverReview}
                  onChangeText={setDriverReview}
                  maxLength={225}
                  style={styles.textArea}
                />

                <Text style={styles.characterCount}>
                  {driverReview.length}/225
                </Text>

                <Text style={styles.label}>Complaint (optional)</Text>

                <View style={styles.complaintContainer}>
                  {driverComplaints.map((item) => (
                    <TouchableOpacity
                      key={item.value}
                      style={[
                        styles.chip,
                        driverComplaint === item.value && styles.activeChip,
                      ]}
                      onPress={() => setDriverComplaint(item.value)}
                    >
                      <Text
                        style={[
                          styles.chipText,
                          driverComplaint === item.value &&
                            styles.activeChipText,
                        ]}
                      >
                        {item.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </>
            )}

            <View style={styles.footer}>
              <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                disabled={loading}
                style={styles.submitButton}
                onPress={() =>
                  onSubmit({
                    branch: {
                      stars: branchStars,
                      review: branchReview,
                      complaint_type: branchComplaint || undefined,
                    },
                    ...(showDriverRating && {
                      driver: {
                        stars: driverStars,
                        review: driverReview,
                        complaint_type: driverComplaint || undefined,
                      },
                    }),
                  })
                }
              >
                <Text style={styles.submitText}>
                  {loading ? "Submitting..." : "Submit"}
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const createStyles = (theme: ThemeColors) =>
  StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: "rgba(0,0,0,.45)",
      justifyContent: "flex-end",
    },

    container: {
      backgroundColor: theme.background,
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      padding: 20,
      maxHeight: "90%",
    },

    title: {
      fontSize: 22,
      fontWeight: "700",
      marginBottom: 20,
      color: theme.textPrimary,
    },

    section: {
      fontSize: 17,
      fontWeight: "600",
      marginBottom: 10,
      color: theme.textPrimary,
    },

    starRow: {
      flexDirection: "row",
      marginBottom: 16,
    },

    starButton: {
      marginRight: 8,
    },

    star: {
      fontSize: 34,
      color: theme.border,
    },

    starActive: {
      color: theme.warning,
    },

    textArea: {
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: 12,
      minHeight: 100,
      padding: 12,
      textAlignVertical: "top",
      marginBottom: 16,
      backgroundColor: theme.surface,
      color: theme.textPrimary,
    },

    characterCount: {
      alignSelf: "flex-end",
      marginTop: -10,
      marginBottom: 16,
      fontSize: 12,
      color: theme.textSecondary,
    },

    label: {
      fontWeight: "600",
      marginBottom: 10,
      color: theme.textPrimary,
    },

    complaintContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
      marginBottom: 20,
    },

    chip: {
      paddingHorizontal: 14,
      paddingVertical: 8,
      borderRadius: 100,
      backgroundColor: theme.surface,
      marginRight: 8,
      marginBottom: 8,
    },

    activeChip: {
      backgroundColor: theme.primary,
    },

    chipText: {
      color: theme.textSecondary,
    },

    activeChipText: {
      color: theme.background,
      fontWeight: "600",
    },

    footer: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop: 10,
    },

    cancelButton: {
      flex: 1,
      alignItems: "center",
      padding: 14,
      marginRight: 10,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme.border,
      backgroundColor: theme.surface,
    },

    cancelText: {
      color: theme.textPrimary,
      fontWeight: "600",
    },

    submitButton: {
      flex: 1,
      backgroundColor: theme.primary,
      alignItems: "center",
      padding: 14,
      borderRadius: 12,
    },

    submitText: {
      color: theme.background,
      fontWeight: "700",
    },
  });
