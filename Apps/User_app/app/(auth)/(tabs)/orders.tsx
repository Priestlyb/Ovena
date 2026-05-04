// app/(tabs)/orders.tsx
import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import FoodOrderCard from '@/components/orderComponents/foodorder';
import FoodHistoryCard from '@/components/orderComponents/foodhistory';
import RoomOrderCard from '@/components/orderComponents/roomorder';
import FilterPills from '@/components/orderComponents/filterpills';
import TabSwitch from '@/components/orderComponents/tabswitch';

export default function OrdersTab() {
  const [activeTab, setActiveTab] = useState('Foods');
  const [foodFilter, setFoodFilter] = useState('Upcoming');
  const [roomFilter, setRoomFilter] = useState('Upcoming');

  const foodOrders = [
    {
      name: "Classic Cheese Burger",
      description: "Juicy beef patty",
      extras: "topped with melted cheese...",
      rating: "4.8",
      price: "11.99",
      location: "Pristina Hotel, Kot akapuke Express"
    },
    {
      name: "Classic Cheese Burger",
      description: "Juicy beef patty",
      extras: "topped with melted cheese...",
      rating: "4.8",
      price: "11.99",
      location: "Pristina Hotel, Kot akapuke Express"
    },
    {
      name: "Classic Cheese Burger",
      description: "Juicy beef patty",
      extras: "topped with melted cheese...",
      rating: "4.8",
      price: "11.99",
      location: "Pristina Hotel, Kot akapuke Express"
    }
  ];

  const roomOrders = [
    {
      roomType: "Deluxe Suite",
      hotelName: "Pristina Hotel",
      dates: "Dec 24-27, 2024",
      price: "450.00",
      location: "Shoppite, airport road"
    },
    {
      roomType: "Executive Room",
      hotelName: "Grand Palace Hotel",
      dates: "Jan 15-18, 2025",
      price: "320.00",
      location: "GRA Phase 2, Port Harcourt"
    }
  ];

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerSpacer} />
          <Text style={styles.headerTitle}>My Order</Text>
          <View style={styles.headerSpacer} />
        </View>

        {/* Main Tab Switch */}
        <TabSwitch
          activeTab={activeTab}
          onTabChange={setActiveTab}
          tabs={['Foods', 'Rooms']}
        />

        {/* Foods Tab Content */}
        {activeTab === 'Foods' && (
          <>
            <FilterPills
              activeFilter={foodFilter}
              onFilterChange={setFoodFilter}
              filters={['Upcoming', 'History']}
            />

            {foodOrders.map((order, index) => (
              foodFilter === 'Upcoming' ? (
                <FoodOrderCard key={index} order={order} />
              ) : (
                <FoodHistoryCard key={index} order={order} />
              )
            ))}
          </>
        )}

        {/* Rooms Tab Content */}
        {activeTab === 'Rooms' && (
          <>
            <FilterPills
              activeFilter={roomFilter}
              onFilterChange={setRoomFilter}
              filters={['Upcoming', 'History']}
            />

            {roomOrders.map((order, index) => (
              <RoomOrderCard 
                key={index} 
                order={order} 
                isHistory={roomFilter === 'History'}
              />
            ))}
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingTop: 60,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  headerSpacer: {
    width: 40,
  },
});