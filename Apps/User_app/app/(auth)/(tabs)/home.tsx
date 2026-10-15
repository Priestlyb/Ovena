import React, {
  useMemo,
  useState,
  useCallback,
  useRef,
  useEffect,
} from "react";

import { View, FlatList } from "react-native";

import { router } from "expo-router";

import { useAuth } from "@/context/AuthContext";

import BackToTopButton from "@/components/BackToTopButton";
import RestaurantList from "@/components/homepage/RestaurantList";

import HeaderSection from "@/components/homepage/HeaderSection";
import PromoCard from "@/components/homepage/PromoCard";
import CategoryList from "@/components/homepage/CategoryList";
import RecentlyVisitedSection from "@/components/homepage/RecentlyVisitedSection";
import TopPicksSection from "@/components/homepage/TopPicksSection";
import Featured from "@/components/homepage/Featured";
import FreeDeliveryBanner from "@/components/homepage/FreeDeliveryBanner";
import LoaderState from "@/components/homepage/LoaderState";
import ErrorState from "@/components/homepage/ErrorState";
import PromoBanner from "@/components/homepage/PromoBanner";
import StickyAdBanner from "@/components/homepage/StickyAdBanner";

import { useHomepageAnimations } from "@/hooks/homepage/useHomepageAnimations";
import { useHomePageFetch } from "@/hooks/homepage/useHomePageFetch";
import { useHomeData } from "@/src/utils/controllers/useHomeData";

import {
  useCategoryTags,
  useCategorySearch,
} from "@/hooks/homepage/useCategory";

import { useDeviceLocation } from "@/hooks/Location/useDeviceLocation";

import { useFavorites } from "@/hooks/favorites/useFavorites";
import { useOrderHistory } from "@/hooks/orders/useOrderHistory";
import { useProfile } from "@/hooks/account/useProfile";

import useBusinessMenuFetch from "@/hooks/homepage/useBusinessFetch";

import { useTheme } from "@/constants/theme";
import { homepageStyles as styles } from "@/constants/styles/homepageStyles";

