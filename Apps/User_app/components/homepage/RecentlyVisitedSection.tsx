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

type Props = {
  data: any[];
  animations: Animated.Value[];
};

export default function RecentlyVisitedSection({
  data = [],
  animations = [],
}: Props) {
  const router = useRouter();
  const theme = useTheme();

  const handlePress = (id: number | string, isOpen: boolean) => {
    if (!isOpen) return;

    router.push({
      pathname: "/screens/RestaurantsPage",
      params: {
        id: id.toString(),
      },
    });
  };

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
        Recently Visited
      </Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chipContainer}
      >
        {data.map((item, i) => {
          const anim = animations[i];

          const name = item?.business_name ?? "Unknown";

          const rating =
            typeof item?.avg_rating === "number" ? item.avg_rating : 0;

          const ratingCount = item?.rating_count ?? 0;

          const branch = item?.nearest_branch?.name ?? "Unknown location";

          const distance = item?.nearest_branch?.distance_km ?? null;

          const isOpen = item?.nearest_branch?.is_open ?? false;

          return (
            <TouchableOpacity
              key={item?.id ?? `recent-${i}`}
              activeOpacity={isOpen ? 0.9 : 1}
              disabled={!isOpen}
              onPress={() => handlePress(item?.id, isOpen)}
            >
              <Animated.View
                style={{
                  opacity: anim
                    ? isOpen
                      ? anim
                      : anim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [0.55, 0.55],
                        })
                    : isOpen
                      ? 1
                      : 0.55,

                  transform: [
                    {
                      translateY: anim
                        ? anim.interpolate({
                            inputRange: [0, 1],
                            outputRange: [30, 0],
                          })
                        : 0,
                    },
                    {
                      scale: anim
                        ? anim.interpolate({
                            inputRange: [0, 1],
                            outputRange: [0.95, 1],
                          })
                        : 1,
                    },
                  ],

                  marginRight: 25,
                  backgroundColor: theme.background,
                  borderRadius: 12,
                  overflow: "hidden",
                  elevation: 4,
                  marginBottom: 20,
                }}
              >
                {/* IMAGE / ICON */}
                <View style={{ position: "relative" }}>
                  {item?.business_image ? (
                    <Image
                      source={{ uri: item.business_image }}
                      style={{
                        width: 255,
                        height: 150,
                      }}
                      resizeMode="cover"
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
                        size={45}
                        color={theme.textSecondary}
                      />
                    </View>
                  )}

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
                <View style={{ padding: 20 }}>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      marginBottom: 7,
                    }}
                  >
                    <Text
                      style={{
                        fontWeight: "bold",
                        fontSize: 16,
                        maxWidth: 180,
                        color: theme.textPrimary,
                      }}
                      numberOfLines={1}
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
                        {Number(rating).toFixed(1)}
                      </Text>

                      <IconSymbol
                        name="StarIcon"
                        size={16}
                        color={theme.warning}
                      />
                    </View>
                  </View>

                  <Text
                    style={{
                      fontSize: 12,
                      color: isOpen ? theme.textSecondary : theme.primary,
                      marginBottom: 2,
                      fontWeight: "600",
                    }}
                    numberOfLines={1}
                  >
                    {branch}
                    {distance !== null && distance !== undefined
                      ? ` • ${distance}km`
                      : ""}
                    {" • "}
                    {isOpen ? "Open" : "Closed"}
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
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </>
  );
}
