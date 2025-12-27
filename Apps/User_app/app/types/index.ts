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

export interface CartItem {
  id: string;
  name: string;
  restaurant: string;
  quantity: number;
  price: number;
  extras?: Extra[];
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
