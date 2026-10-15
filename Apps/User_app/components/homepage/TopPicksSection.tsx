import React, { memo, useCallback, useState } from "react";
import {
  Animated,
  Image,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { useRouter } from "expo-router";

import { IconSymbol } from "@/components/ui/icon-symbol";
import { homepageStyles as styles } from "@/constants/styles/homepageStyles";
import { useTheme } from "@/constants/theme";

type TopPick = {
  id: number | string;
  business_name?: string;
  business_image?: string | null;
  avg_rating?: number;
  rating_count?: number;
  nearest_branch?: {
    name?: string;
  };
};

type Props = {
  data?: TopPick[];
  animations?: Animated.Value[];
};

const CARD_WIDTH = 255;
const CARD_HEIGHT = 150;

function TopPicksSection({ data = [], animations = [] }: Props) {
  const router = useRouter();
  const theme = useTheme();

  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});

  const handlePress = useCallback(
    (id?: number | string) => {
      if (id === undefined || id === null) return;

      router.push({
        pathname: "/screens/RestaurantsPage",
        params: {
          id: String(id),
        },
      });
    },
    [router],
  );

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
        Top Picks On Ovena
      </Text>

      <ScrollView
        horizontal
        nestedScrollEnabled
        keyboardShouldPersistTaps="handled"
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chipContainer}
      >
        {data.map((item, index) => {
          const id = item?.id ?? `top-pick-${index}`;

          const animation =
            index < animations.length ? animations[index] : undefined;

          const name = item?.business_name || "Unknown";

          const rating =
            typeof item?.avg_rating === "number"
              ? item.avg_rating
              : Number(item?.avg_rating) || 0;

          const ratingCount =
            typeof item?.rating_count === "number" ? item.rating_count : 0;

          const branch = item?.nearest_branch?.name || "Unknown location";

          const imageUri =
            item?.business_image && !failedImages[String(id)]
              ? item.business_image
              : null;

          const animatedStyle = animation
            ? {
                opacity: animation,
                transform: [
                  {
                    translateY: animation.interpolate({
                      inputRange: [0, 1],
                      outputRange: [30, 0],
                    }),
                  },
                  {
                    scale: animation.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.95, 1],
                    }),
                  },
                ],
              }
            : {
                opacity: 1,
                transform: [
                  {
                    translateY: 0,
                  },
                  {
                    scale: 1,
                  },
                ],
              };

          return (
            <Pressable
              key={String(id)}
              onPress={() => {
                handlePress(item?.id);
              }}
            >
              <Animated.View
                style={[
                  animatedStyle,
                  {
                    marginRight: 25,
                    backgroundColor: theme.surface,
                    borderRadius: 12,
                    overflow: "hidden",
                    elevation: 4,
                    marginBottom: 20,
                  },
                ]}
              >
                <View style={{ position: "relative" }}>
                  {imageUri ? (
                    <Image
                      source={{ uri: imageUri }}
                      resizeMode="cover"
                      style={{
                        width: CARD_WIDTH,
                        height: CARD_HEIGHT,
                      }}
                      onError={() => {
                        setFailedImages((prev) => ({
                          ...prev,
                          [String(id)]: true,
                        }));
                      }}
                    />
                  ) : (
                    <View
                      style={{
                        width: CARD_WIDTH,
                        height: CARD_HEIGHT,
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
                </View>

                <View style={{ padding: 20 }}>
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

                  <Text
                    numberOfLines={1}
                    style={{
                      fontSize: 12,
                      color: theme.textSecondary,
                      marginBottom: 2,
                    }}
                  >
                    {branch}
                  </Text>

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
            </Pressable>
          );
        })}
      </ScrollView>
    </>
  );
}

export default memo(TopPicksSection);

