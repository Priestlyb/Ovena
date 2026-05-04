import { ArrowLeft } from "lucide-react-native";
import React from "react";
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
} from "react-native";

import { AddonSection } from "@/components/AddonSection";
import { BaseItemSection } from "@/components/BaseItemSection";
import { CategorySection } from "@/components/CategorySection";
import { CustomSwitch } from "@/components/CustomSwitch";
import FeedbackModal from "@/components/FeedbackModal";
import { ImageSection } from "@/components/ImageSection";
import { ProductInfoSection } from "@/components/ProductInfoSection";
import { VariantSection } from "@/components/VariantSection";
import { styles } from "@/constants/styles";

import { formatPrice } from "@/utils/formatPrice";
import { useEditMenuDetails } from "../../hooks/useEditMenuDetails";

export default function EditMenuDetailsPage() {
  const {
    router,
    categories,
    category,
    setCategory,
    newCategory,
    setNewCategory,
    showAddCategory,
    setShowAddCategory,
    handleAddCategory,

    productImage,
    uploadProgress,
    handleImageUpload,
    removeImage,

    variantGroups,
    setVariantGroups,
    addVariantGroup,
    addVariantOption,

    addonGroups,
    setAddonGroups,
    addAddonGroup,
    addAddon,

    isActive,
    setIsActive,

    useMergeBase,
    setUseMergeBase,
    manualBaseName,
    setManualBaseName,
    manualBaseDescription,
    setManualBaseDescription,
    manualBasePrice,
    setManualBasePrice,

    name,
    setName,
    description,
    setDescription,
    price,
    setPrice,

    feedback,
    setFeedback,

    handleSubmit,
  } = useEditMenuDetails();

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView style={styles.container}>
          <TouchableOpacity onPress={() => router.back()}>
            <ArrowLeft size={24} />
          </TouchableOpacity>

          <Text style={styles.pageTitle}>Edit Menu Item</Text>

          <CategorySection
            categories={categories}
            category={category}
            setCategory={setCategory}
            showAddCategory={showAddCategory}
            setShowAddCategory={setShowAddCategory}
            newCategory={newCategory}
            setNewCategory={setNewCategory}
            handleAddCategory={handleAddCategory}
          />

          <CustomSwitch
            label="Menu Active"
            value={isActive}
            onValueChange={setIsActive}
          />

          <BaseItemSection
            useMergeBase={useMergeBase}
            setUseMergeBase={setUseMergeBase}
            manualBaseName={manualBaseName}
            setManualBaseName={setManualBaseName}
            manualBaseDescription={manualBaseDescription}
            setManualBaseDescription={setManualBaseDescription}
            manualBasePrice={manualBasePrice}
            setManualBasePrice={setManualBasePrice}
            formatPrice={formatPrice}
          />

          <ProductInfoSection
            name={name}
            setName={setName}
            description={description}
            setDescription={setDescription}
            price={price}
            setPrice={setPrice}
            formatPrice={formatPrice}
          />

          <ImageSection
            productImage={productImage}
            uploadProgress={uploadProgress}
            handleImageUpload={handleImageUpload}
            removeImage={removeImage}
          />

          <VariantSection
            variantGroups={variantGroups}
            setVariantGroups={setVariantGroups}
            addVariantGroup={addVariantGroup}
            addVariantOption={addVariantOption}
            formatPrice={formatPrice}
          />

          <AddonSection
            addonGroups={addonGroups}
            setAddonGroups={setAddonGroups}
            addAddonGroup={addAddonGroup}
            addAddon={addAddon}
            formatPrice={formatPrice}
          />

          <TouchableOpacity style={styles.continueBtn} onPress={handleSubmit}>
            <Text style={styles.continueBtnText}>Update Menu</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>

      <FeedbackModal
        visible={feedback.visible}
        message={feedback.message}
        variant={feedback.variant}
        onClose={() => setFeedback((p) => ({ ...p, visible: false }))}
      />
    </SafeAreaView>
  );
}
