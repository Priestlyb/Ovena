// data/dashboardStats.ts - Mock dashboard statistics

export interface DashboardStat {
  id: string;
  title: string;
  value: string | number;
  subtitle?: string;
  subtitleValue?: string | number;
  iconName: 'shipment' | 'order' | 'revenue' | 'delivered';
}

export const dashboardStats: DashboardStat[] = [
  {
    id: '1',
    title: 'TOTAL SHIPMENT',
    value: '4,520',
    iconName: 'shipment',
  },
  {
    id: '2',
    title: 'TOTAL ORDERS',
    value: '1,250',
    subtitle: '',
    subtitleValue: '',
    iconName: 'order',
  },
  {
    id: '3',
    title: 'TOTAL REVENUE',
    value: '₦2,456,000',
    subtitle: 'THIS WEEK',
    subtitleValue: '₦450,000',
    iconName: 'revenue',
  },
];