// /screens/addMenuItems

import { useRouter } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import React, { useMemo, useState } from "react";

import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  Text,
  View,
} from "react-native";

import { styles } from "@/constants/styles";

/* =========================================
   COMPONENTS
========================================= */

import { AddonSection } from "@/components/AddonSection";
import { BaseItemSection } from "@/components/BaseItemSection";
import { CategorySection } from "@/components/CategorySection";
import { CustomSwitch } from "@/components/CustomSwitch";
import FeedbackModal from "@/components/FeedbackModal";
import { ImageSection } from "@/components/ImageSection";
import { ProductInfoSection } from "@/components/ProductInfoSection";
import { SubmitButton } from "@/components/SubmitButton";
import { VariantSection } from "@/components/VariantSection";
import { Header } from "@/components/molecules/Header";

/* =========================================
   HOOKS
========================================= */

import { useAddMenuSubmit } from "@/hooks/useAddMenuSubmit";
import { useAddons } from "@/hooks/useAddons";
import { useCategories } from "@/hooks/useCategories";
import { useFeedback } from "@/hooks/useFeedback";
import { useImageUploader } from "@/hooks/useImageUploader";
import { useVariants } from "@/hooks/useVariants";

/* =========================================
   UTILS
========================================= */

import { formatPrice, unformatPrice } from "@/utils/formatPrice";

import { cleanText } from "@/utils/text";

type ProductImageState = {
  uri: string;
  uploadedUrl?: string;
} | null;

