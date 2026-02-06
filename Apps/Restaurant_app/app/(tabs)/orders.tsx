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


interface Order {
  id: string;
  item_name: string;
  order_id: string;
  price: number;
  status: string;
  type: string;
  created_at: string;
}

export default function OrdersScreen() {
  const [orderType, setOrderType] = useState<'food' | 'rooms'>('food');
  const [statusFilter, setStatusFilter] = useState('incoming');
  const [historyFilter, setHistoryFilter] = useState('completed');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

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

  const historyFilters = [
    { key: 'in_transit', label: 'In transit', count: 1 },
    { key: 'completed', label: 'Completed', count: 1 },
    { key: 'rejected', label: 'Rejected', count: 1 },
  ];

  useEffect(() => {
    fetchOrders();
  }, [orderType, statusFilter, historyFilter]);

  const fetchOrders = async () => {
    setLoading(true);
    // try {
    //   let query = supabase
    //     .from('orders')
    //     .select('*')
    //     .eq('type', orderType)
    //     .order('created_at', { ascending: false });

    //   if (statusFilter === 'history') {
    //     query = query.eq('status', historyFilter);
    //   } else {
    //     query = query.eq('status', statusFilter);
    //   }

    //   const { data, error } = await query;

    //   if (error) throw error;
    //   setOrders(data || []);
    // } catch (error) {
    //   console.error('Error fetching orders:', error);
    // } finally {
    //   setLoading(false);
    // }
  };

  const handleStatusUpdate = async (orderId: string, currentStatus: string) => {
    const statusFlow: Record<string, string> = {
      incoming: 'preparing',
      preparing: 'ready',
      ready: 'in_transit',
    };

    const newStatus = statusFlow[currentStatus];
    if (!newStatus) return;

    // try {
    //   const { error } = await supabase
    //     .from('orders')
    //     .update({ status: newStatus, updated_at: new Date().toISOString() })
    //     .eq('id', orderId);

    //   if (error) throw error;
    //   fetchOrders();
    // } catch (error) {
    //   console.error('Error updating order:', error);
    // }
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
                itemName={order.item_name}
                orderId={order.order_id}
                price={order.price}
                time={formatTime(order.created_at)}
                status={order.status}
                onStatusPress={() => handleStatusUpdate(order.id, order.status)}
              />
            ))
          )}
        </ScrollView>

        <FloatingChatButton />
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
