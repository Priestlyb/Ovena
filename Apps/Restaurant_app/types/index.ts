// types/index.ts

import { Dispatch, SetStateAction } from "react";

/* =========================================================
   🔹 GLOBAL / REUSABLE TYPES
========================================================= */

// File object used for uploads
export interface UploadedFile {
  uri?: string;
  name?: string;
  type?: string;
  size?: number;
  url?: string; // remote file (Cloudinary / S3)
  public_id?: string;
}

/* =========================================================
   🔹 REUSABLE COMPONENT PROPS
========================================================= */

export interface CustomDropdownProps {
  disabled?: boolean;
  options: string[];
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  label?: string;
  required?: boolean;
  renderOptionRight?: (option: string, selected: boolean) => React.ReactNode;
}

export interface CustomInputProps {
  label?: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  type?: "text" | "email" | "password" | "tel" | "number" | "currency";
}

export interface PhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  countryCode?: string;
  countryFlag?: string;
}

export interface OTPInputProps {
  value: string;
  onChange: (value: string) => void;
  length?: number;
}

export interface FileUploadProps {
  label: string;
  required?: boolean;
  onUpload: (file: UploadedFile | null) => void;
  acceptedFormats?: string;
  maxSize?: string;
}

export interface ChecklistItemProps {
  iconName: string;
  text: string;
  completed: boolean;
  onPress: () => void;
  link?: string;
  linkAddress?: string;
}

/* =========================================================
   🔹 SUPER FORM 1 DATA STRUCTURE
========================================================= */

export interface OvenaFormData {
  countries: string[];
  businessTypes: string[];
  registrationOptions: string[];

  selectedCountry: string;
  businessAddress: string;
  businessName: string;
  businessType: string;
  isRegistered: string;
  email: string;
  phone: string;
  fullName: string;
  password: string;
  confirmPassword: string;
}

/* =========================================================
   🔹 SUPER FORM 1 NAVIGATION TYPES
========================================================= */

export interface NavigationProps<TNext = void> {
  onNext: (data: TNext) => void;
  onBack: () => void;
}

export interface NextOnlyProps {
  onNext: () => void;
}

export interface LoadingProps {
  loading?: boolean;
}

/* =========================================================
   🔹 SUPER FORM 1 SUBMISSION
========================================================= */

export interface Phase1Payload {
  business_name: string;
  business_type: string;
  country: string;
  business_address: string;
  email: string;
  phone_number: string;
  password: string;
}

/* =========================================================
   🔹 SUPER FORM 2 DATA STRUCTURE
========================================================= */

export interface SuperForm2Data {
  businessTypes: string[];

  // Page 1 - Business Documents
  docBusinessType: string;
  registeredBusinessName: string;
  taxId: string;
  rcNumber: string;
  uploadedDocument: UploadedFile | null;

  // Page 2 - Phone
  phone: string;

  // Page 3 - OTP
  otp: string;

  // Page 4 - Profile
  shopName: string;
  shopType: string;
  profileImage: UploadedFile | null;
  businessImage: UploadedFile | null;

  // Page 5 - Payment
  selectedBank: string;
  accountNumber: string;
  accountName: string;
  bvn: string;

  // Page 6 - Operations
  deliveryMethod: string;
  preOrderTime: string;
  finalOrderTime: string;
  selectedDay: string;
  openingTime: string;
  closingTime: string;

  // Page 7 - Menu
  menuCategory: string;
  menuItemName: string;
  menuItemDescription: string;
  menuItemImage: UploadedFile | null;

  // Page 8 - Room
  roomName: string;
  roomNumber: string;
  roomDescription: string;
  roomAmenities: string;
}

/* =========================================================
   🔹 SUPER FORM 2 NAVIGATION TYPES
========================================================= */

export interface SuperForm2BaseProps {
  data: SuperForm2Data;
  setData: Dispatch<SetStateAction<SuperForm2Data>>;
}

export interface SuperForm2NavigationProps {
  onNext: () => void;
  onBack: () => void;
}

/* =========================================================
   🔹 SUPER FORM 2 SUBMISSION
========================================================= */

export interface SuperForm2SubmissionData {
  businessType: string;
  registeredBusinessName: string;
  taxId: string;
  rcNumber: string;
  businessDocument: UploadedFile | null;

  phone: string;
  phoneVerified: boolean;

  shopName: string;
  shopType: string;
  profileImage: UploadedFile | null;
  businessImage: UploadedFile | null;

  bankName: string;
  accountNumber: string;
  accountName: string;
  bvn: string;

  deliveryMethod: string;
  preOrderTime: string;
  finalOrderTime: string;
  operatingDay: string;
  openingTime: string;
  closingTime: string;

  menuCategory: string;
  menuItemName: string;
  menuItemDescription: string;
  menuItemImage: UploadedFile | null;

  roomName: string;
  roomNumber: string;
  roomDescription: string;
  roomAmenities: string;
}

/* =========================================================
   🔹 AUTH / ONBOARDING RESPONSES
========================================================= */

export interface OnboardAdminResponse {
  access: string;
  refresh: string;
  message?: string;

  user?: {
    id: number;
    name: string;
  };
}

export interface OnboardingStatus {
  admin_id: number;
  onboarding_step: number;
  is_onboarding_complete: boolean;
}

export type AppRoute =
  | "/superForm"
  | "/superForm2/checklist"
  | "/screens/subscriptionPlans"
  | "/superForm2/menu-items"
  | "/(tabs)";

export const stepRoutes: Record<number, AppRoute> = {
  0: "/superForm",
  1: "/superForm2/checklist",
  2: "/screens/subscriptionPlans",
  3: "/superForm2/menu-items",
  4: "/(tabs)",
};