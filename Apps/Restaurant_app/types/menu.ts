export type Branch = {
  id: string;
  name: string;
};

export type VariantOption = {
  id: number;
  name: string;
  price_diff: string;
};

export type VariantGroup = {
  id: number;
  name: string;
  is_required: boolean;
  options: VariantOption[];
};

export type Addon = {
  id: number;
  base_item_id: number;
  name: string;
  price: string;
  is_available: boolean;
  image?: string;
};

export type AddonGroup = {
  id: number;
  name: string;
  is_required: boolean;
  max_selection: number;
  addons: Addon[];
};

export type MenuItem = {
  id: string;
  base_item_id: string;

  custom_name: string;
  description: string;

  price: string;
  image?: string;

  is_available?: boolean;
  inStock: boolean;

  variant_groups?: VariantGroup[];
  addon_groups?: AddonGroup[];

  selected: boolean;

  menuId: string;
  categoryId: string;

  categoryName: string;
  menuName: string;
};

export type MenuAPIItem = {
  id: number;
  base_item_id: number;

  custom_name?: string;
  description?: string;

  price?: string;

  image?: string;

  is_available?: boolean;

  variant_groups?: VariantGroup[];

  addon_groups?: AddonGroup[];
};

export type MenuCategory = {
  id: number;
  name: string;
  sort_order?: number;
  items?: MenuAPIItem[];
};

export type MenuAPIResponse = {
  id: number;

  name: string;

  description?: string;

  is_active?: boolean;

  categories?: MenuCategory[];
};

export type AvailabilityItem = {
  id: number;
  is_available: boolean;
};

export type ImageType = {
  uri: string;
  uploadedUrl?: string;
};

export type FeedbackType =
  | "success"
  | "error"
  | "warning"
  | "info";