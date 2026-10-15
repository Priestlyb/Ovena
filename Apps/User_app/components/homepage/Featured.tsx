import React from "react";
import {
  Animated,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { useRouter } from "expo-router";

import { IconSymbol } from "@/components/ui/icon-symbol";
import { homepageStyles as styles } from "@/constants/styles/homepageStyles";
import { useTheme } from "@/constants/theme";

type FeaturedItem = {
  id: number | string;
  business_name?: string;
  business_type?: string;
  business_logo?: string | null;
  avg_rating?: number;
  rating_count?: number;
  nearest_branch?: {
    id?: number | string;
    name?: string;
    distance_km?: number;
    lat?: number;
    long?: number;
    address?: string;
    is_open?: boolean;
  };
};

type Props = {
  data?: FeaturedItem[];
  animations?: Animated.Value[];
};

export default function Featured({ data = [], animations = [] }: Props) {
  const router = useRouter();
  const theme = useTheme();

  const handlePress = (id: number | string, isOpen: boolean) => {
    if (!isOpen) return;

    router.push({
      pathname: "/screens/RestaurantsPage",
      params: {
        id: String(id),
      },
    });
  };

  if (!Array.isArray(data) || data.length === 0) {
    return null;
  }

  return (
    <>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: theme.textPrimary,
          },
        ]}
      >
        Featured
      </Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chipContainer}
      >
        {data.map((item, index) => {
          const animation = animations[index];

          const name = item?.business_name ?? "Unknown";

          const rating =
            typeof item?.avg_rating === "number"
              ? item.avg_rating
              : Number(item?.avg_rating) || 0;

          const ratingCount =
            typeof item?.rating_count === "number" ? item.rating_count : 0;

          const branch = item?.nearest_branch?.name ?? "Unknown location";

          const distance = item?.nearest_branch?.distance_km ?? null;

          const isOpen = item?.nearest_branch?.is_open ?? false;

          const image = item?.business_logo ?? null;

          return (
            <TouchableOpacity
              key={item?.id ?? `featured-${index}`}
              activeOpacity={isOpen ? 0.9 : 1}
              disabled={!isOpen}
              onPress={() => handlePress(item.id, isOpen)}
            >
              <Animated.View
                style={{
                  opacity: animation
                    ? animation.interpolate({
                        inputRange: [0, 1],
                        outputRange: isOpen ? [0, 1] : [0, 0.55],
                      })
                    : isOpen
                      ? 1
                      : 0.55,

                  transform: [
                    {
                      translateY: animation
                        ? animation.interpolate({
                            inputRange: [0, 1],
                            outputRange: [30, 0],
                          })
                        : 0,
                    },
                    {
                      scale: animation
                        ? animation.interpolate({
                            inputRange: [0, 1],
                            outputRange: [0.95, 1],
                          })
                        : 1,
                    },
                  ],

                  marginRight: 25,
                  backgroundColor: theme.surface,
                  borderRadius: 12,
                  overflow: "hidden",
                  elevation: 4,
                  marginBottom: 20,
                }}
              >
                {/* IMAGE */}
                <View
                  style={{
                    position: "relative",
                  }}
                >
                  {image ? (
                    <Image
                      source={{ uri: image }}
                      resizeMode="cover"
                      style={{
                        width: 255,
                        height: 150,
                      }}
                    />
                  ) : (
                    <View
                      style={{
                        width: 255,
                        height: 150,
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor: theme.surface,
                      }}
                    >
                      <IconSymbol
                        name="StoreIcon"
                        size={48}
                        color={theme.icon}
                      />
                    </View>
                  )}

                  {/* OPEN / CLOSED BADGE */}
                  <View
                    style={{
                      position: "absolute",
                      top: 12,
                      left: 12,
                      paddingHorizontal: 10,
                      paddingVertical: 4,
                      borderRadius: 20,
                      backgroundColor: isOpen ? theme.warning : theme.primary,
                    }}
                  >
                    <Text
                      style={{
                        color: isOpen ? theme.secondary : "#FFFFFF",
                        fontSize: 10,
                        fontWeight: "700",
                      }}
                    >
                      {isOpen ? "OPEN" : "CLOSED"}
                    </Text>
                  </View>
                </View>

                {/* CONTENT */}
                <View
                  style={{
                    padding: 20,
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      marginBottom: 7,
                    }}
                  >
                    <Text
                      numberOfLines={1}
                      style={{
                        fontWeight: "bold",
                        fontSize: 16,
                        maxWidth: 180,
                        color: theme.textPrimary,
                      }}
                    >
                      {name}
                    </Text>

                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                      }}
                    >
                      <Text
                        style={{
                          fontWeight: "bold",
                          fontSize: 14,
                          color: theme.textPrimary,
                          marginRight: 4,
                        }}
                      >
                        {rating.toFixed(1)}
                      </Text>

                      <IconSymbol
                        name="StarIcon"
                        size={16}
                        color={theme.warning}
                      />
                    </View>
                  </View>

                  {/* BRANCH / DISTANCE / STATUS */}
                  <Text
                    numberOfLines={1}
                    style={{
                      fontSize: 12,
                      color: isOpen ? theme.textSecondary : theme.primary,
                      marginBottom: 2,
                      fontWeight: "600",
                    }}
                  >
                    {branch}

                    {distance !== null && distance !== undefined
                      ? ` • ${distance}km`
                      : ""}

                    {" • "}

                    {isOpen ? "Open" : "Closed"}
                  </Text>

                  {/* REVIEWS */}
                  <Text
                    style={{
                      fontSize: 12,
                      color: theme.textSecondary,
                    }}
                  >
                    Reviews ({ratingCount})
                  </Text>
                </View>
              </Animated.View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </>
  );
}
