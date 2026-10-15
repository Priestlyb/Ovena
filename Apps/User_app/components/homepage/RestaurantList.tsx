import React, { memo, forwardRef } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  RefreshControl,
  ListRenderItem,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

import { IconSymbol } from "../ui/icon-symbol";
import { Business } from "@/src/types/business";
import { Resturantstyles } from "@/constants/styles/homepageStyles";
import { useTheme } from "@/constants/theme";

type Props = {
  title?: string;

  data: Business[];

  loading: boolean;
  loadingMore: boolean;
  refreshing: boolean;

  hasNextPage: boolean;

  error?: string | null;

  loadMore: () => void;
  refetch: () => Promise<void>;

  ListHeaderComponent?: React.ReactElement;

  onScroll?: (event: any) => void;
};

/* -------------------- CARD -------------------- */

const RestaurantCard = memo(({ item }: { item: Business }) => {
  const router = useRouter();
  const theme = useTheme();

  const isOpen = item.nearest_branch?.is_open ?? false;

  const handlePress = () => {
    if (!isOpen) return;

    router.push({
      pathname: "/screens/RestaurantsPage",
      params: {
        id: item.id.toString(),
      },
    });
  };

  return (
    <TouchableOpacity
      activeOpacity={isOpen ? 0.9 : 1}
      disabled={!isOpen}
      onPress={handlePress}
      style={[
        Resturantstyles.restaurantCard,
        {
          backgroundColor: theme.surface,
          shadowColor: theme.primary,
        },
        !isOpen && Resturantstyles.disabledCard,
      ]}
    >
      <View>
        {item.business_image ? (
          <Image
            source={{
              uri: item.business_image,
            }}
            style={Resturantstyles.restaurantImg}
            resizeMode="cover"
          />
        ) : (
          <View
            style={[
              Resturantstyles.restaurantImgPlaceholder,
              {
                backgroundColor: theme.background,
              },
            ]}
          >
            <IconSymbol
              name="StoreIcon"
              size={100}
              color={theme.textSecondary}
            />
          </View>
        )}

        <View
          style={[
            Resturantstyles.statusBadge,
            {
              backgroundColor: isOpen ? theme.warning : theme.primary,
            },
          ]}
        >
          <Text
            style={[
              Resturantstyles.statusText,
              {
                color: isOpen ? theme.secondary : "#FFFFFF",
              },
            ]}
          >
            {isOpen ? "OPEN" : "CLOSED"}
          </Text>
        </View>
      </View>

      <View style={Resturantstyles.restaurantInfo}>
        <View
          style={{
            flex: 1,
            gap: 5,
          }}
        >
          <Text
            numberOfLines={1}
            style={[
              Resturantstyles.restaurantName,
              {
                color: theme.textPrimary,
              },
            ]}
          >
            {item.business_name}
          </Text>

          <Text
            numberOfLines={1}
            style={[
              Resturantstyles.open,
              {
                color: isOpen ? theme.textSecondary : theme.primary,
              },
            ]}
          >
            {item.nearest_branch
              ? `${item.nearest_branch.distance_km} km away • ${
                  isOpen ? "Open" : "Closed"
                }`
              : "No nearby branch"}
          </Text>
        </View>

        <View
          style={{
            alignItems: "flex-end",
            justifyContent: "space-between",
          }}
        >
          <View style={Resturantstyles.ratingRow}>
            <Ionicons name="star" size={14} color={theme.warning} />

            <Text
              style={[
                Resturantstyles.rating,
                {
                  color: theme.textPrimary,
                },
              ]}
            >
              {Number(item.avg_rating ?? 0).toFixed(1)}
            </Text>
          </View>

          <Text
            style={[
              Resturantstyles.reviews,
              {
                color: theme.textSecondary,
              },
            ]}
          >
            ({item.rating_count ?? 0} Reviews)
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
});

RestaurantCard.displayName = "RestaurantCard";

/* -------------------- RENDER ITEM -------------------- */

const renderRestaurant: ListRenderItem<Business> = ({ item }) => (
  <RestaurantCard item={item} />
);

/* -------------------- COMPONENT -------------------- */

const RestaurantList = forwardRef<FlatList, Props>(
  (
    {
      title,
      data,
      loading,
      loadingMore,
      refreshing,
      hasNextPage,
      error,
      loadMore,
      refetch,
      ListHeaderComponent,
      onScroll,
    },
    ref,
  ) => {
    const theme = useTheme();

    if (loading) {
      return (
        <View style={Resturantstyles.loader}>
          <ActivityIndicator size="large" color={theme.primary} />
        </View>
      );
    }

    if (error) {
      return (
        <View
          style={[
            Resturantstyles.empty,
            {
              backgroundColor: theme.background,
            },
          ]}
        >
          <Text
            style={[
              Resturantstyles.emptyText,
              {
                color: theme.error,
              },
            ]}
          >
            {error}
          </Text>
        </View>
      );
    }

    if (!data.length) {
      return (
        <View
          style={[
            Resturantstyles.empty,
            {
              backgroundColor: theme.background,
            },
          ]}
        >
          <Text
            style={[
              Resturantstyles.emptyText,
              {
                color: theme.textSecondary,
              },
            ]}
          >
            No restaurants available.
          </Text>
        </View>
      );
    }

    const ListFooter = () => {
      if (!loadingMore) return null;

      return (
        <View
          style={{
            paddingVertical: 20,
            alignItems: "center",
          }}
        >
          <ActivityIndicator color={theme.primary} />
        </View>
      );
    };

    const ListHeader = () => (
      <>
        {title && (
          <View style={Resturantstyles.sectionHeader}>
            <View style={Resturantstyles.iconGroup}>
              <IconSymbol
                name="BowlRiceIcon"
                size={22}
                color={theme.textSecondary}
              />

              <IconSymbol
                name="sodaoutlineIcon"
                size={20}
                color={theme.textSecondary}
              />
            </View>

            <View style={Resturantstyles.titleContainer}>
              <View
                style={[
                  Resturantstyles.titleLine,
                  {
                    backgroundColor: theme.primary,
                  },
                ]}
              />

              <Text
                style={[
                  Resturantstyles.sectionTitle,
                  {
                    color: theme.textPrimary,
                  },
                ]}
              >
                {title}
              </Text>

              <View
                style={[
                  Resturantstyles.titleLine,
                  {
                    backgroundColor: theme.primary,
                  },
                ]}
              />
            </View>

            <View style={Resturantstyles.iconGroup}>
              <IconSymbol
                name="HamburgerIcon"
                size={22}
                color={theme.textSecondary}
              />

              <IconSymbol
                name="BeerIcon"
                size={20}
                color={theme.textSecondary}
              />
            </View>
          </View>
        )}
      </>
    );

    return (
      <FlatList
        ref={ref}
        data={data}
        renderItem={renderRestaurant}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        onScroll={onScroll}
        scrollEventThrottle={16}
        ListHeaderComponent={
          <>
            {ListHeaderComponent}
            <ListHeader />
          </>
        }
        ListFooterComponent={ListFooter}
        contentContainerStyle={{
          paddingBottom: 20,
          backgroundColor: theme.background,
        }}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews={false}
        initialNumToRender={8}
        maxToRenderPerBatch={8}
        windowSize={7}
        updateCellsBatchingPeriod={50}
        onEndReachedThreshold={0.5}
        onEndReached={() => {
          if (hasNextPage && !loadingMore) {
            loadMore();
          }
        }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={refetch}
            colors={[theme.primary]}
            tintColor={theme.primary}
          />
        }
      />
    );
  },
);

RestaurantList.displayName = "RestaurantList";

export default RestaurantList;
