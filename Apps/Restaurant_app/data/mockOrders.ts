// data/mockOrders.ts - Mock order data for testing

export interface Order {
  id: string;
  item_name: string;
  order_id: string;
  price: number;
  status: 'incoming' | 'preparing' | 'ready' | 'in_transit' | 'completed' | 'rejected';
  type: 'food' | 'rooms';
  created_at: string;
  customer_name: string;
  customer_phone: string;
  delivery_address?: string;
  room_number?: string;
  check_in?: string;
  check_out?: string;
  guests?: number;
  special_requests?: string;
}

export const mockOrders: Order[] = [
  // FOOD ORDERS
  {
    id: '1',
    item_name: 'Jollof Rice with Chicken',
    order_id: 'ORD-2024-001',
    price: 3500,
    status: 'incoming',
    type: 'food',
    created_at: new Date(Date.now() - 10 * 60000).toISOString(), // 10 min ago
    customer_name: 'John Doe',
    customer_phone: '+234 801 234 5678',
    delivery_address: 'No. 5, Allen Avenue, Ikeja, Lagos',
    special_requests: 'Extra spicy please',
  },
  {
    id: '2',
    item_name: 'Fried Rice & Plantain',
    order_id: 'ORD-2024-002',
    price: 4200,
    status: 'preparing',
    type: 'food',
    created_at: new Date(Date.now() - 25 * 60000).toISOString(), // 25 min ago
    customer_name: 'Sarah Williams',
    customer_phone: '+234 802 345 6789',
    delivery_address: 'Plot 12, Victoria Island, Lagos',
    special_requests: 'No onions',
  },
  {
    id: '3',
    item_name: 'Egusi Soup with Pounded Yam',
    order_id: 'ORD-2024-003',
    price: 5000,
    status: 'ready',
    type: 'food',
    created_at: new Date(Date.now() - 45 * 60000).toISOString(), // 45 min ago
    customer_name: 'Michael Johnson',
    customer_phone: '+234 803 456 7890',
    delivery_address: 'No. 20, Lekki Phase 1, Lagos',
  },
  {
    id: '4',
    item_name: 'Chicken Shawarma',
    order_id: 'ORD-2024-004',
    price: 2500,
    status: 'in_transit',
    type: 'food',
    created_at: new Date(Date.now() - 60 * 60000).toISOString(), // 1 hour ago
    customer_name: 'Emily Brown',
    customer_phone: '+234 804 567 8901',
    delivery_address: 'No. 8, Surulere, Lagos',
  },
  {
    id: '5',
    item_name: 'Grilled Fish with Yam',
    order_id: 'ORD-2024-005',
    price: 6500,
    status: 'completed',
    type: 'food',
    created_at: new Date(Date.now() - 120 * 60000).toISOString(), // 2 hours ago
    customer_name: 'David Smith',
    customer_phone: '+234 805 678 9012',
    delivery_address: 'No. 15, Ajah, Lagos',
    special_requests: 'Well done fish',
  },
  {
    id: '6',
    item_name: 'Suya Platter',
    order_id: 'ORD-2024-006',
    price: 4000,
    status: 'rejected',
    type: 'food',
    created_at: new Date(Date.now() - 180 * 60000).toISOString(), // 3 hours ago
    customer_name: 'Lisa Anderson',
    customer_phone: '+234 806 789 0123',
    delivery_address: 'No. 22, Yaba, Lagos',
  },

  // ROOM ORDERS/BOOKINGS
  {
    id: '7',
    item_name: 'Deluxe Room',
    order_id: 'ROOM-2024-001',
    price: 25000,
    status: 'incoming',
    type: 'rooms',
    created_at: new Date(Date.now() - 15 * 60000).toISOString(), // 15 min ago
    customer_name: 'James Wilson',
    customer_phone: '+234 807 890 1234',
    room_number: 'A-101',
    check_in: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
    check_out: new Date(Date.now() + 259200000).toISOString(), // 3 days
    guests: 2,
    special_requests: 'Late check-in expected',
  },
  {
    id: '8',
    item_name: 'Executive Suite',
    order_id: 'ROOM-2024-002',
    price: 45000,
    status: 'preparing',
    type: 'rooms',
    created_at: new Date(Date.now() - 30 * 60000).toISOString(), // 30 min ago
    customer_name: 'Patricia Martinez',
    customer_phone: '+234 808 901 2345',
    room_number: 'B-205',
    check_in: new Date(Date.now() + 172800000).toISOString(), // 2 days
    check_out: new Date(Date.now() + 518400000).toISOString(), // 6 days
    guests: 3,
    special_requests: 'Extra towels and room service',
  },
  {
    id: '9',
    item_name: 'Standard Room',
    order_id: 'ROOM-2024-003',
    price: 15000,
    status: 'ready',
    type: 'rooms',
    created_at: new Date(Date.now() - 50 * 60000).toISOString(), // 50 min ago
    customer_name: 'Robert Garcia',
    customer_phone: '+234 809 012 3456',
    room_number: 'C-310',
    check_in: new Date().toISOString(), // Today
    check_out: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
    guests: 1,
  },
  {
    id: '10',
    item_name: 'Presidential Suite',
    order_id: 'ROOM-2024-004',
    price: 85000,
    status: 'in_transit',
    type: 'rooms',
    created_at: new Date(Date.now() - 90 * 60000).toISOString(), // 1.5 hours ago
    customer_name: 'Jennifer Taylor',
    customer_phone: '+234 810 123 4567',
    room_number: 'P-001',
    check_in: new Date().toISOString(), // Today
    check_out: new Date(Date.now() + 432000000).toISOString(), // 5 days
    guests: 4,
    special_requests: 'VIP treatment, champagne on arrival',
  },
  {
    id: '11',
    item_name: 'Family Suite',
    order_id: 'ROOM-2024-005',
    price: 55000,
    status: 'completed',
    type: 'rooms',
    created_at: new Date(Date.now() - 200 * 60000).toISOString(), // 3+ hours ago
    customer_name: 'Christopher Lee',
    customer_phone: '+234 811 234 5678',
    room_number: 'F-120',
    check_in: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
    check_out: new Date().toISOString(), // Today (checked out)
    guests: 5,
  },
  {
    id: '12',
    item_name: 'Budget Room',
    order_id: 'ROOM-2024-006',
    price: 12000,
    status: 'rejected',
    type: 'rooms',
    created_at: new Date(Date.now() - 240 * 60000).toISOString(), // 4 hours ago
    customer_name: 'Amanda White',
    customer_phone: '+234 812 345 6789',
    room_number: 'N/A',
    check_in: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
    check_out: new Date(Date.now() + 172800000).toISOString(), // 2 days
    guests: 1,
  },

  // Additional mixed orders
  {
    id: '13',
    item_name: 'Peppered Chicken',
    order_id: 'ORD-2024-007',
    price: 3800,
    status: 'incoming',
    type: 'food',
    created_at: new Date(Date.now() - 5 * 60000).toISOString(),
    customer_name: 'Daniel Harris',
    customer_phone: '+234 813 456 7890',
    delivery_address: 'No. 30, Festac Town, Lagos',
  },
  {
    id: '14',
    item_name: 'Honeymoon Suite',
    order_id: 'ROOM-2024-007',
    price: 95000,
    status: 'preparing',
    type: 'rooms',
    created_at: new Date(Date.now() - 20 * 60000).toISOString(),
    customer_name: 'Sophia Clark',
    customer_phone: '+234 814 567 8901',
    room_number: 'H-001',
    check_in: new Date(Date.now() + 604800000).toISOString(), // 7 days
    check_out: new Date(Date.now() + 1209600000).toISOString(), // 14 days
    guests: 2,
    special_requests: 'Romantic setup with rose petals',
  },
];