import React, { memo, useCallback, useEffect, useRef } from "react";
import {
  ActivityIndicator,
  Animated,
  Image,
  Keyboard,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { router } from "expo-router";

import { IconSymbol } from "@/components/ui/icon-symbol";
import { homepageStyles as styles } from "@/constants/styles/homepageStyles";

import useBusinessesSearch from "@/hooks/homepage/useBusinessesSearch";
import { useCartStore } from "@/src/store/cartStore";
import { useTheme } from "@/constants/theme";

type Props = {
  fadeAnim: Animated.Value;
  slideAnim: Animated.Value;
  scaleAnim: Animated.Value;
  setSearchFocused: (value: boolean) => void;
};

function HeaderSection({
  fadeAnim,
  slideAnim,
  scaleAnim,
  setSearchFocused,
}: Props) {
  const theme = useTheme();

  const { search, setSearch, businesses, loading } = useBusinessesSearch();

  const blurTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  /* ================= CLEANUP ================= */

  useEffect(() => {
    return () => {
      if (blurTimeout.current) {
        clearTimeout(blurTimeout.current);
      }
    };
  }, []);

  const handleClearSearch = useCallback(() => {
    setSearch("");
    Keyboard.dismiss();
    setSearchFocused(false);
  }, [setSearch, setSearchFocused]);

  /* ================= CART COUNT ================= */

  const cartItemCount = useCartStore(
    (state) => state.getCartItemCount?.() ?? 0,
  );

  /* ================= SEARCH ================= */

  const showResults = search.trim().length > 0;

  /*
   * The backend already performs the search.
   *
   * useBusinessesSearch normalizes the API response into:
   *
   * {
   *   id,
   *   name,
   *   logo,
   *   image,
   *   address,
   *   rating,
   *   businessType,
   *   nearestBranch
   * }
   *
   * Therefore, we don't need to filter the results again here.
   */
  const searchResults = showResults ? businesses : [];

  /* ================= NAVIGATION ================= */

  const handlePress = useCallback((item: any) => {
    if (!item?.id) {
      console.log("[SEARCH] Invalid business result:", item);

      return;
    }

    const businessId = item.id;

    const menuId = item.matches?.[0]?.id;

    router.push({
      pathname: "/screens/RestaurantsPage",

      params: {
        id: String(businessId),

        ...(menuId
          ? {
              menuId: String(menuId),
            }
          : {}),
      },
    });
  }, []);

  const handleCartPress = useCallback(() => {
    router.push("/(auth)/screens/RestaurantCart");
  }, []);

  /* ================= SEARCH FOCUS ================= */

  const handleFocus = useCallback(() => {
    if (blurTimeout.current) {
      clearTimeout(blurTimeout.current);
      blurTimeout.current = null;
    }

    setSearchFocused(true);
  }, [setSearchFocused]);

  const handleBlur = useCallback(() => {
    if (blurTimeout.current) {
      clearTimeout(blurTimeout.current);
    }

    blurTimeout.current = setTimeout(() => {
      setSearchFocused(false);
    }, 200);
  }, [setSearchFocused]);

  return (
    <Animated.View
      style={{
        opacity: fadeAnim,
        transform: [{ translateY: slideAnim }, { scale: scaleAnim }],
        zIndex: 100,
      }}
    >
      {/* ================= HEADER ================= */}

      <View style={styles.header}>
        <Text
          style={[
            styles.headerText,
            {
              color: theme.textPrimary,
            },
          ]}
        >
          Order Your Favourite{"\n"}
          Fast Food!
        </Text>

        {/* ================= CART BUTTON ================= */}

        <TouchableOpacity
          style={styles.cart}
          onPress={handleCartPress}
          activeOpacity={0.8}
        >
          <IconSymbol name="CartIcon" size={22} color="#fff" />

          {cartItemCount > 0 && (
            <View style={styles.cartBadge}>
              <Text style={styles.cartBadgeText}>{cartItemCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* ================= SEARCH ================= */}

      <View
        style={{
          position: "relative",
          zIndex: 999,
        }}
      >
        <View
          style={[
            styles.searchBox,
            {
              backgroundColor: theme.surface,
              borderColor: theme.border,
              borderWidth: 1,
            },
          ]}
        >
          <IconSymbol name="SearchIcon" size={18} color={theme.textSecondary} />

          <TextInput
            placeholder="Search food, drinks and dessert"
            placeholderTextColor={theme.textSecondary}
            style={[
              styles.searchInput,
              {
                flex: 1,
                color: theme.textPrimary,
              },
            ]}
            value={search}
            onChangeText={setSearch}
            onFocus={handleFocus}
            onBlur={handleBlur}
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="search"
          />

          <TouchableOpacity
            onPress={handleClearSearch}
            activeOpacity={0.7}
            style={{
              padding: 4,
              marginLeft: 4,
            }}
          >
            <IconSymbol
              name="CloseIcon"
              size={18}
              color={theme.textSecondary}
            />
          </TouchableOpacity>

          {/*
          <TouchableOpacity activeOpacity={0.7}>
            <IconSymbol
              name="FilterIcon"
              size={18}
              color={theme.textSecondary}
            />
          </TouchableOpacity>
          */}
        </View>

        {/* ================= SEARCH RESULTS ================= */}

        {showResults && (
          <View
            style={{
              position: "absolute",
              top: 65,
              left: 0,
              right: 0,
              backgroundColor: theme.background,
              borderWidth: 1,
              borderColor: theme.border,
              borderRadius: 18,

              shadowColor: "#000",
              shadowOffset: {
                width: 0,
                height: 4,
              },
              shadowOpacity: 0.08,
              shadowRadius: 10,

              elevation: 8,
              zIndex: 9999,
              overflow: "hidden",
            }}
          >
            {/* ================= LOADING ================= */}

            {loading ? (
              <View
                style={{
                  paddingVertical: 24,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <ActivityIndicator size="small" color={theme.primary} />

                <Text
                  style={{
                    marginTop: 10,
                    color: theme.textSecondary,
                    fontSize: 14,
                  }}
                >
                  Searching...
                </Text>
              </View>
            ) : searchResults.length === 0 ? (
              /* ================= EMPTY STATE ================= */

              <View
                style={{
                  paddingVertical: 24,
                  paddingHorizontal: 20,
                  alignItems: "center",
                }}
              >
                <IconSymbol
                  name="SearchIcon"
                  size={24}
                  color={theme.textSecondary}
                />

                <Text
                  style={{
                    marginTop: 10,
                    color: theme.textSecondary,
                    fontSize: 14,
                    textAlign: "center",
                  }}
                >
                  No businesses found
                </Text>
              </View>
            ) : (
              /* ================= RESULTS ================= */

              <View
                style={{
                  maxHeight: 1000,
                }}
              >
                {searchResults.map((item, index) => (
                  <TouchableOpacity
                    key={String(item.id)}
                    activeOpacity={0.7}
                    onPress={() => handlePress(item)}
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      paddingHorizontal: 16,
                      paddingVertical: 14,

                      borderBottomWidth:
                        index === searchResults.length - 1 ? 0 : 1,

                      borderBottomColor: theme.border,
                    }}
                  >
                    {/* ================= BUSINESS IMAGE ================= */}

                    <Image
                      source={{
                        uri:
                          item.logo ||
                          item.image ||
                          "https://via.placeholder.com/100",
                      }}
                      style={{
                        width: 52,
                        height: 52,
                        borderRadius: 14,
                        marginRight: 12,
                        backgroundColor: theme.surface,
                      }}
                      resizeMode="cover"
                    />

                    {/* ================= BUSINESS INFO ================= */}

                    <View
                      style={{
                        flex: 1,
                        minWidth: 0,
                      }}
                    >
                      {/* Business name */}

                      <Text
                        numberOfLines={1}
                        style={{
                          fontSize: 15,
                          fontWeight: "600",
                          color: theme.textPrimary,
                        }}
                      >
                        {item.name || "Unnamed business"}
                      </Text>

                      {/* Business type */}

                      {!!item.businessType && (
                        <Text
                          numberOfLines={1}
                          style={{
                            marginTop: 4,
                            fontSize: 13,
                            color: theme.textSecondary,
                          }}
                        >
                          {item.businessType}
                        </Text>
                      )}

                      {/* Nearest branch */}

                      {item.nearestBranch && (
                        <Text
                          numberOfLines={1}
                          style={{
                            marginTop: 2,
                            fontSize: 12,
                            color: theme.textSecondary,
                          }}
                        >
                          {item.nearestBranch.name}

                          {typeof item.nearestBranch.distance_km === "number" &&
                            ` • ${item.nearestBranch.distance_km.toFixed(
                              2,
                            )} km`}
                        </Text>
                      )}
                    </View>

                    {/* ================= ARROW ================= */}

                    <IconSymbol
                      name="ArrowRightIcon"
                      size={16}
                      color={theme.icon}
                    />
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        )}
      </View>
    </Animated.View>
  );
}

export default memo(HeaderSection);
