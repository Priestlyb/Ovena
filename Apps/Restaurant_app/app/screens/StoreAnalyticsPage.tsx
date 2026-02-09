// StoreAnalyticsPage.tsx - Analytics with revenue chart
import React, { useState } from 'react';
import { SafeAreaView, ScrollView, View, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, SlidersHorizontal, ChevronDown, ChevronUp, MessageCircle } from 'lucide-react-native';
import { styles } from '@/constants/styles';

// Atomic Components
import { Text } from '@/components/atoms/Text';
import { Spacer } from '@/components/atoms/Spacer';

// Molecule Components
import { Card } from '@/components/molecules/Card';
import { Header } from '@/components/molecules/Header';

// Existing Components

import { FloatingChatButton } from '@/components/FloatingChatButton';

export default function StoreAnalyticsPage() {
  const router = useRouter();
  const [selectedPeriod, setSelectedPeriod] = useState('Week');
  const [showPeriodMenu, setShowPeriodMenu] = useState(false);
  const [topSellersExpanded, setTopSellersExpanded] = useState(true);

  const stats = [
    { label: 'Total Revenue', value: '₦789,550' },
    { label: 'Total Order', value: '380' },
    { label: 'Total Bookings', value: '281' },
    { label: 'Online Delivery', value: '87%', highlight: true },
  ];

  const chartData = [
    { day: 'S', value: 8000, label: '' },
    { day: 'M', value: 18837.63, label: '₦ 18,837.63', highlight: true },
    { day: 'T', value: 17000, label: '' },
    { day: 'W', value: 12000, label: '' },
    { day: 'T', value: 15000, label: '' },
    { day: 'F', value: 0, label: '' },
    { day: 'S', value: 0, label: '' },
  ];

  const maxValue = 25000;

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: '#FEF3E7' }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <Header
          title="Store Analytics"
          leftIcon={<ArrowLeft size={24} color="#111827" />}
          onLeftIconPress={() => router.back()}
        />

        <Spacer size="lg" />

        {/* Analytics Header */}
        <View style={{ paddingHorizontal: 20 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text variant="h3" weight="semibold">Analytics</Text>
            <TouchableOpacity>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <SlidersHorizontal size={20} color="#111827" />
                <Text variant="body" weight="medium">Filter</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        <Spacer size="lg" />

        {/* Stats Grid */}
        <View style={{ paddingHorizontal: 20 }}>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
            {stats.map((stat, index) => (
              <View key={index} style={{ width: '48%' }}>
                <Text variant="body" color="secondary">{stat.label}</Text>
                <Text
                  variant="h3"
                  weight="bold"
                  style={{ color: stat.highlight ? '#FF6B35' : '#111827' }}
                >
                  {stat.value}
                </Text>
              </View>
            ))}
          </View>
        </View>

        <Spacer size="xl" />

        {/* Trend Revenue Chart */}
        <View style={{ paddingHorizontal: 20 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text variant="h4" weight="semibold">Trend Revenue</Text>
            
            {/* Period Selector */}
            <TouchableOpacity
              onPress={() => setShowPeriodMenu(!showPeriodMenu)}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 8,
                paddingVertical: 6,
                paddingHorizontal: 12,
                borderRadius: 8,
                borderWidth: 1,
                borderColor: '#E5E7EB',
              }}
            >
              <Text variant="body">{selectedPeriod}</Text>
              <ChevronDown size={16} color="#111827" />
            </TouchableOpacity>
          </View>

          {/* Period Dropdown */}
          {showPeriodMenu && (
            <View style={{
              position: 'absolute',
              right: 20,
              top: 40,
              backgroundColor: '#FEF3E7',
              borderRadius: 8,
              padding: 8,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 3,
              zIndex: 1000,
            }}>
              {['Day', 'Week', 'Month', 'Year'].map((period) => (
                <TouchableOpacity
                  key={period}
                  onPress={() => {
                    setSelectedPeriod(period);
                    setShowPeriodMenu(false);
                  }}
                  style={{
                    paddingVertical: 8,
                    paddingHorizontal: 16,
                    backgroundColor: selectedPeriod === period ? '#FF6B35' : 'transparent',
                    borderRadius: 4,
                  }}
                >
                  <Text
                    variant="body"
                    color={selectedPeriod === period ? 'white' : 'primary'}
                  >
                    {period}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          <Spacer size="lg" />

          {/* Bar Chart */}
          <View style={{ height: 250 }}>
            {/* Y-axis labels */}
            <View style={{ position: 'absolute', left: 0, top: 0, bottom: 40 }}>
              {[25000, 20000, 15000, 10000, 5000, 0].map((value) => (
                <View key={value} style={{ flex: 1, justifyContent: 'flex-end' }}>
                  <Text variant="caption" color="secondary">
                    ₦ {value.toLocaleString()}
                  </Text>
                </View>
              ))}
            </View>

            {/* Bars */}
            <View style={{
              flexDirection: 'row',
              alignItems: 'flex-end',
              justifyContent: 'space-around',
              height: '100%',
              paddingLeft: 60,
              paddingBottom: 30,
            }}>
              {chartData.map((item, index) => (
                <View key={index} style={{ alignItems: 'center', flex: 1 }}>
                  {/* Label above bar */}
                  {item.label && (
                    <View style={{
                      position: 'absolute',
                      top: -30,
                      backgroundColor: '#FCD34D',
                      paddingHorizontal: 8,
                      paddingVertical: 4,
                      borderRadius: 4,
                    }}>
                      <Text variant="caption" weight="semibold">
                        {item.label}
                      </Text>
                    </View>
                  )}

                  {/* Bar */}
                  <View
                    style={{
                      width: 30,
                      height: `${(item.value / maxValue) * 100}%`,
                      backgroundColor: '#FF6B35',
                      borderRadius: 4,
                    }}
                  />

                  {/* Day label */}
                  <Text variant="body" weight="semibold" style={{ marginTop: 8 }}>
                    {item.day}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        <Spacer size="xl" />

        {/* Top Sellers Section */}
        <View style={{ paddingHorizontal: 20 }}>
          <TouchableOpacity
            onPress={() => setTopSellersExpanded(!topSellersExpanded)}
            style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}
          >
            <Text variant="h4" weight="semibold">Top Sellers</Text>
            {topSellersExpanded ? (
              <ChevronUp size={20} color="#111827" />
            ) : (
              <ChevronDown size={20} color="#111827" />
            )}
          </TouchableOpacity>
        </View>

        <Spacer size="lg" />

        {/* Reviews Section */}
        <View style={{ paddingHorizontal: 20 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text variant="h4" weight="semibold">Reviews</Text>
            <TouchableOpacity>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <SlidersHorizontal size={20} color="#111827" />
                <Text variant="body" weight="medium">Filter</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        <Spacer size="xxl" />
      </ScrollView>

      {/* Floating Chat Button */}
      <FloatingChatButton
        icon={<MessageCircle size={28} color="#fff" />}
        onPress={() => console.log('Chat')}
        position="primary"
      />
    </SafeAreaView>
  );
}