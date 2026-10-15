import React from "react";
import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { useLocalSearchParams, useRouter } from "expo-router";

import { ThemeColors, useTheme } from "@/constants/theme";
import { useColorScheme } from "react-native";
import { useBusinessDetail } from "@/hooks/useBusinessDetail";
import { IconSymbol } from "@/components/ui/icon-symbol";

export default function BusinessInformation() {
  const router = useRouter();

  const colorScheme = useColorScheme();
  const colors = useTheme();

  const { branchId } = useLocalSearchParams<{
    branchId: string;
  }>();

  /* =========================================
     NO BRANCH ID
  ========================================= */

  if (!branchId) {
    return (
      <>
        <StatusBar
          barStyle={colorScheme === "dark" ? "light-content" : "dark-content"}
        />

        <SafeAreaView
          style={[
            styles.center,
            {
              backgroundColor: colors.background,
            },
          ]}
        >
          <View
            style={[
              styles.emptyIcon,
              {
                backgroundColor: colors.surface,
              },
            ]}
          >
            <IconSymbol
              name="InfoCircleIcon"
              size={38}
              color={colors.primary}
            />
          </View>

          <Text
            style={[
              styles.emptyTitle,
              {
                color: colors.textPrimary,
              },
            ]}
          >
            Branch not found
          </Text>

          <Text
            style={[
              styles.emptySubtitle,
              {
                color: colors.textSecondary,
              },
            ]}
          >
            We couldn't determine which business branch you wanted to view.
          </Text>

          <TouchableOpacity
            style={[
              styles.primaryButton,
              {
                backgroundColor: colors.primary,
              },
            ]}
            onPress={() => router.back()}
          >
            <Text style={styles.primaryButtonText}>Go Back</Text>
          </TouchableOpacity>
        </SafeAreaView>
      </>
    );
  }

  const numericBranchId = Number(branchId);

  const { data, isLoading, isError } = useBusinessDetail(numericBranchId);

  /* =========================================
     LOADING
  ========================================= */

  if (isLoading) {
    return (
      <>
        <StatusBar
          barStyle={colorScheme === "dark" ? "light-content" : "dark-content"}
        />

        <SafeAreaView
          style={[
            styles.center,
            {
              backgroundColor: colors.background,
            },
          ]}
        >
          <View style={styles.loaderCircle}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        </SafeAreaView>
      </>
    );
  }

  /* =========================================
     ERROR
  ========================================= */

  if (isError || !data) {
    return (
      <>
        <StatusBar
          barStyle={colorScheme === "dark" ? "light-content" : "dark-content"}
        />

        <SafeAreaView
          style={[
            styles.center,
            {
              backgroundColor: colors.background,
            },
          ]}
        >
          <View
            style={[
              styles.errorCircle,
              {
                backgroundColor: `${colors.error}15`,
              },
            ]}
          >
            <IconSymbol name="InfoCircleIcon" size={38} color={colors.error} />
          </View>

          <Text
            style={[
              styles.errorTitle,
              {
                color: colors.textPrimary,
              },
            ]}
          >
            Something went wrong
          </Text>

          <Text
            style={[
              styles.errorSubtitle,
              {
                color: colors.textSecondary,
              },
            ]}
          >
            We couldn't load this business information right now.
          </Text>

          <TouchableOpacity
            style={[
              styles.primaryButton,
              {
                backgroundColor: colors.primary,
              },
            ]}
            onPress={() => router.back()}
          >
            <Text style={styles.primaryButtonText}>Go Back</Text>
          </TouchableOpacity>
        </SafeAreaView>
      </>
    );
  }

  /* =========================================
     CONTENT
  ========================================= */

  return (
    <>
      <StatusBar
        barStyle={colorScheme === "dark" ? "light-content" : "dark-content"}
      />

      <SafeAreaView
        style={[
          styles.safeArea,
          {
            backgroundColor: colors.background,
          },
        ]}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.container}
        >
          {/* ============================
              HEADER
          ============================ */}

          <View style={styles.header}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => router.back()}
              style={[
                styles.backButton,
                {
                  backgroundColor: colors.surface,
                },
              ]}
            >
              <IconSymbol
                name="ArrowLeftIcon"
                size={20}
                color={colors.textPrimary}
              />
            </TouchableOpacity>

            <View style={styles.headerTextContainer}>
              <Text
                style={[
                  styles.headerTitle,
                  {
                    color: colors.textPrimary,
                  },
                ]}
              >
                Business Information
              </Text>

              <Text
                style={[
                  styles.headerSubtitle,
                  {
                    color: colors.textSecondary,
                  },
                ]}
              >
                Everything you need to know about this branch.
              </Text>
            </View>
          </View>

          {/* ============================
              SUMMARY CARD
          ============================ */}

          <View
            style={[
              styles.summaryCard,
              {
                backgroundColor: colors.primary,
              },
            ]}
          >
            <View style={styles.summaryTopRow}>
              <View
                style={[
                  styles.summaryIconContainer,
                  {
                    backgroundColor: "rgba(255,255,255,0.15)",
                  },
                ]}
              >
                <IconSymbol name="StoreIcon" size={28} color="#FFFFFF" />
              </View>

              <View style={styles.summaryContent}>
                {/* <Text style={styles.summarySubtitle}>Branch #{data.id}</Text> */}

                <Text style={styles.summaryTitle}>
                  {data.delivery_method
                    ? `${data.delivery_method.charAt(0).toUpperCase()}${data.delivery_method.slice(
                        1,
                      )} Delivery`
                    : "Business Branch"}
                </Text>
              </View>
            </View>

            <View style={styles.summaryDivider} />

            <View style={styles.summaryStats}>
              <View style={styles.summaryStat}>
                <Text style={styles.summaryStatLabel}>Business Phone</Text>

                <Text style={styles.summaryStatValue}>
                  {data.business_phone_number || "Not available"}
                </Text>
              </View>

              <View style={styles.summaryStat}>
                <Text style={styles.summaryStatLabel}>Branch Contact</Text>

                <Text style={styles.summaryStatValue}>
                  {data.branch_contact || "Not available"}
                </Text>
              </View>
            </View>
          </View>

          {/* ============================
              BUSINESS DETAILS
          ============================ */}

          <View style={styles.section}>
            <Text
              style={[
                styles.sectionTitle,
                {
                  color: colors.textPrimary,
                },
              ]}
            >
              Business Details
            </Text>

            <InfoCard
              colors={colors}
              icon="MapPinIcon"
              title="Business Address"
              value={data.business_address || "Not available"}
            />

            <InfoCard
              colors={colors}
              icon="BusinessIcon"
              title="Branch Address"
              value={data.address || "Not available"}
            />
          </View>

          {/* ============================
              CONTACT
          ============================ */}

          <View style={styles.section}>
            <Text
              style={[
                styles.sectionTitle,
                {
                  color: colors.textPrimary,
                },
              ]}
            >
              Contact
            </Text>

            <InfoCard
              colors={colors}
              icon="AccountCardIcon"
              title="Business Phone"
              value={data.business_phone_number || "Not available"}
            />

            <InfoCard
              colors={colors}
              icon="AccountCardIcon"
              title="Branch Contact"
              value={data.branch_contact || "Not available"}
            />
          </View>

          {/* ============================
              DELIVERY
          ============================ */}

          <View style={styles.section}>
            <Text
              style={[
                styles.sectionTitle,
                {
                  color: colors.textPrimary,
                },
              ]}
            >
              Delivery
            </Text>

            <InfoCard
              colors={colors}
              icon="StoreClockIcon"
              title="Delivery Method"
              value={
                data.delivery_method
                  ? `${
                      data.delivery_method.charAt(0).toUpperCase() +
                      data.delivery_method.slice(1)
                    } Delivery`
                  : "Not available"
              }
            />
          </View>

          {/* ============================
              OPERATING HOURS
          ============================ */}

          <View style={styles.section}>
            <Text
              style={[
                styles.sectionTitle,
                {
                  color: colors.textPrimary,
                },
              ]}
            >
              Operating Hours
            </Text>

            {data.operating_hours?.length ? (
              data.operating_hours.map((hour: any, index: number) => (
                <InfoCard
                  key={index}
                  colors={colors}
                  icon="BusinessTimeIcon"
                  title={hour.name ?? `Day ${index + 1}`}
                  value={`${hour.open_time ?? "--"} - ${hour.close_time ?? "--"}`}
                />
              ))
            ) : (
              <InfoCard
                colors={colors}
                icon="BusinessTimeIcon"
                title="Operating Hours"
                value="No operating hours have been provided."
              />
            )}
          </View>

          {/* ============================
              RATINGS
          ============================ */}

          <View style={styles.section}>
            <Text
              style={[
                styles.sectionTitle,
                {
                  color: colors.textPrimary,
                },
              ]}
            >
              Rating Information
            </Text>

            <View
              style={[
                styles.ratingCard,
                {
                  backgroundColor: colors.surface,
                },
              ]}
            >
              <View style={styles.ratingHeader}>
                <View
                  style={[
                    styles.ratingIcon,
                    {
                      backgroundColor: `${colors.primary}15`,
                    },
                  ]}
                >
                  <IconSymbol
                    name="StarIcon"
                    size={22}
                    color={colors.primary}
                  />
                </View>

                <Text
                  style={[
                    styles.ratingTitle,
                    {
                      color: colors.textPrimary,
                    },
                  ]}
                >
                  How ratings are calculated
                </Text>
              </View>

              <Text
                style={[
                  styles.ratingDescription,
                  {
                    color: colors.textSecondary,
                  },
                ]}
              >
                {data.how_we_calculate_ratings ||
                  "No rating information available."}
              </Text>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

