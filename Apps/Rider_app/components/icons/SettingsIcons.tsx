// components/icons/SettingsIcons.tsx
// Self-contained SVG icons matching the App settings design exactly.
// Uses react-native-svg which is included in Expo SDK.

import React from "react";
import Svg, { Path, Circle, Line } from "react-native-svg";

interface IconProps {
  size?: number;
  color?: string;
}

/** 🌙 Moon icon — crescent shape */
export const MoonIcon: React.FC<IconProps> = ({ size = 24, color = "#111" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 1 0 9.79 9.79z"
      fill={color}
    />
  </Svg>
);

/** 🦻 Hearing / sound-and-voice icon — ear with sound waves */
export const SoundVoiceIcon: React.FC<IconProps> = ({ size = 24, color = "#111" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    {/* Ear shape */}
    <Path
      d="M6 12C6 8.69 8.69 6 12 6C15.31 6 18 8.69 18 12C18 14.22 16.79 16.16 15 17.2V19C15 19.55 14.55 20 14 20H10C9.45 20 9 19.55 9 19V17.2C7.21 16.16 6 14.22 6 12Z"
      stroke={color}
      strokeWidth="1.8"
      strokeLinejoin="round"
    />
    <Path
      d="M12 9C13.66 9 15 10.34 15 12"
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
    />
    {/* Sound waves to the right */}
    <Path
      d="M19.07 6.93C20.9 8.76 21.5 11.38 20.66 13.77"
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
    />
    <Path
      d="M21.54 4.46C24.15 7.07 25 11.03 23.66 14.5"
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
    />
  </Svg>
);

/** ➤ Navigation / send arrow icon — hollow triangle arrow */
export const NavigationIcon: React.FC<IconProps> = ({ size = 24, color = "#111" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M3 11.5L21 3L12.5 21L10.5 13.5L3 11.5Z"
      stroke={color}
      strokeWidth="1.8"
      strokeLinejoin="round"
      strokeLinecap="round"
    />
  </Svg>
);

/** 📋 Clipboard / document icon for Vehicle Make & Plate Number */
export const ClipboardIcon: React.FC<IconProps> = ({ size = 20, color = "#b0b0b0" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M9 5H7C5.9 5 5 5.9 5 7V19C5 20.1 5.9 21 7 21H17C18.1 21 19 20.1 19 19V7C19 5.9 18.1 5 17 5H15"
      stroke={color}
      strokeWidth="1.7"
      strokeLinecap="round"
    />
    <Path
      d="M9 5C9 3.9 9.9 3 11 3H13C14.1 3 15 3.9 15 5C15 6.1 14.1 7 13 7H11C9.9 7 9 6.1 9 5Z"
      stroke={color}
      strokeWidth="1.7"
    />
    <Line x1="9" y1="12" x2="15" y2="12" stroke={color} strokeWidth="1.7" strokeLinecap="round" />
    <Line x1="9" y1="16" x2="13" y2="16" stroke={color} strokeWidth="1.7" strokeLinecap="round" />
  </Svg>
);

/** 👤 Person / user icon for name fields */
export const PersonIcon: React.FC<IconProps> = ({ size = 20, color = "#b0b0b0" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="8" r="4" stroke={color} strokeWidth="1.7" />
    <Path
      d="M4 20C4 16.69 7.58 14 12 14C16.42 14 20 16.69 20 20"
      stroke={color}
      strokeWidth="1.7"
      strokeLinecap="round"
    />
  </Svg>
);

/** 🪪 ID Card icon for driver's license upload */
export const IdCardIcon: React.FC<IconProps> = ({ size = 34, color = "#b0b0b0" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M3 7C3 5.9 3.9 5 5 5H19C20.1 5 21 5.9 21 7V17C21 18.1 20.1 19 19 19H5C3.9 19 3 18.1 3 17V7Z"
      stroke={color}
      strokeWidth="1.6"
    />
    <Circle cx="8.5" cy="11" r="2" stroke={color} strokeWidth="1.5" />
    <Path
      d="M5.5 16C5.5 14.34 6.84 13 8.5 13C10.16 13 11.5 14.34 11.5 16"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <Line x1="14" y1="10" x2="19" y2="10" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    <Line x1="14" y1="13" x2="17" y2="13" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
  </Svg>
);

/** ✉️ Mail / envelope icon */
export const MailIcon: React.FC<IconProps> = ({ size = 20, color = "#b0b0b0" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z"
      stroke={color}
      strokeWidth="1.7"
      strokeLinejoin="round"
    />
    <Path
      d="M22 6L12 13L2 6"
      stroke={color}
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

/** 🏠 Home icon for residential address */
export const HomeIcon: React.FC<IconProps> = ({ size = 20, color = "#b0b0b0" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M3 11L12 3L21 11V20C21 20.55 20.55 21 20 21H15V16H9V21H4C3.45 21 3 20.55 3 20V11Z"
      stroke={color}
      strokeWidth="1.7"
      strokeLinejoin="round"
      strokeLinecap="round"
    />
  </Svg>
);