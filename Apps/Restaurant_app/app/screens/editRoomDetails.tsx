// EditRoomDetailsPage.tsx - Edit room details page
import React, { useState } from 'react';
import { SafeAreaView, ScrollView, View, TouchableOpacity } from 'react-native';
import { ArrowLeft } from 'lucide-react-native';
import { styles } from '@/constants/styles';

// Atomic Components
import { Text } from '@/components/atoms/Text';
import { Spacer } from '@/components/atoms/Spacer';
import { Divider } from '@/components/atoms/Divider';

// Molecule Components
import { Header } from '@/components/molecules/Header';

// Existing Components
import { CustomInput } from '@/components/CustomInput';
import { CustomDropdown } from '@/components/CustomDropDown';
import { FileUpload } from '@/components/FIleUpload';

interface EditRoomDetailsPageProps {
  roomId?: string;
  onBack?: () => void;
  onSave?: (data: any) => void;
}

const EditRoomDetailsPage: React.FC<EditRoomDetailsPageProps> = ({ 
  roomId,
  onBack, 
  onSave 
}) => {
  const [roomName, setRoomName] = useState('Diplomatic Suites');
  const [roomNumber, setRoomNumber] = useState('120');
  const [description, setDescription] = useState('e.g Panoramic pool view, high floor');
  const [amenities, setAmenities] = useState('');
  const [roomImage, setRoomImage] = useState<any>(null);

  const amenitiesOptions = [
    'WiFi',
    'Air Conditioning',
    'TV',
    'Mini Bar',
    'Room Service',
    'Balcony',
    'Ocean View',
    'Private Pool',
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Back Button */}
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <ArrowLeft size={24} color="#111827" />
        </TouchableOpacity>

        <Spacer size="md" />

        {/* Page Title */}
        <Text variant="h3" weight="semibold">Edit Room Details</Text>
        <Spacer size="sm" />
        <Divider spacing={0} />

        <Spacer size="lg" />

        {/* Room Name */}
        <CustomInput
          label="Room Name"
          placeholder="Diplomatic Suites"
          value={roomName}
          onChange={setRoomName}
          required
        />

        {/* Room Number */}
        <CustomInput
          label="Room Number"
          placeholder="120"
          value={roomNumber}
          onChange={setRoomNumber}
          required
        />

        {/* Description */}
        <CustomInput
          label="Description"
          placeholder="e.g Panoramic pool view, high floor"
          value={description}
          onChange={setDescription}
          required
        />

        {/* Hotel Amenities */}
        <CustomDropdown
          label="Hotel Amenities"
          options={amenitiesOptions}
          placeholder="Add Amenities"
          value={amenities}
          onChange={setAmenities}
          required
        />

        <TouchableOpacity style={styles.addAmenitiesBtn}>
          <Text variant="bodySmall" color="primary" weight="semibold">
            + Add Amenities
          </Text>
        </TouchableOpacity>

        <Spacer size="md" />

        {/* Room Image Upload */}
        <FileUpload
          label="Upload room image"
          onUpload={setRoomImage}
          acceptedFormats="PNG, JPEG"
          maxSize="5mb"
          infoText="The image presented to shoppers in their app"
          required
        />

        <Spacer size="xl" />
      </ScrollView>
    </SafeAreaView>
  );
};

export default EditRoomDetailsPage;