{
  /* 
  import React, { memo, useCallback, useState } from "react";
import {
  Animated,
  Image,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { useRouter } from "expo-router";

import { IconSymbol } from "@/components/ui/icon-symbol";
import { homepageStyles as styles } from "@/constants/styles/homepageStyles";
import { useTheme } from "@/constants/theme";

type TopPick = {
  id: number | string;
  business_name?: string;
  business_image?: string | null;
  avg_rating?: number;
  rating_count?: number;
  nearest_branch?: {
    name?: string;
    distance_km?: number;
    is_open?: boolean;
  };
};

type Props = {
  data?: TopPick[];
  animations?: Animated.Value[];
};

const CARD_WIDTH = 255;
const CARD_HEIGHT = 150;

function TopPicksSection({ data = [], animations = [] }: Props) {
  const router = useRouter();
  const theme = useTheme();

  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});

  const handlePress = useCallback(
    (id?: number | string, isOpen?: boolean) => {
      // Don't navigate if restaurant is closed
      if (id === undefined || id === null || !isOpen) return;

      router.push({
        pathname: "/screens/RestaurantsPage",
        params: {
          id: String(id),
        },
      });
    },
    [router],
  );

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
        Top Picks On Ovena
      </Text>

      <ScrollView
        horizontal
        nestedScrollEnabled
        keyboardShouldPersistTaps="handled"
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chipContainer}
      >
        {data.map((item, index) => {
          const id = item?.id ?? `top-pick-${index}`;

          const animation =
            index < animations.length ? animations[index] : undefined;

          const name = item?.business_name || "Unknown";

          const rating =
            typeof item?.avg_rating === "number"
              ? item.avg_rating
              : Number(item?.avg_rating) || 0;

          const ratingCount =
            typeof item?.rating_count === "number" ? item.rating_count : 0;

          const branch = item?.nearest_branch?.name || "Unknown location";

          const distance = item?.nearest_branch?.distance_km ?? null;

          const isOpen = item?.nearest_branch?.is_open ?? false;

          const imageUri =
            item?.business_image && !failedImages[String(id)]
              ? item.business_image
              : null;

          const animatedStyle = animation
            ? {
                opacity: animation.interpolate({
                  inputRange: [0, 1],
                  outputRange: isOpen ? [0, 1] : [0, 0.55],
                }),

                transform: [
                  {
                    translateY: animation.interpolate({
                      inputRange: [0, 1],
                      outputRange: [30, 0],
                    }),
                  },
                  {
                    scale: animation.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.95, 1],
                    }),
                  },
                ],
              }
            : {
                opacity: isOpen ? 1 : 0.55,
                transform: [
                  {
                    translateY: 0,
                  },
                  {
                    scale: 1,
                  },
                ],
              };

          return (
            <Pressable
              key={String(id)}
              disabled={!isOpen}
              onPress={() => {
                handlePress(item?.id, isOpen);
              }}
              style={{
                opacity: isOpen ? 1 : 0.95,
              }}
            >
              <Animated.View
                style={[
                  animatedStyle,
                  {
                    marginRight: 25,
                    backgroundColor: theme.surface,
                    borderRadius: 12,
                    overflow: "hidden",
                    elevation: 4,
                    marginBottom: 20,
                  },
                ]}
              >
                {/* IMAGE 
                <View style={{ position: "relative" }}>
                  {imageUri ? (
                    <Image
                      source={{ uri: imageUri }}
                      resizeMode="cover"
                      style={{
                        width: CARD_WIDTH,
                        height: CARD_HEIGHT,
                      }}
                      onError={() => {
                        setFailedImages((prev) => ({
                          ...prev,
                          [String(id)]: true,
                        }));
                      }}
                    />
                  ) : (
                    <View
                      style={{
                        width: CARD_WIDTH,
                        height: CARD_HEIGHT,
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

                  {/* OPEN / CLOSED BADGE 
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

                {/* CONTENT 
                <View style={{ padding: 20 }}>
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

                    {/* RATING 
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

                  {/* BRANCH / DISTANCE / STATUS 
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

                  {/* REVIEWS 
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
            </Pressable>
          );
        })}
      </ScrollView>
    </>
  );
}

export default memo(TopPicksSection);

  */
}
