// app/superForm2/menu-items.tsx - Group 5, Page 1
import React, { useState } from 'react';
import { SafeAreaView, ScrollView, View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { CustomInput } from '@/components/CustomInput';
import { CustomDropdown } from '@/components/CustomDropDown';
import { FileUpload } from '@/components/FIleUpload';
import { styles } from '@/constants/styles';

export default function MenuItemsPage() {
  const router = useRouter();
  const [category, setCategory] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [productImage, setProductImage] = useState<any>(null);

  const categories = [
    'Appetizers',
    'Main Course',
    'Desserts',
    'Beverages',
    'Sides',
    'Specials',
    'Breakfast',
    'Lunch',
    'Dinner',
  ];

  const handleContinue = () => {
    console.log('[MenuItems] Navigating to Room Menu');
    router.push('/superForm2/room-menu');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={24} color="#111827" />
        </TouchableOpacity>

        <Text style={styles.pageTitle}>Set up your Menu</Text>
        <Text style={styles.subtitle}>Add you first product</Text>

        <Text style={styles.sectionTitle}>Add Details</Text>
        <View style={styles.dividerLine} />

        <View style={styles.inputContainer}>
          <View style={styles.labelRow}>
            <Text style={styles.label}>Category</Text>
            <Text style={styles.required}> *</Text>
          </View>
          
          <CustomDropdown
            options={categories}
            placeholder="Add category"
            value={category}
            onChange={setCategory}
          />

          <TouchableOpacity style={styles.addCategoryBtn}>
            <Text style={styles.addCategoryText}>+ Add category</Text>
          </TouchableOpacity>
        </View>

        <CustomInput
          label="Name"
          placeholder="Beans"
          value={name}
          onChange={setName}
          required
        />

        <CustomInput
          label="Description"
          placeholder="e.g Stew and Rice"
          value={description}
          onChange={setDescription}
          required
        />

        <View style={styles.inputContainer}>
          <View style={styles.labelRow}>
            <Text style={styles.label}>Upload product image</Text>
            <Text style={styles.required}> *</Text>
            <TouchableOpacity style={styles.infoIconSmall}>
              <Text style={styles.infoIconText}>i</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.uploadInfoBox}>
            <Text style={styles.uploadInfoText}>
              The image presented to shoppers in their app
            </Text>
          </View>

          <FileUpload
            onUpload={setProductImage}
            acceptedFormats="PNG, JPEG"
            maxSize="5mb"
            label='Product Image'
          />
        </View>

        <TouchableOpacity style={styles.continueBtn} onPress={handleContinue} activeOpacity={0.8}>
          <Text style={styles.continueBtnText}>Continue</Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}