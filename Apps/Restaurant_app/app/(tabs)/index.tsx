// app/(tabs)/index.tsx - Dashboard with swipeable stats cards
import { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from 'react-native';
import { Eye, MessageCircle } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { StatsCard } from '@/components/StatsCard';
import { FloatingChatButton } from '@/components/FloatingChatButton';
import { ToggleSwitch } from '@/components/ToggleSwitch';
import { dashboardStats } from '@/data/dashboardStats';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = SCREEN_WIDTH - 32; // 16px padding on each side

export default function DashboardScreen() {
  const router = useRouter();
  const scrollViewRef = useRef<ScrollView>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [showSales, setShowSales] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('7Days');
  const [currentCardIndex, setCurrentCardIndex] = useState(0);

  const periods = [
    { key: '12Months', label: '12 Months' },
    { key: '30Days', label: '30 Days' },
    { key: '7Days', label: '7 Days' },
    { key: '24Hours', label: '24 Hours' },
  ];

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / CARD_WIDTH);
    setCurrentCardIndex(index);
  };

  const scrollToCard = (index: number) => {
    scrollViewRef.current?.scrollTo({
      x: index * CARD_WIDTH,
      animated: true,
    });
    setCurrentCardIndex(index);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Dashboard</Text>
            <Text style={styles.welcomeText}>Welcome back, User!</Text>
          </View>
          <View style={styles.statusContainer}>
            <Text style={styles.statusText}>
              {isOpen ? 'Open' : 'Closed'}
            </Text>
            <ToggleSwitch
              value={isOpen}
              onChange={setIsOpen}
              activeColor="#FF6B35"
              inactiveColor="#D1D5DB"
            />
          </View>
        </View>

        {/* Today's Sales Card */}
        <StatsCard
          title="TODAY'S SALES"
          value={showSales ? '₦89,000.00' : '₦••,•••.••'}
          subtitle="SALES"
          subtitleValue="6"
          icon={
            <TouchableOpacity onPress={() => setShowSales(!showSales)}>
              <Eye color="#666" size={20} />
            </TouchableOpacity>
          }
        />

        {/* Period Filter Chips */}
        <View style={styles.periodsContainer}>
          {periods.map((period) => (
            <TouchableOpacity
              key={period.key}
              style={[
                styles.periodChip,
                selectedPeriod === period.key && styles.activePeriodChip,
              ]}
              onPress={() => setSelectedPeriod(period.key)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.periodText,
                  selectedPeriod === period.key && styles.activePeriodText,
                ]}
              >
                {period.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Swipeable Stats Cards */}
        <ScrollView
          ref={scrollViewRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          decelerationRate="fast"
          snapToInterval={CARD_WIDTH}
          snapToAlignment="center"
          contentContainerStyle={styles.statsScrollContainer}
        >
          {dashboardStats.map((stat) => (
            <View key={stat.id} style={styles.cardWrapper}>
              <StatsCard
                title={stat.title}
                value={stat.value}
                subtitle={stat.subtitle}
                subtitleValue={stat.subtitleValue}
                iconName={stat.iconName}
              />
            </View>
          ))}
        </ScrollView>

        {/* Pagination Dots */}
        <View style={styles.paginationContainer}>
          {dashboardStats.map((stat, index) => (
            <TouchableOpacity
              key={stat.id}
              onPress={() => scrollToCard(index)}
              activeOpacity={0.7}
            >
              <View
                style={[
                  styles.paginationDot,
                  currentCardIndex === index && styles.activeDot,
                ]}
              />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Floating Chat Button */}
      <FloatingChatButton
        icon={<MessageCircle size={28} color="#fff" />}
        onPress={() => router.push('/screens/SupportPage')}
        position="primary"
      />
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
  scrollContent: {
    paddingBottom: 120,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#000',
    marginBottom: 4,
  },
  welcomeText: {
    fontSize: 14,
    color: '#666',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
  },
  periodsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    marginBottom: 16,
    gap: 8,
  },
  periodChip: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  activePeriodChip: {
    backgroundColor: '#FF6B35',
    borderColor: '#FF6B35',
  },
  periodText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  activePeriodText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  statsScrollContainer: {
    paddingRight: 16,
  },
  cardWrapper: {
    width: CARD_WIDTH,
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginTop: 24,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#DDD',
  },
  activeDot: {
    width: 24,
    backgroundColor: '#FF6B35',
  },
});