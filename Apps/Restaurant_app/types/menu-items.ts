export type VariantOption = {
  name: string;
  price_diff: string;
};

export type VariantGroup = {
  name: string;
  is_required: boolean;
  options: VariantOption[];
};

export type Addon = {
  name: string;
  price: string;
};

export type AddonGroup = {
  name: string;
  is_required: boolean;
  max_selection: string;
  addons: Addon[];
};