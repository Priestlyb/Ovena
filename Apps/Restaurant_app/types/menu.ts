export type Branch = {
  id: string;
  name: string;
};

export type MenuItem = {
  id: string;
  custom_name: string;
  price: string;
  inStock: boolean;
  selected: boolean;
  menuId: string;
  categoryId: string;
};

export type MenuAPIResponse = {
  id: number;
  categories?: {
    id: number;
    name: string;
    items?: {
      base_item_id: number;
      custom_name?: string;
      description?: string;
      price?: string;
      is_available?: boolean;
    }[];
  }[];
};

export type AvailabilityItem = {
  id: number;
  is_available: boolean;
};