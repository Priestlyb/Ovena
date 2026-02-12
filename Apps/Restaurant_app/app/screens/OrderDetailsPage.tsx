// app/screens/OrderDetailsPage.tsx - Order details page
import React, { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, View, TouchableOpacity } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, User, Phone, MapPin, Calendar, Users } from 'lucide-react-native';
import { styles } from '@/constants/styles';
import { profileBookingStyles } from '@/constants/profile-booking-styles';

// Atomic Components
import { Text } from '@/components/atoms/Text';
import { Spacer } from '@/components/atoms/Spacer';

// Molecule Components
import { Header } from '@/components/molecules/Header';

// Custom Components
import { InfoCard, InfoRow } from '@/components/InfoCard';
import { StatusButton } from '@/components/StatusButton';

// Data
import { mockOrders, Order } from '@/data/mockOrders';

export default function OrderDetailsPage() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const orderId = params.orderId as string;
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    console.log('Looking for order ID:', orderId);
    console.log('Available orders:', mockOrders.map(o => o.id));
    
    const foundOrder = mockOrders.find((o) => o.id === orderId);
    console.log('Found order:', foundOrder);
    
    setOrder(foundOrder || null);
  }, [orderId]);

  if (!order) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={{ padding: 20 }}>
          <Text variant="h3">Order not found</Text>
          <Spacer size="sm" />
          <Text variant="body">Order ID: {orderId}</Text>
          <Spacer size="md" />
          <TouchableOpacity onPress={() => router.back()}>
            <Text variant="body" style={{ color: '#FF6B35' }}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
    }).toUpperCase();
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
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{ paddingHorizontal: 20, paddingTop: 20 }}>
          {/* Header */}
          <Header
            title="Order Details"
            leftIcon={<ArrowLeft size={24} color="#111827" />}
            onLeftIconPress={() => router.back()}
          />

          <Spacer size="xl" />

          {/* Order ID Badge */}
          <View style={profileBookingStyles.bookingCodeContainer}>
            <Text variant="body" color="secondary">Order ID</Text>
            <Spacer size="xs" />
            <Text variant="h4" weight="bold" style={{ color: '#FF6B35' }}>
              {order.order_id}
            </Text>
          </View>

          <Spacer size="md" />

          {/* Status Badge */}
          <View style={{ alignItems: 'center' }}>
            <StatusButton status={order.status} />
          </View>

          <Spacer size="xl" />

          {/* Order Information */}
          <InfoCard title={order.item_name} showShadow>
            <InfoRow label="Type" value={order.type === 'food' ? 'Food Order' : 'Room Booking'} bold />
            <InfoRow label="Price" value={`₦${order.price.toLocaleString()}`} bold />
            <InfoRow label="Order Time" value={formatTime(order.created_at)} />
          </InfoCard>

          <Spacer size="lg" />

          {/* Customer Information */}
          <InfoCard title="Customer Information" showShadow>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <User size={20} color="#6B7280" />
              <View style={{ flex: 1 }}>
                <Text variant="bodySmall" color="secondary">Name</Text>
                <Text variant="body" weight="semibold">{order.customer_name}</Text>
              </View>
            </View>

            <Spacer size="sm" />

            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <Phone size={20} color="#6B7280" />
              <View style={{ flex: 1 }}>
                <Text variant="bodySmall" color="secondary">Phone</Text>
                <Text variant="body" weight="semibold">{order.customer_phone}</Text>
              </View>
            </View>

            {order.delivery_address && (
              <>
                <Spacer size="sm" />
                <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 12 }}>
                  <MapPin size={20} color="#6B7280" style={{ marginTop: 2 }} />
                  <View style={{ flex: 1 }}>
                    <Text variant="bodySmall" color="secondary">Delivery Address</Text>
                    <Text variant="body">{order.delivery_address}</Text>
                  </View>
                </View>
              </>
            )}
          </InfoCard>

          <Spacer size="lg" />

          {/* Room Details (if room booking) */}
          {order.type === 'rooms' && (
            <>
              <InfoCard title="Booking Details" showShadow>
                {order.room_number && order.room_number !== 'N/A' && (
                  <InfoRow label="Room Number" value={order.room_number} bold />
                )}
                
                {order.check_in && (
                  <>
                    <Spacer size="sm" />
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                      <Calendar size={20} color="#6B7280" />
                      <View style={{ flex: 1 }}>
                        <Text variant="bodySmall" color="secondary">Check-in</Text>
                        <Text variant="body" weight="bold">{formatDate(order.check_in)}</Text>
                        <Text variant="bodySmall" color="secondary">{formatTime(order.check_in)}</Text>
                      </View>
                    </View>
                  </>
                )}

                {order.check_out && (
                  <>
                    <Spacer size="sm" />
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                      <Calendar size={20} color="#6B7280" />
                      <View style={{ flex: 1 }}>
                        <Text variant="bodySmall" color="secondary">Check-out</Text>
                        <Text variant="body" weight="bold">{formatDate(order.check_out)}</Text>
                        <Text variant="bodySmall" color="secondary">{formatTime(order.check_out)}</Text>
                      </View>
                    </View>
                  </>
                )}

                {order.guests && (
                  <>
                    <Spacer size="sm" />
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                      <Users size={20} color="#6B7280" />
                      <View style={{ flex: 1 }}>
                        <Text variant="bodySmall" color="secondary">Number of Guests</Text>
                        <Text variant="body" weight="bold">{order.guests}</Text>
                      </View>
                    </View>
                  </>
                )}
              </InfoCard>

              <Spacer size="lg" />
            </>
          )}

          {/* Special Requests */}
          {order.special_requests && (
            <>
              <InfoCard title="Special Requests" showShadow>
                <Text variant="body">{order.special_requests}</Text>
              </InfoCard>

              <Spacer size="lg" />
            </>
          )}

          <Spacer size="xxl" />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}