// app/superForm2/profile.tsx - Group 2 (LAST AND ONLY PAGE OF GROUP 2)
import React, { useState } from 'react';
import { SafeAreaView, ScrollView, View, Text, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Camera } from 'lucide-react-native';
import { CustomInput } from '@/components/CustomInput';
import { CustomDropdown } from '@/components/CustomDropDown';
import { FileUpload } from '@/components/FIleUpload';
import { styles } from '@/constants/styles';
import { useCompletionStore } from '@/stores/completionStore';

export default function ProfilePage() {
  const router = useRouter();
  const markGroupComplete = useCompletionStore((state) => state.markGroupComplete);
  
  const [shopName, setShopName] = useState('');
  const [shopType, setShopType] = useState('');
  const [profileImage, setProfileImage] = useState<any>(null);
  const [businessImage, setBusinessImage] = useState<any>(null);

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
    console.log('[Profile] Marking Group 2 (completeProfile) as complete');
    
    // Mark Group 2 as complete
    markGroupComplete('completeProfile');
    
    // Return to checklist
    console.log('[Profile] Returning to checklist');
    router.push('/superForm2/checklist');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.profileHeader}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <ArrowLeft size={24} color="#111827" />
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
              onPress={() => console.log('Upload profile image')}
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
}