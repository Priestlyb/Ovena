import React, { useMemo } from "react";

import { FlatList, Pressable, SafeAreaView, Text, View } from "react-native";

import { router, useLocalSearchParams } from "expo-router";

import { useTheme } from "@/constants/theme";

import { IconSymbol } from "@/components/ui/icon-symbol";

import { styles } from "@/constants/styles/CategoryResultsScreen.styles";

/* ======================================================
   TYPES
====================================================== */

type NearestBranch = {
  distance_km: number;
  id: number;
  is_open: boolean;
};

type CategoryResult = {
  business_name: string;

  categories: any[];

  id: number;

  nearest_branch: NearestBranch;
};

/* ======================================================
   SCREEN
====================================================== */

export default function CategoryResultsScreen() {
  const theme = useTheme();

  const params = useLocalSearchParams<{
    results?: string;
    categoryName?: string;
    categoryId?: string;
  }>();

  /* ======================================================
     PARSE RESULTS
  ====================================================== */

  const results = useMemo<CategoryResult[]>(() => {
    try {
      if (!params.results) {
        return [];
      }

      const parsed = JSON.parse(params.results);

      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      console.log("[CATEGORY RESULTS PARSE ERROR]", error);

      return [];
    }
  }, [params.results]);

  /* ======================================================
     SEARCHED CATEGORY
  ====================================================== */

  const categoryName = params.categoryName || "Nearby";

  /*
   * This is the GLOBAL category ID selected
   * from the homepage.
   *
   * IMPORTANT:
   *
   * This ID does NOT necessarily match the
   * category ID inside a restaurant's menu.
   *
   * Example:
   *
   * Homepage:
   * burger -> id 1
   *
   * Pristina Hotel:
   * Burgers -> id 78
   *
   * Therefore we pass BOTH:
   *
   * categoryId
   * categoryName
   *
   * FoodsTab uses categoryName to resolve
   * the restaurant's local category.
   */

  const targetCategoryId = params.categoryId
    ? String(params.categoryId)
    : undefined;

  const targetCategoryName = categoryName ? String(categoryName) : undefined;

  /* ======================================================
     DEBUG
  ====================================================== */

  console.log("🎯 CATEGORY RESULTS CATEGORY:", {
    categoryName,
    targetCategoryId,
    targetCategoryName,
    resultCount: results.length,
  });

  /* ======================================================
     RENDER RESULT
  ====================================================== */

  const renderItem = ({
    item,
    index,
  }: {
    item: CategoryResult;
    index: number;
  }) => {
    const branch = item.nearest_branch;

    const distance =
      typeof branch?.distance_km === "number"
        ? branch.distance_km < 1
          ? `${Math.round(branch.distance_km * 1000)} m`
          : `${branch.distance_km.toFixed(1)} km`
        : "--";

    const isOpen = branch?.is_open === true;

    /* ==================================================
       OPEN RESTAURANT
    ================================================== */

    const handleRestaurantPress = () => {
      console.log("🏪 SELECTED BUSINESS:", {
        businessId: item.id,
        businessName: item.business_name,

        /*
         * Global category ID.
         */
        categoryId: targetCategoryId,

        /*
         * Category name is the important part
         * for resolving the restaurant's local
         * category.
         */
        categoryName: targetCategoryName,
      });

      /*
       * Navigate to the restaurant.
       *
       * IMPORTANT:
       *
       * id
       * = business ID
       *
       * categoryId
       * = global homepage category ID
       *
       * categoryName
       * = searched category name
       *
       * FoodsTab uses categoryName to find
       * the matching category inside this
       * restaurant.
       *
       * Foods are NEVER filtered.
       */

      router.push({
        pathname: "/(auth)/screens/RestaurantsPage",

        params: {
          id: String(item.id),

          ...(targetCategoryId
            ? {
                categoryId: targetCategoryId,
              }
            : {}),

          ...(targetCategoryName
            ? {
                categoryName: targetCategoryName,
              }
            : {}),
        },
      });
    };

    return (
      <Pressable
        onPress={handleRestaurantPress}
        style={({ pressed }) => [
          styles.card,
          {
            backgroundColor: theme.surface,

            borderColor: theme.border,

            opacity: pressed ? 0.85 : 1,

            transform: [
              {
                scale: pressed ? 0.985 : 1,
              },
            ],
          },
        ]}
      >
        {/* ==================================================
            DECORATIVE GLOW
        ================================================== */}

        <View
          pointerEvents="none"
          style={[
            styles.cardGlow,
            {
              backgroundColor: theme.decorCircle,
            },
          ]}
        />

        {/* ==================================================
            RESULT NUMBER
        ================================================== */}

        <View
          style={[
            styles.indexBadge,
            {
              backgroundColor: theme.background,

              borderColor: theme.border,
            },
          ]}
        >
          <Text
            style={[
              styles.indexText,
              {
                color: theme.textSecondary,
              },
            ]}
          >
            {String(index + 1).padStart(2, "0")}
          </Text>
        </View>

        {/* ==================================================
            CARD CONTENT
        ================================================== */}

        <View style={styles.cardContent}>
          {/* BUSINESS TITLE */}

          <View style={styles.titleRow}>
            <View
              style={[
                styles.iconContainer,
                {
                  backgroundColor: theme.decorCircle,
                },
              ]}
            >
              <IconSymbol name="StoreIcon" size={20} color={theme.primary} />
            </View>

            <View style={styles.titleContainer}>
              <Text
                style={[
                  styles.businessName,
                  {
                    color: theme.textPrimary,
                  },
                ]}
                numberOfLines={1}
              >
                {item.business_name}
              </Text>

              <View style={styles.categoryRow}>
                <IconSymbol name="StarIcon" size={12} color={theme.primary} />

                <Text
                  style={[
                    styles.categoryText,
                    {
                      color: theme.textSecondary,
                    },
                  ]}
                  numberOfLines={1}
                >
                  {categoryName}
                </Text>
              </View>
            </View>
          </View>

          {/* ==================================================
              METADATA
          ================================================== */}

          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <IconSymbol
                name="MapPinIcon"
                size={14}
                color={theme.textSecondary}
              />

              <Text
                style={[
                  styles.metaText,
                  {
                    color: theme.textSecondary,
                  },
                ]}
              >
                {distance} away
              </Text>
            </View>

            {/* OPEN STATUS */}

            <View
              style={[
                styles.statusBadge,
                {
                  backgroundColor: isOpen
                    ? `${theme.success}18`
                    : `${theme.error}18`,
                },
              ]}
            >
              <View
                style={[
                  styles.statusDot,
                  {
                    backgroundColor: isOpen ? theme.success : theme.error,
                  },
                ]}
              />

              <Text
                style={[
                  styles.statusText,
                  {
                    color: isOpen ? theme.success : theme.error,
                  },
                ]}
              >
                {isOpen ? "OPEN NOW" : "CLOSED"}
              </Text>
            </View>

            <IconSymbol
              name="ChevronRightIcon"
              size={18}
              color={theme.textSecondary}
            />
          </View>
        </View>
      </Pressable>
    );
  };

  /* ======================================================
     SCREEN
  ====================================================== */

  return (
    <SafeAreaView
      style={[
        styles.container,
        {
          backgroundColor: theme.background,
        },
      ]}
    >
      {/* ==================================================
          BACKGROUND DECORATIONS
      ================================================== */}

      <View
        pointerEvents="none"
        style={[
          styles.backgroundCircleOne,
          {
            backgroundColor: theme.decorCircle,
          },
        ]}
      />

      <View
        pointerEvents="none"
        style={[
          styles.backgroundCircleTwo,
          {
            backgroundColor: theme.decorCircle,
          },
        ]}
      />

      {/* ==================================================
          HEADER
      ================================================== */}

      <View style={styles.header}>
        <Pressable
          onPress={() => router.back()}
          style={({ pressed }) => [
            styles.backButton,
            {
              backgroundColor: theme.surface,

              borderColor: theme.border,

              opacity: pressed ? 0.7 : 1,
            },
          ]}
        >
          <IconSymbol name="ArrowLeftIcon" size={21} color={theme.icon} />
        </Pressable>

        <View style={styles.headerTitleContainer}>
          <View style={styles.titleAccent}>
            <IconSymbol name="StarIcon" size={13} color={theme.primary} />

            <Text
              style={[
                styles.eyebrow,
                {
                  color: theme.primary,
                },
              ]}
            >
              DISCOVER NEARBY
            </Text>
          </View>

          <Text
            style={[
              styles.headerTitle,
              {
                color: theme.textPrimary,
              },
            ]}
            numberOfLines={1}
          >
            {categoryName}
          </Text>
        </View>

        <View
          style={[
            styles.locationButton,
            {
              backgroundColor: theme.primary,
            },
          ]}
        >
          <IconSymbol name="LocationDotIcon" size={18} color="#FFFFFF" />
        </View>
      </View>

      {/* ==================================================
          LOCATION BANNER
      ================================================== */}

      <View
        style={[
          styles.locationBanner,
          {
            backgroundColor: theme.surface,

            borderColor: theme.border,
          },
        ]}
      >
        <View
          style={[
            styles.locationIcon,
            {
              backgroundColor: theme.decorCircle,
            },
          ]}
        >
          <IconSymbol name="MapPinIcon" size={17} color={theme.primary} />
        </View>

        <View style={styles.locationTextContainer}>
          <Text
            style={[
              styles.locationLabel,
              {
                color: theme.textSecondary,
              },
            ]}
          >
            SEARCHING AROUND YOU
          </Text>

          <Text
            style={[
              styles.locationDescription,
              {
                color: theme.textPrimary,
              },
            ]}
          >
            Closest places matching your category
          </Text>
        </View>

        {/* LIVE INDICATOR */}

        <View
          style={[
            styles.liveIndicator,
            {
              backgroundColor: theme.success,
            },
          ]}
        />
      </View>

      {/* ==================================================
          RESULTS HEADER
      ================================================== */}

      <View style={styles.resultsHeader}>
        <View>
          <Text
            style={[
              styles.resultsTitle,
              {
                color: theme.textPrimary,
              },
            ]}
          >
            Places for you
          </Text>

          <Text
            style={[
              styles.resultsSubtitle,
              {
                color: theme.textSecondary,
              },
            ]}
          >
            {results.length} {results.length === 1 ? "place" : "places"} found
            nearby
          </Text>
        </View>

        <View
          style={[
            styles.countBadge,
            {
              backgroundColor: theme.decorCircle,
            },
          ]}
        >
          <Text
            style={[
              styles.countText,
              {
                color: theme.primary,
              },
            ]}
          >
            {results.length}
          </Text>
        </View>
      </View>

      {/* ==================================================
          RESULTS
      ================================================== */}

      <FlatList
        data={results}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.listContent,
          results.length === 0 && styles.emptyListContent,
        ]}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <View
              style={[
                styles.emptyIcon,
                {
                  backgroundColor: theme.surface,

                  borderColor: theme.border,
                },
              ]}
            >
              <IconSymbol
                name="MapPinIcon"
                size={28}
                color={theme.textSecondary}
              />
            </View>

            <Text
              style={[
                styles.emptyTitle,
                {
                  color: theme.textPrimary,
                },
              ]}
            >
              Nothing nearby
            </Text>

            <Text
              style={[
                styles.emptyDescription,
                {
                  color: theme.textSecondary,
                },
              ]}
            >
              We couldn't find any places matching this category around your
              current location.
            </Text>

            <Pressable
              onPress={() => router.back()}
              style={[
                styles.emptyButton,
                {
                  backgroundColor: theme.primary,
                },
              ]}
            >
              <Text style={styles.emptyButtonText}>
                Explore other categories
              </Text>
            </Pressable>
          </View>
        }
      />
    </SafeAreaView>
  );
}
