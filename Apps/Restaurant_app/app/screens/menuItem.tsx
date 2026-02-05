// menuItem.tsx - Updated with SuperForm2 integration
import React, { useState } from 'react';
import { SafeAreaView, ScrollView, View, Text, TouchableOpacity } from 'react-native';
import { CustomInput } from '@/components/CustomInput';
import { CustomDropdown } from '@/components/CustomDropDown';
import { FileUpload } from '@/components/FIleUpload';
import { styles } from '@/constants/styles';
import { ArrowLeft } from 'lucide-react-native';
import { SuperForm2PageProps } from '@/types';

const MenuItemsPage: React.FC<SuperForm2PageProps> = ({ 
  data, 
  setData, 
  onNext, 
  onBack 
}) => {
  const [category, setCategory] = useState(data?.menuCategory || '');
  const [name, setName] = useState(data?.menuItemName || '');
  const [description, setDescription] = useState(data?.menuItemDescription || '');
  const [productImage, setProductImage] = useState<any>(data?.menuItemImage || null);

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
    // Save data before proceeding
    if (setData && data) {
      setData({
        ...data,
        menuCategory: category,
        menuItemName: name,
        menuItemDescription: description,
        menuItemImage: productImage,
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
};

export default MenuItemsPage;