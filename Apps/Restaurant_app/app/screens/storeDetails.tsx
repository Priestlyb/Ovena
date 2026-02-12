// StoreDetailsPage.tsx - Store details page
import React, { useState } from 'react';
import { SafeAreaView, ScrollView, View, TouchableOpacity } from 'react-native';
import { ArrowLeft, Camera, MessageCircle } from 'lucide-react-native';
import { styles } from '@/constants/styles';

// Atomic Components
import { Text } from '@/components/atoms/Text';
import { Icon } from '@/components/atoms/Icon';
import { Spacer } from '@/components/atoms/Spacer';
import { Avatar } from '@/components/atoms/Avatar';

// Molecule Components
import { Header } from '@/components/molecules/Header';
import { Card } from '@/components/molecules/Card';

// Existing Components
import { CustomInput } from '@/components/CustomInput';
import { FileUpload } from '@/components/FIleUpload';
import { FloatingChatButton } from '@/components/FloatingChatButton';

interface StoreDetailsPageProps {
  onBack?: () => void;
  onSave?: (data: StoreDetails) => void;
}

interface StoreDetails {
  profileImage: any;
  businessImage: any;
  shopName: string;
  description: string;
}

const StoreDetailsPage: React.FC<StoreDetailsPageProps> = ({ onBack, onSave }) => {
  const [profileImage, setProfileImage] = useState<any>(null);
  const [businessImage, setBusinessImage] = useState<any>(null);
  const [shopName, setShopName] = useState('');
  const [description, setDescription] = useState('');

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <Header
          title="Store Details"
          leftIcon={<ArrowLeft size={24} color="#111827" />}
          onLeftIconPress={onBack}
        />

        <Spacer size="lg" />

        {/* Profile Image Section */}
        <View style={styles.storeProfileSection}>
          <View style={styles.storeProfileImageContainer}>
            <Avatar
              source={profileImage}
              size="xl"
              shape="circle"
              backgroundColor="#FEF3E7"
            />
            <TouchableOpacity 
              style={styles.storeCameraButton}
              onPress={() => console.log('Upload profile image')}
            >
              <Camera size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        <Spacer size="sm" />

        {/* Image Size Info */}
        <Card variant="filled" padding="sm">
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Icon
              icon={<Text variant="caption">ⓘ</Text>}
              size="small"
            />
            <Spacer size="xs" horizontal />
            <Text variant="caption" color="secondary">
              Recommended size is 60 x 60px
            </Text>
          </View>
        </Card>

        <Spacer size="lg" />

        {/* Business Image Upload */}
        <FileUpload
          label="Upload business image"
          onUpload={setBusinessImage}
          acceptedFormats="PNG, JPEG"
          maxSize="5mb"
          infoText="Upload a high-quality image for your top menu item to entice hungry customers"
          required
        />

        <Spacer size="md" />

        {/* Shop Name */}
        <CustomInput
          label="Shop name"
          placeholder="e.g ExampleLimited"
          value={shopName}
          onChange={setShopName}
          required
        />
        <Spacer size="md" />

        {/* Description */}
        <CustomInput
          label="Description"
          placeholder="e.g We Sell Sweet Chicken pie"
          value={description}
          onChange={setDescription}
        />

        <Spacer size="md" />
        {/* Email */}
        <CustomInput
          label="Official Email"
          placeholder="e.g example@company.com"
          value={description}
          onChange={setDescription}
        />
        <Spacer size="md" />

        {/* Phone Number */}
        <CustomInput
          label="Official Phone Number"
          placeholder="e.g +234 801 234 5678"
          value={description}
          onChange={setDescription}
        />

        <Spacer size="xxl" />

        {/* Address */}
        <CustomInput
          label="Address"
          placeholder="e.g 123 Main Street, City"
          value={description}
          onChange={setDescription}
        />

        <Spacer size="xxl" />

        {/* Save Button */}
        <TouchableOpacity
          style={styles.saveButton}
          onPress={() => {
            const data: StoreDetails = {
              profileImage,
              businessImage,
              shopName,
              description,
            };
            onSave && onSave(data);
          }}
          activeOpacity={0.7}
        >
          <Text variant="body" weight="semibold" style={{ color: '#fff' }}>
            Save Changes
          </Text>
        </TouchableOpacity>

       
      </ScrollView>

      {/* Floating Chat Button */}
      <FloatingChatButton
        icon={<MessageCircle size={28} color="#fff" />}
        onPress={() => console.log('Chat')}
        position="primary"
      />
    </SafeAreaView>
  );
};

export default StoreDetailsPage;