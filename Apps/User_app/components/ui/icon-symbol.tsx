// IconSymbol.tsx
import { ComponentProps } from "react";
import { OpaqueColorValue, StyleProp, TextStyle } from "react-native";

import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import Ionicons from "@expo/vector-icons/Ionicons";

/* ======================================================
   ICON MAPS (GROUPED BY ICON FAMILY)
====================================================== */

/* ---------- IONICONS (General UI) ---------- */
const IONICONS = {
  HomeIcon: "home",
  SearchIcon: "search",
  CartIcon: "cart-outline",
  OrderIcon: "receipt-outline",
  ProfileIcon: "person-outline",
  HeartIcon: "heart",
  BellIcon: "notifications-outline",
  SettingsIcon: "settings-outline",
  CloseIcon: "close",
} as const satisfies Record<
  string,
  ComponentProps<typeof Ionicons>["name"]
>;

/* ---------- MATERIAL ICONS (Facilities / Navigation) ---------- */
const MATERIAL_ICONS = {
  PoolIcon: "pool",
  SpaIcon: "spa",
  RestaurantIcon: "restaurant",
  ParkingIcon: "local-parking",
  MapIcon: "map",
} as const satisfies Record<
  string,
  ComponentProps<typeof MaterialIcons>["name"]
>;

/* ---------- MATERIAL COMMUNITY ICONS (Amenities / Activities) ---------- */
const COMMUNITY_ICONS = {
  SwimmerIcon: "swim",
  GymIcon: "dumbbell",
  WifiIcon: "wifi",
} as const satisfies Record<
  string,
  ComponentProps<typeof MaterialCommunityIcons>["name"]
>;

/* ======================================================
   TYPES
====================================================== */

export type IconName =
  | keyof typeof IONICONS
  | keyof typeof MATERIAL_ICONS
  | keyof typeof COMMUNITY_ICONS;

type IconProps = {
  name: IconName;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<TextStyle>;
};

/* ======================================================
   ICON REGISTRY COMPONENT
====================================================== */

export function IconSymbol({
  name,
  size = 24,
  color,
  style,
}: IconProps) {
  if (name in IONICONS) {
    return (
      <Ionicons
        name={IONICONS[name as keyof typeof IONICONS]}
        size={size}
        color={color}
        style={style}
      />
    );
  }

  if (name in MATERIAL_ICONS) {
    return (
      <MaterialIcons
        name={MATERIAL_ICONS[name as keyof typeof MATERIAL_ICONS]}
        size={size}
        color={color}
        style={style}
      />
    );
  }

  return (
    <MaterialCommunityIcons
      name={COMMUNITY_ICONS[name as keyof typeof COMMUNITY_ICONS]}
      size={size}
      color={color}
      style={style}
    />
  );
}
