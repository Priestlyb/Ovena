// operations.tsx - Updated with SuperForm2 integration
import React, { useState } from 'react';
import { SafeAreaView, ScrollView, View, Text, TouchableOpacity } from 'react-native';
import { CustomDropdown } from '@/components/CustomDropDown';
import { styles } from '@/constants/styles';
import { ArrowLeft } from 'lucide-react-native';
import { SuperForm2PageProps } from '@/types';

const OperationsPage: React.FC<SuperForm2PageProps> = ({ 
  data, 
  setData, 
  onNext, 
  onBack 
}) => {
  const [deliveryMethod, setDeliveryMethod] = useState(data?.deliveryMethod || '');
  const [selectedDay, setSelectedDay] = useState(data?.selectedDay || 'Default');
  const [openingTime, setOpeningTime] = useState(data?.openingTime || '00:00 PM');
  const [closingTime, setClosingTime] = useState(data?.closingTime || '00:00 PM');
  const [preOrderTime, setPreOrderTime] = useState(data?.preOrderTime || '00:00 AM');
  const [finalOrderTime, setFinalOrderTime] = useState(data?.finalOrderTime || '00:00 PM');

  const deliveryMethods = ['Instant', 'Pre-order'];
  const days = ['Default', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const timeSlots = [
    '12:00 AM', '01:00 AM', '02:00 AM', '03:00 AM', '04:00 AM', '05:00 AM',
    '06:00 AM', '07:00 AM', '08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM',
    '12:00 PM', '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM',
    '06:00 PM', '07:00 PM', '08:00 PM', '09:00 PM', '10:00 PM', '11:00 PM',
  ];

  // Check if Pre-order is selected
  const isPreOrder = deliveryMethod === 'Pre-order';

  const handleContinue = () => {
    // Save data before proceeding
    if (setData && data) {
      setData({
        ...data,
        deliveryMethod,
        selectedDay,
        openingTime,
        closingTime,
        preOrderTime,
        finalOrderTime,
      });
    }
    onNext?.();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <ArrowLeft />
        </TouchableOpacity>

        <Text style={styles.pageTitle}>Set up your operations</Text>
        <Text style={styles.subtitle}>Delivery/Order Information</Text>

        <CustomDropdown
          label="Delivery method"
          options={deliveryMethods}
          placeholder={isPreOrder ? "Pre-order" : "Instant"}
          value={deliveryMethod}
          onChange={setDeliveryMethod}
          required
        />

        {/* Show Pre-order fields if Pre-order is selected */}
        {isPreOrder && (
          <>
            <View style={styles.inputContainer}>
              <View style={styles.labelRow}>
                <Text style={styles.label}>Opening pre-order period</Text>
                <Text style={styles.required}> *</Text>
                <TouchableOpacity style={styles.infoIconSmall}>
                  <Text style={styles.infoIconText}>i</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.preOrderInfoBox}>
                <Text style={styles.preOrderInfoText}>
                  When the pre orders will be ready for delivery
                </Text>
              </View>

              <CustomDropdown
                options={timeSlots}
                placeholder="00:00 AM"
                value={preOrderTime}
                onChange={setPreOrderTime}
              />
            </View>

            <View style={styles.inputContainer}>
              <View style={styles.labelRow}>
                <Text style={styles.label}>Final order time</Text>
                <Text style={styles.required}> *</Text>
                <TouchableOpacity style={styles.infoIconSmall}>
                  <Text style={styles.infoIconText}>i</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.preOrderInfoBox}>
                <Text style={styles.preOrderInfoText}>
                  Last chance to place your order for today
                </Text>
              </View>

              <CustomDropdown
                options={timeSlots}
                placeholder="00:00 PM"
                value={finalOrderTime}
                onChange={setFinalOrderTime}
              />
            </View>
          </>
        )}

        {/* Always show opening times section */}
        <View style={styles.openingTimesSection}>
          <View style={styles.openingTimesHeader}>
            <Text style={styles.openingTimesLabel}>
              Specify opening times on specific days
            </Text>
            <TouchableOpacity style={styles.infoIcon}>
              <Text style={styles.infoIconText}>i</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.openingTimesBox}>
            <Text style={styles.openingTimesSubtext}>
              Set your opening hours for the week
            </Text>

            <View style={styles.timeRow}>
              <View style={styles.timeDropdown}>
                <CustomDropdown
                  options={days}
                  placeholder="Default"
                  value={selectedDay}
                  onChange={setSelectedDay}
                />
              </View>

              <View style={styles.timeDropdown}>
                <CustomDropdown
                  options={timeSlots}
                  placeholder="00:00 PM"
                  value={openingTime}
                  onChange={setOpeningTime}
                />
              </View>

              <View style={styles.timeDropdown}>
                <CustomDropdown
                  options={timeSlots}
                  placeholder="00:00 PM"
                  value={closingTime}
                  onChange={setClosingTime}
                />
              </View>
            </View>
          </View>
        </View>

        <TouchableOpacity style={styles.continueBtn} onPress={handleContinue} activeOpacity={0.8}>
          <Text style={styles.continueBtnText}>Continue</Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default OperationsPage;