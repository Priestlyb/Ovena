import React from "react";
import {
  ActivityIndicator,
  Animated,
  Image,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";

import { homepageStyles as styles } from "@/constants/styles/homepageStyles";
import { useTheme } from "@/constants/theme";

type CategoryTag = {
  id: number;
  images: string;
  name: string;
  slug: string;
  tags: number[];
  tags_count: number;
};

type Props = {
  categoryTags: CategoryTag[];
  categoryAnim: Animated.Value[];
  onCategoryPress: (categoryId: number) => void;
  isSearching?: boolean;
};

export default function CategoryList({
  categoryTags = [],
  categoryAnim = [],
  onCategoryPress,
  isSearching = false,
}: Props) {
  const theme = useTheme();

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.chipContainer}
    >
      {categoryTags.map((item, i) => {
        const anim = categoryAnim[i];

        const imageSource =
          typeof item.images === "string" ? { uri: item.images } : null;

        return (
          <Pressable
            key={item.id ?? `category-${i}`}
            disabled={isSearching}
            onPress={() => {
              if (isSearching) return;

              onCategoryPress(item.id);
            }}
            style={({ pressed }) => ({
              opacity: isSearching ? 0.5 : pressed ? 0.7 : 1,
            })}
          >
            <Animated.View
              style={{
                opacity: anim ?? 1,
                transform: [
                  {
                    translateY: anim
                      ? anim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [20, 0],
                        })
                      : 0,
                  },
                ],
                paddingHorizontal: 15,
                marginTop: 30,
                alignItems: "center",
              }}
            >
              <View
                style={[
                  styles.categoriesImageWrapper,
                  {
                    backgroundColor: theme.surface,
                  },
                ]}
              >
                {imageSource ? (
                  <Image
                    source={imageSource}
                    style={[
                      styles.categoriesImage,
                      {
                        opacity: isSearching ? 0.5 : 1,
                      },
                    ]}
                    resizeMode="cover"
                  />
                ) : (
                  <View
                    style={[
                      styles.categoriesImage,
                      {
                        backgroundColor: theme.surface,
                        justifyContent: "center",
                        alignItems: "center",
                      },
                    ]}
                  >
                    {isSearching ? (
                      <ActivityIndicator size="small" color={theme.primary} />
                    ) : (
                      <Text
                        style={{
                          fontSize: 12,
                          color: theme.textSecondary,
                        }}
                      >
                        No Image
                      </Text>
                    )}
                  </View>
                )}
              </View>

              <Text
                style={{
                  marginTop: 6,
                  fontSize: 15,
                  fontWeight: "700",
                  color: theme.textPrimary,
                  opacity: isSearching ? 0.5 : 1,
                }}
                numberOfLines={1}
              >
                {item.name
                  ? item.name.charAt(0).toUpperCase() + item.name.slice(1)
                  : "Category"}
              </Text>
            </Animated.View>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}