/* =========================================
   INFO CARD
========================================= */

type InfoCardProps = {
  colors: ThemeColors;
  icon: string;
  title: string;
  value: string;
};

function InfoCard({ colors, icon, title, value }: InfoCardProps) {
  return (
    <View
      style={[
        styles.infoCard,
        {
          backgroundColor: colors.surface,
        },
      ]}
    >
      <View
        style={[
          styles.infoIconContainer,
          {
            backgroundColor: `${colors.primary}15`,
          },
        ]}
      >
        <IconSymbol name={icon as any} size={20} color={colors.primary} />
      </View>

      <View style={styles.infoContent}>
        <Text
          style={[
            styles.infoTitle,
            {
              color: colors.textSecondary,
            },
          ]}
        >
          {title}
        </Text>

        <Text
          style={[
            styles.infoValue,
            {
              color: colors.textPrimary,
            },
          ]}
        >
          {value}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  /* =========================================
     LAYOUT
  ========================================= */

  safeArea: {
    flex: 1,
    paddingTop: 60,
  },

  container: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },

  section: {
    marginTop: 28,
  },

  /* =========================================
     CENTER STATES
  ========================================= */

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },

  /* =========================================
     LOADING
  ========================================= */

  loaderCircle: {
    justifyContent: "center",
    alignItems: "center",
  },

  /* =========================================
     EMPTY STATE
  ========================================= */

  emptyIcon: {
    width: 88,
    height: 88,
    borderRadius: 44,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 28,
  },

  emptyTitle: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 10,
  },

  emptySubtitle: {
    fontSize: 15,
    lineHeight: 22,
    textAlign: "center",
    marginBottom: 32,
    maxWidth: 280,
  },

  /* =========================================
     ERROR STATE
  ========================================= */

  errorCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 28,
  },

  errorTitle: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 10,
  },

  errorSubtitle: {
    fontSize: 15,
    lineHeight: 22,
    textAlign: "center",
    marginBottom: 32,
    maxWidth: 280,
  },

  /* =========================================
     BUTTONS
  ========================================= */

  primaryButton: {
    minWidth: 170,
    height: 52,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",

    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 12,
    shadowOffset: {
      width: 0,
      height: 6,
    },

    elevation: 5,
  },

  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },

  /* =========================================
     HEADER
  ========================================= */

  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 28,
  },

  backButton: {
    width: 46,
    height: 46,
    borderRadius: 23,
    justifyContent: "center",
    alignItems: "center",

    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: {
      width: 0,
      height: 2,
    },

    elevation: 2,
  },

  headerTextContainer: {
    flex: 1,
    marginLeft: 16,
  },

  headerTitle: {
    fontSize: 28,
    fontWeight: "700",
    letterSpacing: -0.5,
  },

  headerSubtitle: {
    marginTop: 4,
    fontSize: 15,
    lineHeight: 22,
  },

  /* =========================================
     SUMMARY CARD
  ========================================= */

  summaryCard: {
    borderRadius: 24,
    padding: 22,
    marginBottom: 8,

    shadowColor: "#000",
    shadowOpacity: 0.14,
    shadowRadius: 18,
    shadowOffset: {
      width: 0,
      height: 10,
    },

    elevation: 8,
  },

  summaryTopRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  summaryIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
  },

  summaryContent: {
    flex: 1,
    marginLeft: 16,
  },

  summaryTitle: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "700",
  },

  summarySubtitle: {
    color: "rgba(255,255,255,0.85)",
    fontSize: 15,
    marginTop: 4,
  },

  summaryDivider: {
    height: 1,
    backgroundColor: "rgba(255,255,255,0.18)",
    marginVertical: 20,
  },

  summaryStats: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  summaryStat: {
    flex: 1,
  },

  summaryStatLabel: {
    color: "rgba(255,255,255,0.75)",
    fontSize: 13,
    marginBottom: 6,
  },

  summaryStatValue: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    lineHeight: 22,
  },

  /* =========================================
     SECTION
  ========================================= */

  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 16,
    letterSpacing: -0.3,
  },

  /* =========================================
     INFO CARD
  ========================================= */

  infoCard: {
    flexDirection: "row",
    alignItems: "flex-start",

    padding: 18,
    marginBottom: 14,

    borderRadius: 18,

    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: {
      width: 0,
      height: 3,
    },

    elevation: 2,
  },

  infoIconContainer: {
    width: 46,
    height: 46,
    borderRadius: 23,

    justifyContent: "center",
    alignItems: "center",

    marginRight: 16,
  },

  infoContent: {
    flex: 1,
    justifyContent: "center",
  },

  infoTitle: {
    fontSize: 13,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 6,
  },

  infoValue: {
    fontSize: 16,
    fontWeight: "500",
    lineHeight: 24,
  },

  /* =========================================
     RATING CARD
  ========================================= */

  ratingCard: {
    borderRadius: 20,
    padding: 20,

    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: {
      width: 0,
      height: 3,
    },

    elevation: 2,
  },

  ratingHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },

  ratingIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,

    justifyContent: "center",
    alignItems: "center",

    marginRight: 14,
  },

  ratingTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: "700",
    lineHeight: 24,
  },

  ratingDescription: {
    fontSize: 15,
    lineHeight: 25,
  },

  /* =========================================
     TYPOGRAPHY HELPERS
  ========================================= */

  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 8,
  },

  cardSubtitle: {
    fontSize: 14,
    lineHeight: 22,
  },

  caption: {
    fontSize: 12,
    fontWeight: "500",
    letterSpacing: 0.5,
  },

  divider: {
    height: StyleSheet.hairlineWidth,
    marginVertical: 18,
    opacity: 0.15,
  },

  chip: {
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },

  chipText: {
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
});
