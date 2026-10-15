export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  rating: number;
  kcal: number;
  time: number;
  calories: number;
  imageUrl?: string;
}

export interface Extra {
  id: string;
  label: string;
  price: number;
}

export interface CartVariant {
  id?: number;
  group: string;
  name: string;
  price: number;
}


export interface CartAddon {
  id?: number;
  name: string;
  qty: number;
  total: number;
}


export interface CartItem {
  /**
   * Unique identifier for this cart entry
   * Important when the same meal can exist
   * with different variants/addons
   */
  key?: string;


  /**
   * Product reference
   */
  menu_item_id: number;


  /**
   * Quantity selected
   */
  quantity: number;


  /**
   * Selected variant option IDs
   */
  variant_option_ids: number[];


  /**
   * Selected addon IDs
   */
  addon_ids: number[];


  /**
   * Optional customer note
   */
  notes?: string;


  /**
   * Display data
   */
  business_name?: string;
  product_name?: string;
  image?: string;


  /**
   * Pricing
   */
  unit_price?: number;
  line_total?: number;


  /**
   * Full selected options
   * Used when reopening meal for editing
   */
  variants?: CartVariant[];

  addons?: CartAddon[];
}

export interface Restaurant {
  id: string;
  name: string;
  itemCount: number;
  totalPrice: number;
  details: string;
}

export interface Fee {
  icon: string;
  label: string;
  description?: string;
  amount: number;
}
