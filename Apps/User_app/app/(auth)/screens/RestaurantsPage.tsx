import React, { useMemo, useState, useEffect } from "react";

import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";

import {
  useRouter,
  useLocalSearchParams,
} from "expo-router";

import { IconSymbol } from "@/components/ui/icon-symbol";
import { FoodsTab } from "@/components/FoodOrderTabView/FoodsTab";
import RestuarantsModal from "@/components/RestuarantsModal";

import { useBusinessId } from "@/hooks/homepage/useBusinessId";
import useGetMyBranchRatings from "@/hooks/ratings/useGetMyBranchRatings";

import { createStyles } from "@/constants/styles/RestaurantsPage.styles";

import { useTheme } from "@/constants/theme";

const formatTime = (time?: string) => {
  if (!time) return "";

  const [hour, minute] = time.split(":");

  let h = Number(hour);

  const period = h >= 12 ? "PM" : "AM";

  h = h % 12;

  if (h === 0) h = 12;

  return `${h}:${minute} ${period}`;
};

export default function ResturantsPage() {
  const router = useRouter();

  /* ================= ROUTER PARAMS ================= */

  const {
    id,
    menuId,
    categoryId,
    categoryName,
  } =
    useLocalSearchParams<{
      id: string;
      menuId?: string;
      categoryId?: string;
      categoryName?: string;
    }>();

  /* ================= TARGETS ================= */

  const targetMenuId = menuId
    ? String(menuId)
    : undefined;

  const targetCategoryId = categoryId
    ? String(categoryId)
    : undefined;

  const targetCategoryName = categoryName
    ? String(categoryName)
    : undefined;

  /* ================= THEME ================= */

  const theme = useTheme();

  const styles = createStyles(theme);

  /* ================= BUSINESS ================= */

  const {
    data,
    loading,
    error,
    locationLoading,
  } = useBusinessId(id as string);

  /* ================= RATINGS ================= */

  const { getMyBranchRatings } =
    useGetMyBranchRatings();

  /* ================= STATE ================= */

  const [menuVisible, setMenuVisible] =
    useState(false);

  const [imgError, setImgError] =
    useState(false);

  /* ================= LOAD RATINGS ================= */

  useEffect(() => {
    getMyBranchRatings().catch((err) => {
      console.log(
        "[GET MY BRANCH RATINGS ERROR]",
        err,
      );
    });
  }, [getMyBranchRatings]);

  /* ================= CATEGORIES ================= */

  const categories = useMemo(() => {
    if (!data?.menus) return [];

    return data.menus.flatMap(
      (menu: any) =>
        menu.categories || [],
    );
  }, [data]);

  /* ================= BRANCH STATUS ================= */

  const branchStatus = useMemo(() => {
    const branch =
      data?.nearest_branch;

    if (!branch) {
      return {
        text: "",
        color: theme.textPrimary,
      };
    }

    if (branch.is_open) {
      return {
        text: `Open until ${formatTime(
          branch.close_time,
        )}`,

        color: theme.success,
      };
    }

    return {
      text: `Closed • Opens ${formatTime(
        branch.open_time,
      )}`,

      color: theme.error,
    };
  }, [
    data?.nearest_branch,
    theme,
  ]);

  /* ================= LOADING ================= */

  const hasData = !!data;

  const isInitialLoading =
    !hasData &&
    (loading || locationLoading);

  /* ================= ERROR ================= */

  if (error && !hasData) {
    return (
      <View style={styles.loader}>
        <Text
          style={{
            color:
              theme.textPrimary,
          }}
        >
          {error}
        </Text>
      </View>
    );
  }

  /* ================= INITIAL LOADING ================= */

  if (isInitialLoading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator
          size="large"
          color={theme.primary}
        />

        <Text
          style={{
            marginTop: 10,
            color:
              theme.textSecondary,
          }}
        >
          Finding nearby location...
        </Text>
      </View>
    );
  }

  /* ================= BUSINESS IMAGE ================= */

  const businessImage =
    data?.business_image ||
    data?.business_logo ||
    null;

  const showImage =
    typeof businessImage ===
      "string" &&
    businessImage.trim().length >
      0 &&
    !imgError;

  const imageKey = `${data?.id}-${businessImage}`;

  /* ================= UI ================= */

  return (
    <View style={{ flex: 1 }}>
      {/* HEADER */}

      <View>
        {showImage ? (
          <Image
            key={imageKey}
            source={{
              uri: businessImage,
            }}
            style={styles.headerImage}
            resizeMode="cover"
            onError={() =>
              setImgError(true)
            }
          />
        ) : (
          <View
            style={[
              styles.headerImage,
              styles.headerImagePlaceholder,
            ]}
          >
            <IconSymbol
              name="StoreIcon"
              size={225}
              color={theme.icon}
            />
          </View>
        )}

        {/* BACK BUTTON */}

        <TouchableOpacity
          onPress={() =>
            router.back()
          }
          style={styles.backButton}
        >
          <IconSymbol
            name="ArrowLeftIcon"
            size={24}
            color={theme.icon}
          />
        </TouchableOpacity>

        {/* MENU BUTTON */}

        <TouchableOpacity
          style={styles.menuButton}
          onPress={() =>
            setMenuVisible(true)
          }
        >
          <IconSymbol
            name="DotsHorizontalIcon"
            size={24}
            color={theme.icon}
          />
        </TouchableOpacity>
      </View>

      {/* CONTENT */}

      <View
        style={
          styles.contentContainer
        }
      >
        <Text
          style={styles.businessName}
        >
          {data?.business_name ||
            "Restaurant"}
        </Text>

        <Text
          style={styles.locationText}
        >
          {data?.nearest_branch
            ?.address ||
            data?.business_type ||
            "Restaurant"}
        </Text>

        <Text
          style={styles.locationText}
        >
          {data?.nearest_branch?.name ||
            data?.business_type ||
            "Restaurant"}
        </Text>

        {/* STATS */}

        <View
          style={styles.statsRow}
        >
          <View
            style={styles.statItem}
          >
            <IconSymbol
              name="StarIcon"
              size={20}
              color="#F9D74C"
            />

            <Text
              style={styles.statText}
            >
              {Number(
                data?.avg_rating ?? 0,
              ).toFixed(1)}

              {" ("}

              {data?.rating_count ?? 0}

              {")"}
            </Text>
          </View>

          <View
            style={styles.statItem}
          >
            <IconSymbol
              name="StoreClockIcon"
              size={20}
              color={theme.icon}
            />

            <Text
              style={styles.statText}
            >
              {data?.nearest_branch
                ?.average_prep_time ||
                45}

              {" min"}
            </Text>
          </View>
        </View>

        {/* OPEN STATUS */}

        <Text
          style={[
            styles.openText,
            {
              color:
                branchStatus.color,
            },
          ]}
        >
          {branchStatus.text}
        </Text>
      </View>

      {/* FOOD MENU */}

      <View style={{ flex: 1 }}>
        <FoodsTab
          categories={categories}
          branchId={
            data?.nearest_branch?.id
          }
          businessId={data?.id}
          businessName={
            data?.business_name
          }
          targetMenuId={
            targetMenuId
          }
          targetCategoryId={
            targetCategoryId
          }
          targetCategoryName={
            targetCategoryName
          }
        />
      </View>

      {/* RESTAURANT OPTIONS */}

      <RestuarantsModal
        visible={menuVisible}
        onClose={() =>
          setMenuVisible(false)
        }
        title="Options"
        actions={[
          {
            label: "Information",
            icon: "InfoCircleIcon",
            onPress: () => {
              router.push(
                `/screens/businessInformation?branchId=${data?.nearest_branch?.id}`,
              );
            },
          },

          {
            label: "Share",
            icon: "SendIcon",
            onPress: () => {
              console.log(
                "Share pressed",
              );
            },
          },
        ]}
      />
    </View>
  );
}