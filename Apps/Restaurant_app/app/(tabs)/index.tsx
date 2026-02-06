import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Switch,
} from 'react-native';
import { Eye, Package } from 'lucide-react-native';
import { StatsCard } from '@/components/StatsCard';
import { FloatingChatButton } from '@/components/FloatingChatButton';

export default function DashboardScreen() {
  const [isOpen, setIsOpen] = useState(false);
  const [showSales, setShowSales] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('7Days');

  const periods = [
    { key: '12Months', label: '12 Months' },
    { key: '30Days', label: '30 Days' },
    { key: '7Days', label: '7 Days' },
    { key: '24Hours', label: '24 Hours' },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Dashboard</Text>
            <Text style={styles.welcomeText}>Welcome back, User!</Text>
          </View>
          <View style={styles.statusContainer}>
            <Text style={styles.statusText}>
              {isOpen ? 'Open' : 'Closed'}
            </Text>
            <Switch
              value={isOpen}
              onValueChange={setIsOpen}
              trackColor={{ false: '#CCC', true: '#FF5722' }}
              thumbColor="#FFF"
            />
          </View>
        </View>

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

        <StatsCard
          title="Total Shipment"
          value="4,520"
          icon={<Package color="#FF5722" size={24} />}
        />

        <View style={styles.paginationContainer}>
          <View style={[styles.paginationDot, styles.activeDot]} />
          <View style={styles.paginationDot} />
          <View style={styles.paginationDot} />
          <View style={styles.paginationDot} />
        </View>

        <FloatingChatButton />
      </ScrollView>
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
  },
  activePeriodChip: {
    backgroundColor: '#FFCCBC',
  },
  periodText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  activePeriodText: {
    color: '#000',
    fontWeight: '600',
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
    backgroundColor: '#000',
  },
});
