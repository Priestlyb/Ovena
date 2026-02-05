// profilecompletion.tsx - Updated with SuperForm2 integration
import React, { useState, useEffect } from 'react';
import { SafeAreaView, ScrollView, View, Text, TouchableOpacity, Image } from 'react-native';
import { CustomInput } from '@/components/CustomInput';
import { CustomDropdown } from '@/components/CustomDropDown';
import { FileUpload } from '@/components/FIleUpload';
import { styles } from '@/constants/styles';
import { ArrowLeft, Camera } from 'lucide-react-native';
import { SuperForm2PageProps } from '@/types';

const ProfileCompletionPage: React.FC<SuperForm2PageProps> = ({ 
  data, 
  setData, 
  onNext, 
  onBack 
}) => {
  const [shopName, setShopName] = useState(data?.shopName || '');
  const [shopType, setShopType] = useState(data?.shopType || '');
  const [profileImage, setProfileImage] = useState<any>(data?.profileImage || null);
  const [businessImage, setBusinessImage] = useState<any>(data?.businessImage || null);

  const shopTypes = [
    'Restaurant',
    'Fast Food',
    'Cafe',
    'Food Truck',
    'Catering Service',
    'Bakery',
    'Bar & Grill',
    'Hotel',
  ];

  const handleContinue = () => {
    // Save data before proceeding
    if (setData && data) {
      setData({
        ...data,
        shopName,
        shopType,
        profileImage,
        businessImage,
      });
    }
    onNext?.();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.profileHeader}>
          <TouchableOpacity style={styles.backButton} onPress={onBack}>
            <ArrowLeft />
          </TouchableOpacity>
          <Text style={styles.profileHeaderTitle}>Complete your profile</Text>
        </View>

        <Text style={styles.sectionTitle}>Add Details</Text>
        <View style={styles.dividerLine} />

        {/* Profile Image Upload */}
        <View style={styles.profileImageSection}>
          <View style={styles.profileImageCircle}>
            {profileImage ? (
              <Image source={{ uri: profileImage }} style={styles.profileImage} />
            ) : (
              <View style={styles.profileImagePlaceholder} />
            )}
            <TouchableOpacity 
              style={styles.cameraButton}
              onPress={() => {
                // Handle image upload
                console.log('Upload profile image');
              }}
            >
              <Camera size={20} color="#fff" />
            </TouchableOpacity>
          </View>

          <View style={styles.imageSizeInfo}>
            <Text style={styles.infoIconText}>i</Text>
            <Text style={styles.imageSizeText}>Recommended size is 60 x 60px</Text>
          </View>
        </View>

        {/* Business Image Upload */}
        <View style={styles.inputContainer}>
          <View style={styles.labelRow}>
            <Text style={styles.label}>Upload business image</Text>
            <Text style={styles.required}> *</Text>
            <TouchableOpacity style={styles.infoIconSmall}>
              <Text style={styles.infoIconText}>i</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.uploadInfoBox}>
            <Text style={styles.uploadInfoText}>
              Upload a high-quality image for your top menu item to entice hungry customers
            </Text>
          </View>

          <FileUpload
            onUpload={setBusinessImage}
            acceptedFormats="PNG, JPEG"
            maxSize="5mb"
            label='Click to upload business image'
          />
        </View>

        <CustomInput
          label="Shop name"
          placeholder="e.g ExampleLimited"
          value={shopName}
          onChange={setShopName}
          required
        />

        <CustomDropdown
          label="What kind of shop?"
          options={shopTypes}
          placeholder="Select shop type"
          value={shopType}
          onChange={setShopType}
          required
        />

        <TouchableOpacity style={styles.continueBtn} onPress={handleContinue} activeOpacity={0.8}>
          <Text style={styles.continueBtnText}>Continue</Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfileCompletionPage;