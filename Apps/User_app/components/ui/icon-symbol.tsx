// IconSymbol.tsx
import React from "react";
import { ComponentProps } from "react";
import { OpaqueColorValue, StyleProp, TextStyle } from "react-native";

import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import Ionicons from "@expo/vector-icons/Ionicons";
import AntDesignIcon from "@expo/vector-icons/AntDesign";

/* ======================================================
   ICON MAPS (GROUPED BY ICON FAMILY)
====================================================== */

/* ---------- IONICONS (General UI) ---------- */
export const IONICONS = {
  HomeIcon: "home",
  SearchIcon: "search",
  FilterIcon: "options-outline",
  OrderIcon: "receipt-outline",
  ProfileIcon: "person-outline",
  HeartIcon: "heart",
  EmailIcon: "mail-outline",
  BellIcon: "notifications-outline",
  SettingsIcon: "settings-outline",
  CloseIcon: "close",
} as const satisfies Record<string, ComponentProps<typeof Ionicons>["name"]>;

/* ---------- ANT DESIGN ICONS ---------- */
export const ANT_DESIGN_ICONS = {
  StarIcon: "star",
  HeartIcon: "heart",
  UserIcon: "user",
} as const satisfies Record<string, ComponentProps<typeof AntDesignIcon>["name"]>;

/* ---------- MATERIAL ICONS (Facilities / Navigation) ---------- */
export const MATERIAL_ICONS = {
  PoolIcon: "pool",
  SpaIcon: "spa",
  RestaurantIcon: "restaurant",
  ParkingIcon: "local-parking",
  MapIcon: "map",
  CartIcon: "shopping-cart",
} as const satisfies Record<string, ComponentProps<typeof MaterialIcons>["name"]>;

/* ---------- MATERIAL COMMUNITY ICONS (Amenities / Activities) ---------- */
export const COMMUNITY_ICONS = {
  SwimmerIcon: "swim",
  GymIcon: "dumbbell",
  WifiIcon: "wifi",
} as const satisfies Record<string, ComponentProps<typeof MaterialCommunityIcons>["name"]>;

/* ======================================================
   TYPES
====================================================== */

export type IconName =
  | keyof typeof IONICONS
  | keyof typeof MATERIAL_ICONS
  | keyof typeof COMMUNITY_ICONS
  | keyof typeof ANT_DESIGN_ICONS;

type IconProps = {
  name: IconName;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<TextStyle>;
};

/* ======================================================
   ICON REGISTRY COMPONENT
====================================================== */

export function IconSymbol({ name, size = 24, color, style }: IconProps) {
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

  if (name in COMMUNITY_ICONS) {
    return (
      <MaterialCommunityIcons
        name={COMMUNITY_ICONS[name as keyof typeof COMMUNITY_ICONS]}
        size={size}
        color={color}
        style={style}
      />
    );
  }

  if (name in ANT_DESIGN_ICONS) {
    return (
      <AntDesignIcon
        name={ANT_DESIGN_ICONS[name as keyof typeof ANT_DESIGN_ICONS]}
        size={size}
        color={color}
        style={style}
      />
    );
  }

  // fallback if name not found
  return null;
}
