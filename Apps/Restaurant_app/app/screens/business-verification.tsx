/**
 * -----------------------------------------------------------------------------
 * File: src/app/business-verification.tsx
 * -----------------------------------------------------------------------------
 * Brika Business Verification Status
 *
 * Displays the authenticated business verification status using:
 *
 * GET /api/verify/business/status/
 *
 * API Response:
 * {
 *   "success": true,
 *   "data": {
 *     "is_onboarding_complete": false,
 *     "needs_manual_review": true,
 *     "checked": false,
 *     "review_days": 4,
 *     "verifications": {
 *       "tin": "success",
 *       "rc": "success",
 *       "bvn": "failed"
 *     },
 *     "can_retry": false,
 *     "approved": false
 *   }
 * }
 * -----------------------------------------------------------------------------
 */

import { useRouter } from "expo-router";
import {
    Check,
    CheckCircle2,
    Clock3,
    Info,
    RefreshCw,
    ShieldCheck,
    XCircle,
} from "lucide-react-native";
import React, { useEffect } from "react";
import {
    ActivityIndicator,
    RefreshControl,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import Animated, {
    Easing,
    FadeIn,
    FadeInDown,
    FadeInUp,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withSequence,
    withTiming,
} from "react-native-reanimated";

import { styles } from "@/constants/styles/businessVerification.styles";
import { useBusinessVerificationStatus } from "@/hooks/onboarding/useBusinessVerificationStatus";

/**
 * -----------------------------------------------------------------------------
 * Types
 * -----------------------------------------------------------------------------
 */

type VerificationStatus = "success" | "failed" | "pending" | "unknown";

interface VerificationData {
  is_onboarding_complete: boolean;
  needs_manual_review: boolean;
  checked: boolean;
  review_days: number;
  verifications: {
    tin: VerificationStatus;
    rc: VerificationStatus;
    bvn: VerificationStatus;
  };
  can_retry: boolean;
  approved: boolean;
}

interface VerificationResponse {
  success: boolean;
  data: VerificationData;
}

/**
 * -----------------------------------------------------------------------------
 * Verification Status Helper
 * -----------------------------------------------------------------------------
 */

const getVerificationLabel = (status: VerificationStatus) => {
  switch (status) {
    case "success":
      return "Verified";

    case "failed":
      return "Failed";

    case "pending":
      return "Pending";

    default:
      return "Not Checked";
  }
};

/**
 * -----------------------------------------------------------------------------
 * Verification Status Icon
 * -----------------------------------------------------------------------------
 */

const VerificationStatusIcon = ({ status }: { status: VerificationStatus }) => {
  if (status === "success") {
    return <Check size={16} color="#FFFFFF" strokeWidth={3} />;
  }

  if (status === "failed") {
    return <XCircle size={17} color="#DC2626" strokeWidth={2.5} />;
  }

  return <Clock3 size={17} color="#FF5920" strokeWidth={2.5} />;
};

/**
 * -----------------------------------------------------------------------------
 * Verification Item
 * -----------------------------------------------------------------------------
 */

interface VerificationItemProps {
  title: string;
  description: string;
  status: VerificationStatus;
}

const VerificationItem = ({
  title,
  description,
  status,
}: VerificationItemProps) => {
  const isSuccess = status === "success";
  const isFailed = status === "failed";

  return (
    <View style={styles.verificationItem}>
      <View
        style={[
          styles.verificationStatusIcon,
          isSuccess && styles.verificationStatusSuccess,
          isFailed && styles.verificationStatusFailed,
          status === "pending" && styles.verificationStatusPending,
        ]}
      >
        <VerificationStatusIcon status={status} />
      </View>

      <View style={styles.verificationItemContent}>
        <Text style={styles.verificationItemTitle}>{title}</Text>

        <Text style={styles.verificationItemDescription}>{description}</Text>
      </View>

      <View
        style={[
          styles.verificationBadge,
          isSuccess && styles.verificationBadgeSuccess,
          isFailed && styles.verificationBadgeFailed,
          status === "pending" && styles.verificationBadgePending,
        ]}
      >
        <Text
          style={[
            styles.verificationBadgeText,
            isSuccess && styles.verificationBadgeTextSuccess,
            isFailed && styles.verificationBadgeTextFailed,
            status === "pending" && styles.verificationBadgeTextPending,
          ]}
        >
          {getVerificationLabel(status)}
        </Text>
      </View>
    </View>
  );
};

/**
 * -----------------------------------------------------------------------------
 * Component
 * -----------------------------------------------------------------------------
 */

export default function BusinessVerificationScreen() {
  const router = useRouter();

  const { verificationStatus, isLoading, isFetching, isError, error, refetch } =
    useBusinessVerificationStatus();

  /**
   * -------------------------------------------------------------------------
   * Animation
   * -------------------------------------------------------------------------
   */

  const pulse = useSharedValue(1);

  useEffect(() => {
    pulse.value = withRepeat(
      withSequence(
        withTiming(1.06, {
          duration: 1200,
          easing: Easing.inOut(Easing.ease),
        }),
        withTiming(1, {
          duration: 1200,
          easing: Easing.inOut(Easing.ease),
        }),
      ),
      -1,
      false,
    );
  }, [pulse]);

  /**
   * IMPORTANT:
   * Never use pulse.value directly inside JSX/render.
   *
   * This prevents:
   *
   * [Reanimated] Reading from `value` during component render
   */

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [
      {
        scale: pulse.value,
      },
    ],
  }));

  /**
   * -------------------------------------------------------------------------
   * Parse API Response
   * -------------------------------------------------------------------------
   */

  const apiResponse = verificationStatus as VerificationResponse | undefined;

  const data = apiResponse?.data;

  const verifications = data?.verifications;

  const tinStatus = verifications?.tin ?? "unknown";
  const rcStatus = verifications?.rc ?? "unknown";
  const bvnStatus = verifications?.bvn ?? "unknown";

  const needsManualReview = data?.needs_manual_review === true;

  const approved = data?.approved === true;

  const canRetry = data?.can_retry === true;

  const reviewDays =
    typeof data?.review_days === "number" ? data.review_days : 0;

  /**
   * -------------------------------------------------------------------------
   * Overall Status
   * -------------------------------------------------------------------------
   */

  let overallTitle = "Verification Pending";
  let overallDescription =
    "Your business verification is currently being processed.";

  let overallIcon = Clock3;
  let overallIconColor = "#FF5920";
  let overallIconBackground = "#FFF1EB";
  let overallBadgeText = "Pending";

  if (approved) {
    overallTitle = "Business Verified";
    overallDescription =
      "Your business has been successfully verified. You now have access to verified business features.";

    overallIcon = CheckCircle2;
    overallIconColor = "#159957";
    overallIconBackground = "#E8F7EF";
    overallBadgeText = "Verified";
  } else if (needsManualReview) {
    overallTitle = "Verification Requires Review";

    overallDescription =
      reviewDays > 0
        ? `Your submitted information requires manual review. Our team expects to complete the review within approximately ${reviewDays} days.`
        : "Your submitted information requires manual review by our team.";

    overallIcon = Clock3;
    overallIconColor = "#FF5920";
    overallIconBackground = "#FFF1EB";
    overallBadgeText = "Under Review";
  } else if (bvnStatus === "failed") {
    overallTitle = "Verification Unsuccessful";

    overallDescription =
      "Some verification checks were unsuccessful. Please review your submitted information.";

    overallIcon = XCircle;
    overallIconColor = "#DC2626";
    overallIconBackground = "#FEE2E2";
    overallBadgeText = "Action Required";
  }

  const OverallIcon = overallIcon;

  /**
   * -------------------------------------------------------------------------
   * Loading
   * -------------------------------------------------------------------------
   */

  if (isLoading) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <Animated.View
            entering={FadeIn.duration(500)}
            style={styles.loadingIcon}
          >
            <ActivityIndicator size="large" color="#FF5920" />
          </Animated.View>

          <Animated.Text
            entering={FadeInUp.delay(100).duration(500)}
            style={styles.loadingTitle}
          >
            Checking verification
          </Animated.Text>

          <Animated.Text
            entering={FadeInUp.delay(180).duration(500)}
            style={styles.loadingSubtitle}
          >
            We're checking your business verification status...
          </Animated.Text>
        </View>
      </View>
    );
  }

  /**
   * -------------------------------------------------------------------------
   * Error
   * -------------------------------------------------------------------------
   */

  if (isError) {
    return (
      <View style={styles.container}>
        <View style={styles.center}>
          <Animated.View
            entering={FadeIn.duration(500)}
            style={[styles.errorIcon, pulseStyle]}
          >
            <XCircle size={34} color="#DC2626" />
          </Animated.View>

          <Animated.Text
            entering={FadeInUp.delay(100)}
            style={styles.errorTitle}
          >
            Unable to check status
          </Animated.Text>

          <Animated.Text
            entering={FadeInUp.delay(180)}
            style={styles.errorDescription}
          >
            Something went wrong while checking your business verification.
          </Animated.Text>

          <Animated.View entering={FadeInUp.delay(260)}>
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => refetch()}
              style={styles.retryButton}
            >
              <RefreshCw size={18} color="#FFFFFF" />

              <Text style={styles.retryButtonText}>Try Again</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </View>
    );
  }

  /**
   * -------------------------------------------------------------------------
   * Main UI
   * -------------------------------------------------------------------------
   */

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={isFetching && !isLoading}
            onRefresh={() => refetch()}
            tintColor="#FF5920"
          />
        }
      >
        {/* ------------------------------------------------------------- */}
        {/* Header                                                        */}
        {/* ------------------------------------------------------------- */}

        <Animated.View
          entering={FadeInDown.duration(550)}
          style={styles.header}
        >
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerTitle}>Verification</Text>

            <Text style={styles.headerSubtitle}>
              Business verification status
            </Text>
          </View>

          <TouchableOpacity activeOpacity={0.7} style={styles.refreshButton}>
            <RefreshCw size={19} color="#111827" />
          </TouchableOpacity>
        </Animated.View>

        {/* ------------------------------------------------------------- */}
        {/* Hero Card                                                     */}
        {/* ------------------------------------------------------------- */}

        <Animated.View
          entering={FadeInUp.delay(100).duration(650)}
          style={styles.heroCard}
        >
          <View
            style={[
              styles.heroGlow,
              {
                backgroundColor: overallIconBackground,
              },
            ]}
          />

          <Animated.View
            style={[
              styles.statusIconOuter,
              {
                backgroundColor: overallIconBackground,
              },
              pulseStyle,
            ]}
          >
            <View
              style={[
                styles.statusIconInner,
                {
                  backgroundColor: overallIconBackground,
                },
              ]}
            >
              <OverallIcon size={42} color={overallIconColor} strokeWidth={2} />
            </View>
          </Animated.View>

          <View
            style={[
              styles.statusBadge,
              {
                backgroundColor: overallIconBackground,
              },
            ]}
          >
            <View
              style={[
                styles.statusDot,
                {
                  backgroundColor: overallIconColor,
                },
              ]}
            />

            <Text
              style={[
                styles.statusBadgeText,
                {
                  color: overallIconColor,
                },
              ]}
            >
              {overallBadgeText}
            </Text>
          </View>

          <Text style={styles.heroTitle}>{overallTitle}</Text>

          <Text style={styles.heroDescription}>{overallDescription}</Text>

          {needsManualReview && reviewDays > 0 && (
            <View style={styles.reviewTimeCard}>
              <Clock3 size={17} color="#FF5920" />

              <View style={styles.reviewTimeContent}>
                <Text style={styles.reviewTimeLabel}>
                  ESTIMATED REVIEW TIME
                </Text>

                <Text style={styles.reviewTimeValue}>
                  Approximately {reviewDays} days
                </Text>
              </View>
            </View>
          )}
        </Animated.View>

        {/* ------------------------------------------------------------- */}
        {/* Verification Checks                                           */}
        {/* ------------------------------------------------------------- */}

        <Animated.View
          entering={FadeInUp.delay(180).duration(550)}
          style={styles.section}
        >
          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.sectionTitle}>Verification checks</Text>

              <Text style={styles.sectionSubtitle}>
                Status of your submitted verification details
              </Text>
            </View>
          </View>

          <View style={styles.verificationCard}>
            <VerificationItem
              title="TIN"
              description="Tax Identification Number"
              status={tinStatus}
            />

            <View style={styles.itemDivider} />

            <VerificationItem
              title="RC Number"
              description="Business registration"
              status={rcStatus}
            />

            <View style={styles.itemDivider} />

            <VerificationItem
              title="BVN"
              description="Bank Verification Number"
              status={bvnStatus}
            />
          </View>
        </Animated.View>

        {/* ------------------------------------------------------------- */}
        {/* Review Information                                             */}
        {/* ------------------------------------------------------------- */}

        {needsManualReview && (
          <Animated.View
            entering={FadeInUp.delay(260).duration(550)}
            style={styles.section}
          >
            <Text style={styles.sectionTitle}>What happens next?</Text>

            <View style={styles.explanationCard}>
              <View style={styles.explanationIcon}>
                <ShieldCheck size={21} color="#FF5920" />
              </View>

              <View style={styles.explanationContent}>
                <Text style={styles.explanationTitle}>Manual review</Text>

                <Text style={styles.explanationText}>
                  Your verification details have been submitted and require
                  additional review. You don't need to submit another request
                  while the review is in progress.
                </Text>
              </View>
            </View>
          </Animated.View>
        )}

        {/* ------------------------------------------------------------- */}
        {/* Verification Summary                                           */}
        {/* ------------------------------------------------------------- */}

        <Animated.View
          entering={FadeInUp.delay(340).duration(550)}
          style={styles.section}
        >
          <Text style={styles.sectionTitle}>Verification summary</Text>

          <View style={styles.summaryCard}>
            <SummaryRow
              label="TIN"
              value={getVerificationLabel(tinStatus)}
              success={tinStatus === "success"}
            />

            <SummaryRow
              label="RC Number"
              value={getVerificationLabel(rcStatus)}
              success={rcStatus === "success"}
            />

            <SummaryRow
              label="BVN"
              value={getVerificationLabel(bvnStatus)}
              success={bvnStatus === "success"}
            />

            <SummaryRow
              label="Onboarding"
              value={data?.is_onboarding_complete ? "Complete" : "Incomplete"}
              success={data?.is_onboarding_complete === true}
            />

            <SummaryRow
              label="Application checked"
              value={data?.checked ? "Yes" : "Pending"}
              success={data?.checked === true}
            />
          </View>
        </Animated.View>

        {/* ------------------------------------------------------------- */}
        {/* Retry Information                                              */}
        {/* ------------------------------------------------------------- */}

        {bvnStatus === "failed" && !canRetry && (
          <Animated.View
            entering={FadeInUp.delay(400).duration(550)}
            style={styles.noticeCard}
          >
            <Info size={19} color="#B45309" />

            <Text style={styles.noticeText}>
              Your BVN verification cannot be retried at this time. Please wait
              for the current review process to be completed.
            </Text>
          </Animated.View>
        )}

        {/* ------------------------------------------------------------- */}
        {/* API Error                                                      */}
        {/* ------------------------------------------------------------- */}

        {error && (
          <Animated.View
            entering={FadeInUp.duration(400)}
            style={styles.errorCard}
          >
            <Info size={18} color="#B91C1C" />

            <Text style={styles.errorText}>
              {error instanceof Error
                ? error.message
                : "Unable to retrieve verification details."}
            </Text>
          </Animated.View>
        )}

        {/* ------------------------------------------------------------- */}
        {/* Refresh                                                        */}
        {/* ------------------------------------------------------------- */}

        <Animated.View entering={FadeInUp.delay(460).duration(550)}>
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => refetch()}
            disabled={isFetching}
            style={[styles.button, isFetching && styles.buttonDisabled]}
          >
            {isFetching ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <RefreshCw size={18} color="#FFFFFF" />
            )}

            <Text style={styles.buttonText}>
              {isFetching ? "Checking status..." : "Refresh status"}
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

/**
 * -----------------------------------------------------------------------------
 * Summary Row
 * -----------------------------------------------------------------------------
 */

interface SummaryRowProps {
  label: string;
  value: string;
  success: boolean;
}

const SummaryRow = ({ label, value, success }: SummaryRowProps) => {
  return (
    <View style={styles.summaryRow}>
      <Text style={styles.summaryLabel}>{label}</Text>

      <View
        style={[
          styles.summaryStatus,
          success ? styles.summaryStatusSuccess : styles.summaryStatusNeutral,
        ]}
      >
        {success && <Check size={13} color="#159957" strokeWidth={3} />}

        <Text
          style={[
            styles.summaryStatusText,
            success
              ? styles.summaryStatusTextSuccess
              : styles.summaryStatusTextNeutral,
          ]}
        >
          {value}
        </Text>
      </View>
    </View>
  );
};
