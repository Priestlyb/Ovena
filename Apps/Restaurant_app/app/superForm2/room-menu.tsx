// app/superForm2/room-menu.tsx - Group 5, Page 2 (LAST PAGE OF GROUP 5)
import React, { useState } from 'react';
import { SafeAreaView, ScrollView, View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { CustomInput } from '@/components/CustomInput';
import { CustomDropdown } from '@/components/CustomDropDown';
import { styles } from '@/constants/styles';
import { useCompletionStore } from '@/stores/completionStore';

export default function RoomMenuPage() {
  const router = useRouter();
  const markGroupComplete = useCompletionStore((state) => state.markGroupComplete);
  
  const [roomName, setRoomName] = useState('');
  const [roomNumber, setRoomNumber] = useState('');
  const [description, setDescription] = useState('');
  const [amenities, setAmenities] = useState('');

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
    console.log('[RoomMenu] Marking Group 5 (addMenuItems) as complete');
    
    // Mark Group 5 as complete
    markGroupComplete('addMenuItems');
    
    // Return to checklist
    console.log('[RoomMenu] Returning to checklist');
    router.push('/superForm2/checklist');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={24} color="#111827" />
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
}