// types/index.ts - Create this file in your project root or src/types directory

export interface CustomDropdownProps {
  options: string[];
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  label?: string;
  required?: boolean;
}

export interface CustomInputProps {
  label?: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  type?: 'text' | 'email' | 'password' | 'tel';
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
  onUpload: (file: any) => void;
  acceptedFormats?: string;
  maxSize?: string;
}

export interface ChecklistItemProps {
  iconName: string;
  text: string;
  completed: boolean;
  link?: string; // Optional link text to display with chevron
  onPress: () => void; // Function to call when item is pressed (for navigation)
}

// Form data interface
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

// Page props interface
export interface PageProps {
  data?: OvenaFormData;
  setData?: (data: OvenaFormData) => void;
  onNext?: () => void;
  onBack?: () => void;
}

// Submission data interface (what gets sent to API)
export interface SubmissionData {
  country: string;
  businessAddress: string;
  businessName: string;
  businessType: string;
  isRegistered: string;
  email: string;
  phone: string;
  fullName: string;
  password: string;
}

// types.ts - Updated ChecklistItemProps interface

export interface ChecklistItemProps {
  iconName: string;
  text: string;
  completed: boolean;
  onPress: () => void;
  link?: string; // Optional link text to display with chevron
  linkAddress?: string; // Optional route/screen name to navigate to
}

// SuperForm2 complete data structure
export interface SuperForm2Data {
  // Dropdown options
  businessTypes: string[];

  // Business Documents (Page 1)
  docBusinessType: string;
  registeredBusinessName: string;
  taxId: string;
  rcNumber: string;
  uploadedDocument: any;

  // Phone Verification Page 1 (Page 2)
  phone: string;

  // Phone Verification Page 2 - OTP (Page 3)
  otp: string;

  // Profile Completion (Page 4)
  shopName: string;
  shopType: string;
  profileImage: any;
  businessImage: any;

  // Payment Setup (Page 5)
  selectedBank: string;
  accountNumber: string;
  accountName: string;
  bvn: string;

  // Operations Setup (Page 6)
  deliveryMethod: string;
  preOrderTime: string;
  finalOrderTime: string;
  selectedDay: string;
  openingTime: string;
  closingTime: string;

  // Menu Items (Page 7)
  menuCategory: string;
  menuItemName: string;
  menuItemDescription: string;
  menuItemImage: any;

  // Room Menu (Page 8)
  roomName: string;
  roomNumber: string;
  roomDescription: string;
  roomAmenities: string;
}

// Data structure for API submission
export interface SuperForm2SubmissionData {
  // Business Documents
  businessType: string;
  registeredBusinessName: string;
  taxId: string;
  rcNumber: string;
  businessDocument: any;

  // Phone Verification
  phone: string;
  phoneVerified: boolean;

  // Profile
  shopName: string;
  shopType: string;
  profileImage: any;
  businessImage: any;

  // Payment
  bankName: string;
  accountNumber: string;
  accountName: string;
  bvn: string;

  // Operations
  deliveryMethod: string;
  preOrderTime: string;
  finalOrderTime: string;
  operatingDay: string;
  openingTime: string;
  closingTime: string;

  // Menu Items
  menuCategory: string;
  menuItemName: string;
  menuItemDescription: string;
  menuItemImage: any;

  // Room Details
  roomName: string;
  roomNumber: string;
  roomDescription: string;
  roomAmenities: string;
}

// Props for pages that need data and setData
export interface SuperForm2PageProps {
  data?: SuperForm2Data;
  setData?: (data: SuperForm2Data) => void;
  onNext?: () => void;
  onBack?: () => void;
}