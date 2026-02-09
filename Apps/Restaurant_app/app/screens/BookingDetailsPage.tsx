// BookingDetailsPage.tsx - Booking confirmation page
import React from 'react';
import { SafeAreaView, ScrollView, View, TouchableOpacity } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { styles } from '@/constants/styles';
import { profileBookingStyles } from '@/constants/profile-booking-styles';

// Atomic Components
import { Text } from '@/components/atoms/Text';
import { Spacer } from '@/components/atoms/Spacer';

// Molecule Components
import { Header } from '@/components/molecules/Header';

// Custom Components
import { SuccessIcon } from '@/components/SuccessIcon';
import { InfoCard, InfoRow } from '@/components/InfoCard';

interface BookingDetails {
  bookingCode: string;
  hotelName: string;
  location: string;
  roomType: string;
  checkInDate: string;
  checkInTime: string;
  checkOutDate: string;
  checkOutTime: string;
  totalNights: number;
  adults: number;
  children: number;
}

export default function BookingDetailsPage() {
  const router = useRouter();
  const params = useLocalSearchParams();

  // Mock data (would come from API or route params)
  const booking: BookingDetails = {
    bookingCode: params.bookingCode as string || 'HKX-39401-A',
    hotelName: 'Pristina Hotel',
    location: 'No. 7, Alpha Court, Lekki Phase 1, Lagos',
    roomType: 'Diplomatic Suites',
    checkInDate: 'FRI, 10 AUG',
    checkInTime: 'From 3:00 PM',
    checkOutDate: 'FRI, 10 AUG',
    checkOutTime: 'From 3:00 PM',
    totalNights: 3,
    adults: 2,
    children: 1,
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{ paddingHorizontal: 20, paddingTop: 20 }}>
          {/* Header */}
          <Header
            title="Booking Details"
            leftIcon={<ArrowLeft size={24} color="#111827" />}
            onLeftIconPress={() => router.back()}
          />

          <Spacer size="xl" />

          {/* Success Icon */}
          <View style={{ alignItems: 'center' }}>
            <SuccessIcon size={100} />
          </View>

          <Spacer size="lg" />

          {/* Success Message */}
          <Text variant="h2" weight="bold" align="center">
            Reservation Successful!
          </Text>
          <Spacer size="xs" />
          <Text variant="body" color="secondary" align="center">
            Customer's booking details are below.
          </Text>

          <Spacer size="lg" />

          {/* Booking Code */}
          <View style={profileBookingStyles.bookingCodeContainer}>
            <Text variant="body" color="secondary">Booking Code:</Text>
            <Spacer size="xs" />
            <Text variant="h4" weight="bold" style={{ color: '#EF4444' }}>
              {booking.bookingCode}
            </Text>
          </View>

          <Spacer size="xl" />

          {/* Hotel Information */}
          <InfoCard title={booking.hotelName} showShadow>
            <InfoRow label="Location" value={booking.location} />
            <InfoRow label="Room Type" value={booking.roomType} bold />
          </InfoCard>

          <Spacer size="lg" />

          {/* Stay Information */}
          <InfoCard title="Stay Information" showShadow>
            <View style={profileBookingStyles.stayInfoGrid}>
              {/* Check-in */}
              <View style={profileBookingStyles.stayInfoColumn}>
                <Text variant="body" color="secondary">Check-in</Text>
                <Spacer size="xs" />
                <Text variant="body" weight="bold">{booking.checkInDate}</Text>
                <Text variant="bodySmall" color="secondary">{booking.checkInTime}</Text>
              </View>

              {/* Check-out */}
              <View style={profileBookingStyles.stayInfoColumn}>
                <Text variant="body" color="secondary">Check-in</Text>
                <Spacer size="xs" />
                <Text variant="body" weight="bold">{booking.checkOutDate}</Text>
                <Text variant="bodySmall" color="secondary">{booking.checkOutTime}</Text>
              </View>
            </View>

            <Spacer size="md" />

            {/* Guest Details */}
            <View style={profileBookingStyles.guestDetailsRow}>
              <View style={profileBookingStyles.guestDetail}>
                <Text variant="bodySmall" color="secondary">Total Nights:</Text>
                <Text variant="body" weight="bold">{booking.totalNights}</Text>
              </View>

              <View style={profileBookingStyles.guestDetail}>
                <Text variant="bodySmall" color="secondary">Adults</Text>
                <Text variant="body" weight="bold">{booking.adults}</Text>
              </View>

              <View style={profileBookingStyles.guestDetail}>
                <Text variant="bodySmall" color="secondary">Children (Under 12)</Text>
                <Text variant="body" weight="bold">{booking.children}</Text>
              </View>
            </View>
          </InfoCard>

          <Spacer size="xxl" />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}