// IconSymbol.tsx
import React from "react";
import { ComponentProps } from "react";
import { OpaqueColorValue, StyleProp, TextStyle } from "react-native";

import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import Ionicons from "@expo/vector-icons/Ionicons";
import AntDesignIcon from "@expo/vector-icons/AntDesign";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import Fontisto from "@expo/vector-icons/Fontisto";

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
  ChevronForwardIcon: "chevron-forward",
  BagOutline: "bag-outline",
  HeartOutline: "heart-outline",
  PersonOutline: "person-outline",
  GlobeOutline: "globe-outline",
  HelpCircleOutline: "help-circle-outline",
  CardOutline: "card-outline",
  LogOutOutline: "log-out-outline",
  LocationOutline: "location-outline",
  Location: "location"
} as const satisfies Record<
  string,
  ComponentProps<typeof Ionicons>["name"]
>;

/* ---------- ANT DESIGN ICONS ---------- */
export const ANT_DESIGN_ICONS = {
  EyeIcon: "eye",
  EyeInvisibleIcon: "eye-invisible",
  StarIcon: "star",
  HeartIcon: "heart",
  PhoneIcon: "phone",
  IdCard: "idcard",
  QuestionCircle: "question-circle",
  Warning: "warning",
} as const satisfies Record<
  string,
  ComponentProps<typeof AntDesignIcon>["name"]
>;

/* ---------- MATERIAL ICONS ---------- */
export const MATERIAL_ICONS = {
  PoolIcon: "pool",
  SpaIcon: "spa",
  RestaurantIcon: "restaurant",
  ParkingIcon: "local-parking",
  MapIcon: "map",
  CartIcon: "shopping-cart",
  TokenIcon: "token",
  PersonPinCircleIcon: "person-pin-circle",
} as const satisfies Record<
  string,
  ComponentProps<typeof MaterialIcons>["name"]
>;

/* ---------- MATERIAL COMMUNITY ICONS ---------- */
export const COMMUNITY_ICONS = {
  FileDocumentOutline: "file-document-outline",
  SwimmerIcon: "swim",
  GymIcon: "dumbbell",
  WifiIcon: "wifi",
  SunCompass: "sun-compass",
  DeleteEmptyIcon: "delete-empty",
} as const satisfies Record<
  string,
  ComponentProps<typeof MaterialCommunityIcons>["name"]
>;

/* ---------- FONT AWESOME 6 ICONS ---------- */
export const FONT_AWESOME_6_ICONS = {
  ArrowLeft: "arrow-left",
  UserIcon: "user",
  WalletIcon: "wallet",
  CreditCardIcon: "credit-card",
  LanguageIcon: "language",
  ShieldIcon: "shield-halved",
  UserGroupIcon: "user-group",
  LogoutIcon: "right-from-bracket",
  ArrowRightLongIcon: "arrow-right-long",
  ThumbsDownIcon: "thumbs-down",
  ThumbsUpIcon: "thumbs-up",
  PersonThroughWindowIcon: "person-through-window",
  PersonWalkingDashedLineArrowRightIcon:
    "person-walking-dashed-line-arrow-right",
  ClockIcon: "clock",
  LocationArrowIcon: "location-arrow",
} as const satisfies Record<
  string,
  ComponentProps<typeof FontAwesome6>["name"]
>;

/* ---------- FONTISTO ICONS ---------- */
export const FONTISTO_ICONS = {
  NavListIcon: "nav-icon-list-a",
} as const satisfies Record<
  string,
  ComponentProps<typeof Fontisto>["name"]
>;

/* ======================================================
   TYPES
====================================================== */

export type IconName =
  | keyof typeof IONICONS
  | keyof typeof MATERIAL_ICONS
  | keyof typeof COMMUNITY_ICONS
  | keyof typeof ANT_DESIGN_ICONS
  | keyof typeof FONT_AWESOME_6_ICONS
  | keyof typeof FONTISTO_ICONS;

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

  if (name in FONT_AWESOME_6_ICONS) {
    return (
      <FontAwesome6
        name={FONT_AWESOME_6_ICONS[name as keyof typeof FONT_AWESOME_6_ICONS]}
        size={size}
        color={color}
        style={style}
      />
    );
  }

  if (name in FONTISTO_ICONS) {
    return (
      <Fontisto
        name={FONTISTO_ICONS[name as keyof typeof FONTISTO_ICONS]}
        size={size}
        color={color}
        style={style}
      />
    );
  }

  // fallback
  return null;
}
