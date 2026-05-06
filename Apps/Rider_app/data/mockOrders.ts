// data/mockOrders.ts
// All locations are in Aba / Abia State, Nigeria.
// Aba city centre approx: 5.1065° N, 7.3671° E

export interface MockOrder {
  id: string;
  customerName: string;
  customerPhone: string;
  orderId: number;
  orderNumber: number;
  itemCount: number;
  amount: string;
  restaurantName: string;
  restaurantPhone: string;
  restaurantAddress: string;
  deliveryAddress: string;
  deliveryType: string;
  customerNote: string;
  restaurantDestination: { latitude: number; longitude: number };
  customerDestination:   { latitude: number; longitude: number };
}

export const MOCK_ORDERS: MockOrder[] = [
  {
    id: "ord_001",
    customerName: "Chidi O.",
    customerPhone: "+2348031234567",
    orderId: 4593,
    orderNumber: 1001,
    itemCount: 3,
    amount: "₦1,500.00",
    restaurantName: "Chicken Republic - Asa Road",
    restaurantPhone: "+2348021112233",
    restaurantAddress: "Asa Road, Aba, Abia State",
    deliveryAddress: "33 Jubilee Road, Aba, Abia State",
    deliveryType: "Meet at door",
    customerNote: "Leave at door",
    restaurantDestination: { latitude: 5.1121, longitude: 7.3668 },
    customerDestination:   { latitude: 5.1065, longitude: 7.3520 },
  },
  {
    id: "ord_002",
    customerName: "Ngozi A.",
    customerPhone: "+2348057654321",
    orderId: 7821,
    orderNumber: 1002,
    itemCount: 2,
    amount: "₦2,200.00",
    restaurantName: "Mr Biggs - Ogbor Hill",
    restaurantPhone: "+2348033334455",
    restaurantAddress: "Ogbor Hill, Aba, Abia State",
    deliveryAddress: "12 Omuma Road, Aba, Abia State",
    deliveryType: "Doorstep",
    customerNote: "Call on arrival",
    restaurantDestination: { latitude: 5.0978, longitude: 7.3710 },
    customerDestination:   { latitude: 5.1200, longitude: 7.3580 },
  },
  {
    id: "ord_003",
    customerName: "Emeka N.",
    customerPhone: "+2349012345678",
    orderId: 3390,
    orderNumber: 1003,
    itemCount: 5,
    amount: "₦3,800.00",
    restaurantName: "Tantalizers - Aba",
    restaurantPhone: "+2348044556677",
    restaurantAddress: "Azikiwe Road, Aba, Abia State",
    deliveryAddress: "5 Factory Road, Aba, Abia State",
    deliveryType: "Meet at door",
    customerNote: "Fragile — handle with care",
    restaurantDestination: { latitude: 5.1072, longitude: 7.3640 },
    customerDestination:   { latitude: 5.1010, longitude: 7.3700 },
  },
  {
    id: "ord_004",
    customerName: "Adaeze U.",
    customerPhone: "+2348178901234",
    orderId: 6104,
    orderNumber: 1004,
    itemCount: 1,
    amount: "₦900.00",
    restaurantName: "Sweet Sensation - Umuahia Rd",
    restaurantPhone: "+2348055667788",
    restaurantAddress: "Umuahia Road, Aba, Abia State",
    deliveryAddress: "21 St Michael's Road, Aba, Abia State",
    deliveryType: "Leave at door",
    customerNote: "",
    restaurantDestination: { latitude: 5.1180, longitude: 7.3730 },
    customerDestination:   { latitude: 5.0920, longitude: 7.3605 },
  },
  {
    id: "ord_005",
    customerName: "Kelechi B.",
    customerPhone: "+2348069876543",
    orderId: 9812,
    orderNumber: 1005,
    itemCount: 4,
    amount: "₦4,100.00",
    restaurantName: "KFC - Aba Shopping Mall",
    restaurantPhone: "+2348066778899",
    restaurantAddress: "Faulks Road, Aba, Abia State",
    deliveryAddress: "48 Ikot Ekpene Road, Aba, Abia State",
    deliveryType: "Meet at door",
    customerNote: "No onions please",
    restaurantDestination: { latitude: 5.1050, longitude: 7.3550 },
    customerDestination:   { latitude: 5.1300, longitude: 7.3780 },
  },
];

export function getRandomOrder(): MockOrder {
  return MOCK_ORDERS[Math.floor(Math.random() * MOCK_ORDERS.length)];
}

export function randomOrderDelay(): number {
  return Math.floor(Math.random() * 25_000) + 5_000;
}