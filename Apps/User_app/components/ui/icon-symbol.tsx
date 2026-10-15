// IconSymbol.tsx
import React from "react";
import { ComponentProps } from "react";
import { OpaqueColorValue, StyleProp, TextStyle } from "react-native";

import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import Ionicons from "@expo/vector-icons/Ionicons";
import AntDesignIcon from "@expo/vector-icons/AntDesign";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import Octicons from "@expo/vector-icons/Octicons";

/* ======================================================
   ICON MAPS (GROUPED BY ICON FAMILY)
====================================================== */

/* ---------- IONICONS (General UI) ---------- */
export const IONICONS = {
  LeafOutlineIcon: "leaf-outline",
  HomeIcon: "home",
  SearchIcon: "search",
  BeerIcon: "beer-outline",
  BusinessIcon: "business",
  MoonIcon: "moon-outline",
  StoreIcon: "storefront-outline",
  FilterIcon: "options-outline",
  OrderIcon: "receipt-outline",
  ProfileIcon: "person-outline",
  HeartIcon: "heart",
  MobilePhoneIcon: "phone-portrait-outline",
  OutlineHeart: "heart-outline",
  EmailIcon: "mail-outline",
  BellIcon: "notifications-outline",
  SettingsIcon: "settings-outline",
  CloseIcon: "close",
  ChevronForwardIcon: "chevron-forward",
  ChevronUpIcon: "chevron-up",
  ChevronDownIcon: "chevron-down",
  BagOutline: "bag-outline",
  TicketIcon: "ticket-sharp",
  HeartOutline: "heart-outline",
  PersonOutline: "person-outline",
  GlobeOutline: "globe-outline",
  FastFoodIcon: "fast-food-outline",
  HelpCircleOutline: "help-circle-outline",
  CardOutline: "card-outline",
  LogOutOutline: "log-out-outline",
  TrashOutline: "trash-outline",
  LockClosedOutline: "lock-closed-outline",
  LogoThreads: "logo-threads",
  SendIcon: "send-sharp",
} as const satisfies Record<string, ComponentProps<typeof Ionicons>["name"]>;

/* ---------- ANT DESIGN ICONS ---------- */
export const ANT_DESIGN_ICONS = {
  SunIcon: "sun",
  StarIcon: "star",
  HeartIcon: "heart",
  UserIcon: "user",
  InfoCircleIcon: "info-circle",
  ChevronRightIcon: "right",
  QuestionCircle: "question-circle",
  ArrowLeftIcon: "arrow-left",
  ArrowRightIcon: "arrow-right",
  ShareAltIcon: "share-alt",
  CheckIcon: "check-circle",
} as const satisfies Record<
  string,
  ComponentProps<typeof AntDesignIcon>["name"]
>;

/* ---------- MATERIAL ICONS ---------- */
export const MATERIAL_ICONS = {
  PoolIcon: "pool",
  SpaIcon: "spa",
  LockClosedIcon: "lock-outline",
  GiftIcon: "wallet-giftcard",
  RestaurantIcon: "restaurant",
  ParkingIcon: "local-parking",
  MapIcon: "map",
  Supporticon: "support-agent",
  ShoppingbasketIcon: "shopping-basket",
  AddCircleIcon: "add-circle-outline",
  CartIcon: "shopping-cart",
  TokenIcon: "token",
  CalendarIcon: "event",
  BedRoomIcon: "bedroom-parent",
  DeliveryIcon: "delivery-dining",
  PrivateConnectivityIcon: "private-connectivity",
} as const satisfies Record<
  string,
  ComponentProps<typeof MaterialIcons>["name"]
>;

/* ---------- MATERIAL COMMUNITY ICONS ---------- */
export const COMMUNITY_ICONS = {
  TagIcon: "tag-outline",
  LightningBoltIcon: "lightning-bolt",
  LeafIcon: "leaf",
  CancelIcon: "cancel",
  SwimmerIcon: "swim",
  GymIcon: "dumbbell",
  WifiIcon: "wifi",
  BikeIcon: "bike-fast",
  HamburgerIcon: "hamburger",
  ShieldCheckIcon: "shield-check",
  sodaoutlineIcon: "bottle-soda-classic-outline",
  WeatherIcon: "weather-pouring",
  CartOffIcon: "cart-off",
  CrownIcon: "crown-outline",
  MedalIcon: "medal-outline",
  TrophyIcon: "trophy",
  HistoryIcon: "history",
  CashMinusIcon: "cash-minus",
  TriangleAlerticon: "alert-outline",
  Awardicon: "trophy-award",
  TicketPercentIcon: "ticket-percent-outline",
  DotsHorizontalIcon: "dots-horizontal",
  StoreClockIcon: "store-clock-outline",
  MapPinIcon: "map-marker-radius-outline",
  MessageSquareTextIcon: "message-reply-text-outline",
  AccountCardIcon: "card-account-phone-outline",
  BriefcaseOutlineIcon: "briefcase-variant-outline",
} as const satisfies Record<
  string,
  ComponentProps<typeof MaterialCommunityIcons>["name"]
>;

/* ---------- FONT AWESOME 6 ICONS ---------- */
export const FONT_AWESOME_6_ICONS = {
  ClockIcon: "clock",
  CoinsIcon: "coins",
  WalletIcon: "wallet",
  Paperclip: "paperclip",
  BowlRiceIcon: "bowl-rice",
  StylishLeafIcon: "leaf",
  CreditCardIcon: "credit-card",
  LanguageIcon: "language",
  ShieldIcon: "shield-halved",
  UserGroupIcon: "user-group",
  LogoutIcon: "right-from-bracket",
  BusinessTimeIcon: "business-time",
  PersonThroughWindowIcon: "person-through-window",
  UserOutlineIcon: "user",
  LocationDotIcon: "location-dot",
} as const satisfies Record<
  string,
  ComponentProps<typeof FontAwesome6>["name"]
>;

/* ---------- OCTICONS (NEW) ---------- */
export const OCTICONS = {
  LawIcon: "law",
} as const satisfies Record<string, ComponentProps<typeof Octicons>["name"]>;

/* ======================================================
   TYPES
====================================================== */

export type IconName =
  | keyof typeof IONICONS
  | keyof typeof MATERIAL_ICONS
  | keyof typeof COMMUNITY_ICONS
  | keyof typeof ANT_DESIGN_ICONS
  | keyof typeof FONT_AWESOME_6_ICONS
  | keyof typeof OCTICONS;

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

  if (name in OCTICONS) {
    return (
      <Octicons
        name={OCTICONS[name as keyof typeof OCTICONS]}
        size={size}
        color={color}
        style={style}
      />
    );
  }

  // fallback
  return null;
}
