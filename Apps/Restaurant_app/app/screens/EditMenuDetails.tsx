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
import { CategorySection } from "@/components/CategorySection";
import { CustomSwitch } from "@/components/CustomSwitch";
import FeedbackModal from "@/components/FeedbackModal";
import { ImageSection } from "@/components/ImageSection";
import { ProductInfoSection } from "@/components/ProductInfoSection";
import { VariantSection } from "@/components/VariantSection";
import { Spacer } from "@/components/atoms/Spacer";
import { Header } from "@/components/molecules/Header";

import { styles } from "@/constants/styles";
import { formatPrice } from "@/utils/formatPrice";

import { useEditMenuDetails } from "../../hooks/foodTab/useEditMenuDetails";

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

    // IMAGE
    productImage,
    uploadProgress,
    handleImageUpload,
    hasPendingImageChange,
    cancelImageChange,

    // VARIANTS
    variantGroups,
    setVariantGroups,
    addVariantGroup,
    addVariantOption,
    deleteVariantOption,

    // ADDONS
    addonGroups,
    setAddonGroups,
    addAddonGroup,
    addAddon,
    deleteAddon,

    pickAddonImage,
    hasPendingAddonImageChange,
    cancelAddonImageChange,

    // MENU
    isActive,
    setIsActive,

    name,
    setName,
    description,
    setDescription,
    price,
    setPrice,

    feedback,
    setFeedback,

    handleSubmit,
    isSubmitting,
  } = useEditMenuDetails();

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          style={styles.container}
          showsVerticalScrollIndicator={false}
        >
          {/* HEADER */}
          <Header
            title="Edit Menu Item"
            leftIcon={<ArrowLeft size={22} color="#111" />}
            onLeftIconPress={() => router.back()}
          />

          <Spacer size="lg" />

          {/* CATEGORY */}
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

          {/* ACTIVE */}
          <CustomSwitch
            label="Menu Active"
            value={isActive}
            onValueChange={setIsActive}
          />

          {/* PRODUCT INFO */}
          <ProductInfoSection
            name={name}
            setName={setName}
            description={description}
            setDescription={setDescription}
            price={price}
            setPrice={setPrice}
            formatPrice={formatPrice}
          />

          {/* IMAGE */}
          <ImageSection
            productImage={productImage}
            uploadProgress={uploadProgress}
            handleImageUpload={handleImageUpload}
            hasPendingImageChange={hasPendingImageChange}
            cancelImageChange={cancelImageChange}
            isUploading={isSubmitting}
          />

          {/* VARIANTS */}
          <VariantSection
            variantGroups={variantGroups}
            setVariantGroups={setVariantGroups}
            addVariantGroup={addVariantGroup}
            addVariantOption={addVariantOption}
            deleteVariantOption={deleteVariantOption}
            formatPrice={formatPrice}
          />

          {/* ADDONS */}
          <AddonSection
            addonGroups={addonGroups}
            setAddonGroups={setAddonGroups}
            addAddonGroup={addAddonGroup}
            addAddon={addAddon}
            deleteAddon={deleteAddon}
            formatPrice={formatPrice}
            onPickAddonImage={pickAddonImage}
            hasPendingAddonImageChange={hasPendingAddonImageChange}
            cancelAddonImageChange={cancelAddonImageChange}
            uploadProgress={uploadProgress}
          />

          {/* UPDATE BUTTON */}
          <TouchableOpacity
            style={[styles.continueBtn, isSubmitting && { opacity: 0.5 }]}
            onPress={handleSubmit}
            disabled={isSubmitting}
          >
            <Text style={styles.continueBtnText}>
              {isSubmitting ? "Updating..." : "Update Menu"}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>

      <FeedbackModal
        visible={feedback.visible}
        message={feedback.message}
        variant={feedback.variant}
        onClose={() =>
          setFeedback((prev) => ({
            ...prev,
            visible: false,
          }))
        }
      />
    </SafeAreaView>
  );
}
