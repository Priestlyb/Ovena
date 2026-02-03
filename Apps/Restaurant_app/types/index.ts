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
  onClick: () => void;
}

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
  docBusinessType: string;
  registeredBusinessName: string;
  taxId: string;
  rcNumber: string;
}

export interface PageProps {
  data?: OvenaFormData;
  setData?: (data: OvenaFormData) => void;
  onNext?: () => void;
  onBack?: () => void;
}

// Type for the final submission data (ready to POST to API)
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
  registeredBusinessName: string;
  taxId: string;
  rcNumber: string;
  documentBusinessType: string;
}