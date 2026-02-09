// StoreHubPage.tsx - Store hub with dynamic UI based on delivery method
import React, { useState } from 'react';
import { SafeAreaView, ScrollView, View } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, MessageCircle } from 'lucide-react-native';
import { styles } from '@/constants/styles';
import { storeHubStyles } from '@/constants/store-hub-styles';

// Atomic Components
import { Text } from '@/components/atoms/Text';
import { Button } from '@/components/atoms/Button';
import { Spacer } from '@/components/atoms/Spacer';

// Molecule Components
import { Header } from '@/components/molecules/Header';

// Custom Components
import { CustomDropdown } from '@/components/CustomDropDown';
import { InfoTooltip } from '@/components/InfoTooltip';
import { TimeRowSelector } from '@/components/TimeRowSelector';
import { PaymentInfoCard } from '@/components/PaymentInfoCard';
import { FloatingChatButton } from '@/components/FloatingChatButton';

export default function StoreHubPage() {
  const router = useRouter();
  
  // Form state
  const [deliveryMethod, setDeliveryMethod] = useState<'Instant' | 'Pre-order'>('Pre-order');
  const [preOrderTime, setPreOrderTime] = useState('00:00 AM');
  const [finalOrderTime, setFinalOrderTime] = useState('00:00 PM');
  const [selectedDay, setSelectedDay] = useState('Default');
  const [openingTime, setOpeningTime] = useState('00:00 PM');
  const [closingTime, setClosingTime] = useState('00:00 PM');

  // Payment info (would come from API)
  const paymentInfo = {
    bankName: '{Bank_Name}',
    accountNumber: '{Account_Number}',
  };

  const handleSaveChanges = () => {
    console.log('Saving store hub settings:', {
      deliveryMethod,
      preOrderTime,
      finalOrderTime,
      selectedDay,
      openingTime,
      closingTime,
    });
    // API call to save settings
    router.back();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{ paddingHorizontal: 20, paddingTop: 20 }}>
          {/* Header */}
          <Header
            title="Store Hub"
            leftIcon={<ArrowLeft size={24} color="#111827" />}
            onLeftIconPress={() => router.back()}
          />

          <Spacer size="lg" />

          {/* Section Title */}
          <Text variant="body" weight="semibold" align="center">
            Delivery/Order Information
          </Text>

          <Spacer size="xl" />

          {/* Delivery Method */}
          <View style={storeHubStyles.inputContainer}>
            <View style={storeHubStyles.labelRow}>
              <Text variant="label" color="primary">Delivery method</Text>
              <Text style={{ color: '#EF4444' }}> *</Text>
            </View>
            <Spacer size="xs" />
            <CustomDropdown
              options={['Instant', 'Pre-order']}
              placeholder="Select delivery method"
              value={deliveryMethod}
              onChange={(value) => setDeliveryMethod(value as 'Instant' | 'Pre-order')}
            />
          </View>

          <Spacer size="lg" />

          {/* Pre-order Fields (Only show when Pre-order is selected) */}
          {deliveryMethod === 'Pre-order' && (
            <>
              {/* Opening Pre-order Period */}
              <View style={storeHubStyles.inputContainer}>
                <View style={storeHubStyles.labelRow}>
                  <Text variant="label" color="primary">Opening pre-order period</Text>
                  <Text style={{ color: '#EF4444' }}> *</Text>
                  <InfoTooltip />
                </View>
                <Spacer size="xs" />
                
                <View style={storeHubStyles.infoBox}>
                  <Text variant="bodySmall" color="secondary">
                    When the pre orders will be ready for delivery
                  </Text>
                </View>
                
                <Spacer size="sm" />
                
                <CustomDropdown
                  options={[
                    '12:00 AM', '01:00 AM', '02:00 AM', '03:00 AM', '04:00 AM', '05:00 AM',
                    '06:00 AM', '07:00 AM', '08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM',
                    '12:00 PM', '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM',
                    '06:00 PM', '07:00 PM', '08:00 PM', '09:00 PM', '10:00 PM', '11:00 PM',
                  ]}
                  placeholder="00:00 AM"
                  value={preOrderTime}
                  onChange={setPreOrderTime}
                />
              </View>

              <Spacer size="lg" />

              {/* Final Order Time */}
              <View style={storeHubStyles.inputContainer}>
                <View style={storeHubStyles.labelRow}>
                  <Text variant="label" color="primary">Final order time</Text>
                  <Text style={{ color: '#EF4444' }}> *</Text>
                  <InfoTooltip />
                </View>
                <Spacer size="xs" />
                
                <View style={storeHubStyles.infoBox}>
                  <Text variant="bodySmall" color="secondary">
                    Last chance to place your order for today
                  </Text>
                </View>
                
                <Spacer size="sm" />
                
                <CustomDropdown
                  options={[
                    '12:00 AM', '01:00 AM', '02:00 AM', '03:00 AM', '04:00 AM', '05:00 AM',
                    '06:00 AM', '07:00 AM', '08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM',
                    '12:00 PM', '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM',
                    '06:00 PM', '07:00 PM', '08:00 PM', '09:00 PM', '10:00 PM', '11:00 PM',
                  ]}
                  placeholder="00:00 PM"
                  value={finalOrderTime}
                  onChange={setFinalOrderTime}
                />
              </View>

              <Spacer size="lg" />
            </>
          )}

          {/* Opening Times (Always shown) */}
          <View style={storeHubStyles.inputContainer}>
            <View style={storeHubStyles.labelRow}>
              <Text variant="label" color="primary">
                Specify opening times on specific days
              </Text>
              <InfoTooltip />
            </View>
            <Spacer size="xs" />
            
            <View style={storeHubStyles.infoBox}>
              <Text variant="bodySmall" color="secondary">
                Set your opening hours for the week
              </Text>
            </View>
            
            <Spacer size="sm" />
            
            <TimeRowSelector
              day={selectedDay}
              openingTime={openingTime}
              closingTime={closingTime}
              onDayChange={setSelectedDay}
              onOpeningTimeChange={setOpeningTime}
              onClosingTimeChange={setClosingTime}
            />
          </View>

          <Spacer size="xl" />

          {/* Payment Information (Only show for Instant delivery) */}
          {deliveryMethod === 'Instant' && (
            <>
              <View style={storeHubStyles.labelRow}>
                <Text variant="body" weight="semibold">Payment Information</Text>
                <InfoTooltip />
              </View>

              <Spacer size="xs" />

              <View style={storeHubStyles.infoBox}>
                <Text variant="bodySmall" color="secondary">
                  This is where your earnings would be paid into
                </Text>
              </View>

              <Spacer size="md" />

              <PaymentInfoCard
                bankName={paymentInfo.bankName}
                accountNumber={paymentInfo.accountNumber}
              />

              <Spacer size="xl" />

              {/* Save Changes Button (Only show for Instant) */}
              <Button
                label="Save Changes"
                variant="primary"
                size="large"
                fullWidth
                onPress={handleSaveChanges}
              />

              <Spacer size="xl" />
            </>
          )}
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