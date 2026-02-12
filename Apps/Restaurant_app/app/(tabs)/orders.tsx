// app/(tabs)/orders.tsx - Orders page with mock data
import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { Search } from 'lucide-react-native';
import { OrderCard } from '@/components/OrderCard';
import { TabSelector } from '@/components/TabSelector';
import { FilterChips } from '@/components/FilterChips';
import { FloatingChatButton } from '@/components/FloatingChatButton';
import { MessageCircle } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { mockOrders, Order } from '@/data/mockOrders';

export default function OrdersScreen() {
  const router = useRouter();
  const [orderType, setOrderType] = useState<'food' | 'rooms'>('food');
  const [statusFilter, setStatusFilter] = useState('incoming');
  const [historyFilter, setHistoryFilter] = useState('completed');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);

  const typeTabs = [
    { key: 'food', label: 'Food' },
    { key: 'rooms', label: 'Rooms' },
  ];

  const statusFilters = [
    { key: 'incoming', label: 'Incoming' },
    { key: 'preparing', label: 'Preparing' },
    { key: 'ready', label: 'Ready' },
    { key: 'history', label: 'History' },
  ];

  // Calculate counts for history filters
  const getHistoryCounts = () => {
    const filtered = mockOrders.filter((order) => order.type === orderType);
    return {
      in_transit: filtered.filter((o) => o.status === 'in_transit').length,
      completed: filtered.filter((o) => o.status === 'completed').length,
      rejected: filtered.filter((o) => o.status === 'rejected').length,
    };
  };

  const counts = getHistoryCounts();

  const historyFilters = [
    { key: 'in_transit', label: 'In transit', count: counts.in_transit },
    { key: 'completed', label: 'Completed', count: counts.completed },
    { key: 'rejected', label: 'Rejected', count: counts.rejected },
  ];

  useEffect(() => {
    fetchOrders();
  }, [orderType, statusFilter, historyFilter]);

  const fetchOrders = () => {
    setLoading(true);

    // Filter orders based on current selections
    let filteredOrders = mockOrders.filter((order) => order.type === orderType);

    if (statusFilter === 'history') {
      filteredOrders = filteredOrders.filter((order) => order.status === historyFilter);
    } else {
      filteredOrders = filteredOrders.filter((order) => order.status === statusFilter);
    }

    // Sort by created_at (newest first)
    filteredOrders.sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

    setOrders(filteredOrders);
    setLoading(false);
  };

  const handleStatusUpdate = (orderId: string, currentStatus: string) => {
    const statusFlow: Record<string, string> = {
      incoming: 'preparing',
      preparing: 'ready',
      ready: 'in_transit',
    };

    const newStatus = statusFlow[currentStatus];
    if (!newStatus) return;

    // Update order status in mock data
    const orderIndex = mockOrders.findIndex((o) => o.id === orderId);
    if (orderIndex !== -1) {
      mockOrders[orderIndex].status = newStatus as any;
      fetchOrders(); // Refresh the list
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Orders</Text>
          <TouchableOpacity>
            <Search color="#000" size={24} />
          </TouchableOpacity>
        </View>

        <View style={styles.typeTabsContainer}>
          <TabSelector
            tabs={typeTabs}
            activeTab={orderType}
            onTabChange={(key) => setOrderType(key as 'food' | 'rooms')}
          />
        </View>

        <View style={styles.filtersContainer}>
          <FilterChips
            filters={statusFilters}
            activeFilter={statusFilter}
            onFilterChange={setStatusFilter}
          />
        </View>

        {statusFilter === 'history' && (
          <View style={styles.historyFiltersContainer}>
            <FilterChips
              filters={historyFilters}
              activeFilter={historyFilter}
              onFilterChange={setHistoryFilter}
            />
          </View>
        )}

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {loading ? (
            <Text style={styles.loadingText}>Loading...</Text>
          ) : orders.length === 0 ? (
            <Text style={styles.emptyText}>No orders found</Text>
          ) : (
            orders.map((order) => (
              <OrderCard
                key={order.id}
                id={order.id}
                itemName={order.item_name}
                orderId={order.order_id}
                price={order.price}
                time={formatTime(order.created_at)}
                status={order.status}
                type={order.type}
                onStatusPress={() => handleStatusUpdate(order.id, order.status)}
              />
            ))
          )}
        </ScrollView>

        <FloatingChatButton
          icon={<MessageCircle size={28} color="#fff" />}
          onPress={() => router.push('/screens/SupportPage')}
          position="primary"
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#000',
  },
  typeTabsContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  filtersContainer: {
    paddingLeft: 16,
  },
  historyFiltersContainer: {
    paddingLeft: 16,
    marginTop: -8,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  loadingText: {
    textAlign: 'center',
    color: '#666',
    fontSize: 16,
    marginTop: 32,
  },
  emptyText: {
    textAlign: 'center',
    color: '#666',
    fontSize: 16,
    marginTop: 32,
  },
});