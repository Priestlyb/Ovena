// roomMenu.tsx - Updated with SuperForm2 integration
import React, { useState } from 'react';
import { SafeAreaView, ScrollView, View, Text, TouchableOpacity } from 'react-native';
import { CustomInput } from '@/components/CustomInput';
import { CustomDropdown } from '@/components/CustomDropDown';
import { styles } from '@/constants/styles';
import { ArrowLeft } from 'lucide-react-native';
import { SuperForm2PageProps } from '@/types';

const RoomMenuPage: React.FC<SuperForm2PageProps> = ({ 
  data, 
  setData, 
  onNext, 
  onBack 
}) => {
  const [roomName, setRoomName] = useState(data?.roomName || '');
  const [roomNumber, setRoomNumber] = useState(data?.roomNumber || '');
  const [description, setDescription] = useState(data?.roomDescription || '');
  const [amenities, setAmenities] = useState(data?.roomAmenities || '');

  const amenitiesOptions = [
    'WiFi',
    'Air Conditioning',
    'TV',
    'Mini Bar',
    'Room Service',
    'Balcony',
    'Ocean View',
  ];

  const handleContinue = () => {
    // Save data before proceeding (this is the final page)
    if (setData && data) {
      setData({
        ...data,
        roomName,
        roomNumber,
        roomDescription: description,
        roomAmenities: amenities,
      });
    }
    // Trigger final submission
    onNext?.();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <ArrowLeft />
        </TouchableOpacity>

        <Text style={styles.pageTitle}>Set up your Menu</Text>
        <Text style={styles.subtitle}>Add you first product</Text>

        <Text style={styles.sectionTitle}>Add Room Details</Text>
        <View style={styles.dividerLine} />

        <CustomInput
          label="Room Name"
          placeholder="Diplomatic Suites"
          value={roomName}
          onChange={setRoomName}
          required
        />

        <CustomInput
          label="Room Number"
          placeholder="120"
          value={roomNumber}
          onChange={setRoomNumber}
          required
        />

        <CustomInput
          label="Description"
          placeholder="e.g Panoramic pool view, high floor"
          value={description}
          onChange={setDescription}
          required
        />

        <CustomDropdown
          label="Hotel Amenities"
          options={amenitiesOptions}
          placeholder="Add Amenities"
          value={amenities}
          onChange={setAmenities}
          required
        />

        <TouchableOpacity style={styles.addAmenitiesBtn}>
          <Text style={styles.addAmenitiesText}>+ Add Amenities</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.continueBtn} onPress={handleContinue} activeOpacity={0.8}>
          <Text style={styles.continueBtnText}>Submit</Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default RoomMenuPage;