export default function Homepage() {
  const theme = useTheme();

  const { authStatus, accessToken } = useAuth();

  const [searchFocused, setSearchFocused] = useState(false);

  const [refreshing, setRefreshing] = useState(false);

  const listRef = useRef<FlatList>(null);

  const [showBackToTop, setShowBackToTop] = useState(false);

  /* ================= LOCATION ================= */

  const { coords: deviceCoords, getLocation } = useDeviceLocation();

  /* ================= API ================= */

  const { isLoading } = useProfile();

  const {
    data: homepageMenuData,
    loading,
    error,
    retry,
    coords,
  } = useHomePageFetch({
    accessToken,
  });

  const {
    data: categoryTagsData,
    isLoading: categoryTagsLoading,
    error: categoryTagsError,
    refetch: refetchCategoryTags,
  } = useCategoryTags();

  const { categories, loading: categoriesLoading } = useHomeData();

  const {
    businesses,
    loading: businessesLoading,
    loadingMore: businessesLoadingMore,
    refreshing: businessesRefreshing,
    hasNextPage: businessesHasNextPage,
    loadMore: loadMoreBusinesses,
    refetch: refetchBusinesses,
    error: businessesError,
  } = useBusinessMenuFetch();

  const { mutateAsync: searchCategories, isPending: categorySearchLoading } =
    useCategorySearch();

  const { refetch: refetchOrders } = useOrderHistory();

  const { refetch: refetchFavorites } = useFavorites();

  /* ================= CATEGORY TAG DEBUG ================= */

  useEffect(() => {
    if (categoryTagsData) {
      // console.log("🏷️ CATEGORY TAGS RESPONSE:", categoryTagsData);
    }
  }, [categoryTagsData]);

  useEffect(() => {
    if (categoryTagsError) {
      console.log("❌ CATEGORY TAGS ERROR:", categoryTagsError);
    }
  }, [categoryTagsError]);

  /* ================= CATEGORY SEARCH ================= */

  const categoryTags = useMemo(
    () => categoryTagsData ?? [],
    [categoryTagsData],
  );

  const handleCategorySearch = useCallback(
    async (categoryId: number) => {
      try {
        console.log("🔎 CATEGORY SELECTED:", categoryId);

        /*
         * Use the shared cached device location
         * when available.
         */
        let location = deviceCoords;

        /*
         * If there is no cached location,
         * request the location.
         */
        if (!location) {
          console.log("📍 Getting device location...");

          location = await getLocation();
        }

        if (!location) {
          console.log("❌ CATEGORY SEARCH: Location unavailable");

          return;
        }

        console.log("📍 CATEGORY SEARCH LOCATION:", location);

        /*
         * Search category businesses.
         */
        const response = await searchCategories({
          category_id: categoryId,
          lat: location.lat,
          lng: location.lng,
        });

        console.log(
          "🔎 CATEGORY SEARCH RESULT:",
          JSON.stringify(response, null, 2),
        );

        /*
         * Find the selected category so
         * we can display its name on the
         * results page.
         */
        const selectedCategory = categoryTags.find(
          (item: any) => item?.id === categoryId,
        );

        console.log("🏷️ SELECTED CATEGORY:", selectedCategory);

        /*
         * Navigate to the results page.
         */
        router.push({
          pathname: "/(auth)/screens/CategoryResultsScreen",

          params: {
            categoryId: String(categoryId),

            categoryName: selectedCategory?.name ?? "Nearby",

            results: JSON.stringify(response),
          },
        });
      } catch (error: any) {
        console.log(
          "❌ CATEGORY SEARCH FAILED:",
          error?.response?.data ?? error?.message ?? error,
        );
      }
    },
    [deviceCoords, getLocation, searchCategories, categoryTags],
  );

  /* ================= SCROLL ================= */

  const handleScroll = useCallback((event: any) => {
    const offsetY = event.nativeEvent.contentOffset.y;

    setShowBackToTop(offsetY > 2250);
  }, []);

  /* ================= REFRESH ================= */

  const onRefresh = useCallback(async () => {
    try {
      setRefreshing(true);

      await Promise.all([
        // Homepage data
        retry?.(),

        // Category tags
        refetchCategoryTags?.(),

        // Orders
        refetchOrders?.(),

        // Favorites
        refetchFavorites?.(),

        // Businesses
        refetchBusinesses?.(),
      ]);
    } catch (err) {
      console.log("[HOME REFRESH ERROR]", err);
    } finally {
      setRefreshing(false);
    }
  }, [
    retry,
    refetchCategoryTags,
    refetchOrders,
    refetchFavorites,
    refetchBusinesses,
  ]);

  /* ================= DERIVED DATA ================= */

  const topPicks = useMemo(
    () => homepageMenuData?.top_pick ?? [],
    [homepageMenuData],
  );

  const featured = useMemo(
    () => homepageMenuData?.featured ?? [],
    [homepageMenuData],
  );

  const recentlyVisited = useMemo(
    () => homepageMenuData?.recently_viewed ?? [],
    [homepageMenuData],
  );

  const hasInitialData = !!homepageMenuData;

  const isAuthLoading =
    authStatus === "booting" || authStatus === "google_signup";

  /* ================= LOADER ================= */

  const showInitialLoader = useMemo(() => {
    if (isAuthLoading) {
      return true;
    }

    if (!coords && !hasInitialData) {
      return true;
    }

    if (!hasInitialData && loading) {
      return true;
    }

    if (!hasInitialData && isLoading) {
      return true;
    }

    if (!categories && categoriesLoading && !hasInitialData) {
      return true;
    }

    if (!categoryTagsData && categoryTagsLoading && !hasInitialData) {
      return true;
    }

    return false;
  }, [
    isAuthLoading,
    coords,
    hasInitialData,
    loading,
    isLoading,
    categories,
    categoriesLoading,
    categoryTagsData,
    categoryTagsLoading,
  ]);

  /* ================= ANIMATIONS ================= */

  const {
    fadeAnim,
    slideAnim,
    scaleAnim,
    categoryAnim,
    recentlyAnim,
    topPicksAnim,
  } = useHomepageAnimations({
    categories: categoryTags,
    topPicks,
    recentlyVisited,
  });

  /* ================= ERROR ================= */

  if (error && !hasInitialData) {
    return <ErrorState onRetry={retry} loading={loading} />;
  }

  /* ================= INITIAL LOADER ================= */

  if (showInitialLoader && !hasInitialData) {
    return <LoaderState />;
  }

  /* ================= HEADER ================= */

  const homepageHeader = (
    <>
      <HeaderSection
        fadeAnim={fadeAnim}
        slideAnim={slideAnim}
        scaleAnim={scaleAnim}
        setSearchFocused={setSearchFocused}
      />

      <PromoCard fadeAnim={fadeAnim} slideAnim={slideAnim} />

      <TopPicksSection data={topPicks} animations={topPicksAnim} />

      <CategoryList
        categoryTags={categoryTags}
        categoryAnim={categoryAnim}
        onCategoryPress={handleCategorySearch}
        isSearching={categorySearchLoading}
      />

      <Featured data={featured} animations={topPicksAnim} />

      <FreeDeliveryBanner />

      <RecentlyVisitedSection
        data={recentlyVisited}
        animations={recentlyAnim}
      />

      <PromoBanner />
    </>
  );

  /* ================= UI ================= */

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.background,
        },
      ]}
    >
      <StickyAdBanner />

      <RestaurantList
        ref={listRef}
        title="More Places to Eat!"
        data={businesses}
        loading={businessesLoading}
        loadingMore={businessesLoadingMore}
        refreshing={businessesRefreshing || refreshing}
        hasNextPage={businessesHasNextPage}
        loadMore={loadMoreBusinesses}
        refetch={onRefresh}
        error={businessesError}
        ListHeaderComponent={homepageHeader}
        onScroll={handleScroll}
      />

      <BackToTopButton
        visible={showBackToTop}
        onPress={() =>
          listRef.current?.scrollToOffset({
            offset: 0,
            animated: true,
          })
        }
      />
    </View>
  );
}