export default function MenuItemsPage() {
  const router = useRouter();

  /* ================= CATEGORY ================= */

  const {
    categories,
    category,
    setCategory,
    newCategory,
    setNewCategory,
    showAddCategory,
    setShowAddCategory,
    fetchCategories,
    handleAddCategory,
  } = useCategories();

  /* ================= VARIANTS ================= */

  const { variantGroups, setVariantGroups, addVariantGroup, addVariantOption } =
    useVariants();

  /* ================= ADDONS ================= */

  const { addonGroups, setAddonGroups, addAddonGroup, addAddon } = useAddons();

  /* ================= FEEDBACK ================= */

  const { feedback, setFeedback, showFeedback } = useFeedback();

  /* ================= IMAGE ================= */

  const { pickImage, uploadImage } = useImageUploader(showFeedback);

  const [productImage, setProductImage] = useState<ProductImageState>(null);

  const [uploadProgress] = useState(0);

  const [isUploading] = useState(false);

  /* =========================================
     PICK PRODUCT IMAGE ONLY
     UPLOAD HAPPENS ON SUBMIT
  ========================================= */

  const handleImageUpload = async () => {
    const image = await pickImage();

    if (!image) return;

    setProductImage({
      uri: image.uri,
    });
  };

  const removeImage = () => {
    setProductImage(null);
  };

  /* ================= ADDON IMAGE PICK ================= */

  const handlePickAddonImage = async (
    groupIndex: number,
    addonIndex: number,
  ) => {
    const image = await pickImage();

    if (!image) return;

    setAddonGroups((prev) =>
      prev.map((group, gIndex) => {
        if (gIndex !== groupIndex) return group;

        return {
          ...group,

          addons: group.addons.map((addon, aIndex) => {
            if (aIndex !== addonIndex) return addon;

            return {
              ...addon,

              image: {
                uri: image.uri,
              },
            };
          }),
        };
      }),
    );
  };

  const hasPendingAddonImageChange = (
    groupIndex: number,
    addonIndex: number,
  ) => {
    return Boolean(addonGroups[groupIndex]?.addons[addonIndex]?.image);
  };

  const cancelAddonImageChange = (groupIndex: number, addonIndex: number) => {
    setAddonGroups((prev) =>
      prev.map((group, gIndex) => {
        if (gIndex !== groupIndex) return group;

        return {
          ...group,

          addons: group.addons.map((addon, aIndex) => {
            if (aIndex !== addonIndex) return addon;

            return {
              ...addon,
              image: null,
            };
          }),
        };
      }),
    );
  };

  /* ================= DELETE ================= */

  const deleteVariantOption = (groupIndex: number, optionIndex: number) => {
    setVariantGroups((prev) =>
      prev.map((group, index) => {
        if (index !== groupIndex) return group;

        return {
          ...group,

          options: group.options.filter((_, i) => i !== optionIndex),
        };
      }),
    );
  };

  const deleteAddon = (groupIndex: number, addonIndex: number) => {
    setAddonGroups((prev) =>
      prev.map((group, index) => {
        if (index !== groupIndex) return group;

        return {
          ...group,

          addons: group.addons.filter((_, i) => i !== addonIndex),
        };
      }),
    );
  };

  /* ================= LOCAL STATE ================= */

  const [isActive, setIsActive] = useState(true);

  const [useMergeBase, setUseMergeBase] = useState(true);

  const [manualBaseName, setManualBaseName] = useState("");

  const [manualBaseDescription, setManualBaseDescription] = useState("");

  const [manualBasePrice, setManualBasePrice] = useState("");

  const [name, setName] = useState("");

  const [description, setDescription] = useState("");

  const [price, setPrice] = useState("");

  /* ================= CLEAN VARIANTS ================= */

  const cleanVariants = useMemo(() => {
    return variantGroups
      .filter((g) => g.name && g.options.length)
      .map((g) => ({
        name: cleanText(g.name),

        is_required: Boolean(g.is_required),

        options: g.options.map((o) => ({
          name: cleanText(o.name),

          price_diff: unformatPrice(o.price_diff),
        })),
      }));
  }, [variantGroups]);

  /* ================= CLEAN ADDONS ================= */

  const cleanAddons = useMemo(() => {
    return addonGroups
      .filter((g) => g.name && g.addons.length)
      .map((g) => ({
        name: cleanText(g.name),

        is_required: Boolean(g.is_required),

        max_selection: Number(g.max_selection || 0),

        addons: g.addons.map((a) => ({
          name: cleanText(a.name),

          description: cleanText(a.description || ""),

          price: unformatPrice(a.price),

          image: a.image,

          base_item: {
            name: cleanText(a.name),

            description: cleanText(a.description || ""),

            price: unformatPrice(a.price),

            image: a.image,
          },
        })),
      }));
  }, [addonGroups]);

  /* ================= SUBMIT ================= */

  const { handleSubmit, isSubmitting } = useAddMenuSubmit({
    category,

    showAddCategory,

    newCategory,

    name,

    description,

    price,

    isActive,

    useMergeBase,

    manualBaseName,

    manualBaseDescription,

    manualBasePrice,

    productImage,

    cleanVariants,

    cleanAddons,

    uploadImage,

    showFeedback,

    onSuccess: () => {
      router.push("/(tabs)/products/food");
    },
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView style={styles.container}>
          <Header
            title="Set up your Menu"
            leftIcon={<ArrowLeft size={24} />}
            onLeftIconPress={() => router.back()}
          />

          <Text
            style={[
              styles.sectionTitle,
              {
                marginBottom: 20,
              },
            ]}
          >
            Basic Info
          </Text>

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
            hasPendingImageChange={Boolean(productImage)}
            cancelImageChange={removeImage}
            isUploading={isUploading}
          />

          <VariantSection
            variantGroups={variantGroups}
            setVariantGroups={setVariantGroups}
            deleteVariantOption={deleteVariantOption}
            addVariantGroup={addVariantGroup}
            addVariantOption={addVariantOption}
            formatPrice={formatPrice}
          />

          <AddonSection
            addonGroups={addonGroups}
            setAddonGroups={setAddonGroups}
            deleteAddon={deleteAddon}
            addAddonGroup={addAddonGroup}
            addAddon={addAddon}
            formatPrice={formatPrice}
            onPickAddonImage={handlePickAddonImage}
            hasPendingAddonImageChange={hasPendingAddonImageChange}
            cancelAddonImageChange={cancelAddonImageChange}
            uploadProgress={uploadProgress}
          />

          <SubmitButton loading={isSubmitting} onPress={handleSubmit} />

          <View style={{ height: 50 }} />
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
