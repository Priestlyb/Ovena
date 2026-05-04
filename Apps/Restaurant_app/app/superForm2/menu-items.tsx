import { useRouter } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import React, { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
} from "react-native";

import { styles } from "@/constants/styles";
import api from "@/services/apiClient";

import { AddonSection } from "@/components/AddonSection";
import { BaseItemSection } from "@/components/BaseItemSection";
import { CategorySection } from "@/components/CategorySection";
import { CustomSwitch } from "@/components/CustomSwitch";
import FeedbackModal from "@/components/FeedbackModal";
import { ImageSection } from "@/components/ImageSection";
import { ProductInfoSection } from "@/components/ProductInfoSection";
import { VariantSection } from "@/components/VariantSection";

// HOOKS
import { useAddons } from "@/hooks/useAddons";
import { useCategories } from "@/hooks/useCategories";
import { useImageUpload } from "@/hooks/useImageUpload";
import { useVariants } from "@/hooks/useVariants";

export default function MenuItemsPage() {
  const router = useRouter();

  /* =========================================================
     HOOKS
  ========================================================= */
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

  const { productImage, uploadProgress, handleImageUpload, removeImage } =
    useImageUpload();

  const { variantGroups, setVariantGroups, addVariantGroup, addVariantOption } =
    useVariants();

  const { addonGroups, setAddonGroups, addAddonGroup, addAddon } = useAddons();

  /* =========================================================
     LOCAL STATE
  ========================================================= */
  const [isActive, setIsActive] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [useMergeBase, setUseMergeBase] = useState(true);
  const [manualBaseName, setManualBaseName] = useState("");
  const [manualBaseDescription, setManualBaseDescription] = useState("");
  const [manualBasePrice, setManualBasePrice] = useState("");

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");

  const [feedback, setFeedback] = useState({
    visible: false,
    message: "",
    variant: "error" as "success" | "error" | "warning" | "info",
  });

  const showError = (message: string) => {
    setFeedback({
      visible: true,
      message,
      variant: "error",
    });
  };

  /* =========================================================
     HELPERS
  ========================================================= */
  const cleanText = (text: string) => text.trim();

  const formatPrice = (value: string) => {
    const num = value.replace(/,/g, "");
    if (!num) return "";
    return Number(num).toLocaleString("en-NG");
  };

  const parsePrice = (value: string) => {
    return Number(value.replace(/,/g, "")) || 0;
  };

  /* =========================================================
     VALIDATION
  ========================================================= */
  const validateForm = () => {
    // Category
    if (!category) {
      return "Please select or add a category";
    }

    if (showAddCategory && newCategory.trim()) {
      return "You added a category but didn’t save it";
    }

    // Product Info
    if (!name.trim()) {
      return "Product name is required";
    }

    if (!price.trim()) {
      return "Product price is required";
    }

    if (parsePrice(price) <= 0) {
      return "Price must be greater than 0";
    }

    // Base Item
    if (!useMergeBase) {
      if (!manualBaseName.trim()) {
        return "Base item name is required";
      }

      if (!manualBasePrice.trim()) {
        return "Base item price is required";
      }
    }

    // Variants
    for (const group of variantGroups) {
      if (!group.name.trim()) {
        return "Variant group name is required";
      }

      for (const option of group.options) {
        if (!option.name.trim()) {
          return "Variant option name is required";
        }
      }
    }

    // Addons
    for (const group of addonGroups) {
      if (!group.name.trim()) {
        return "Addon group name is required";
      }

      for (const addon of group.addons) {
        if (!addon.name.trim()) {
          return "Addon name is required";
        }
      }
    }

    return null;
  };

  /* =========================================================
     CLEAN DATA
  ========================================================= */
  const cleanVariants = variantGroups
    .filter((g) => g.name && g.options.length)
    .map((g) => ({
      name: cleanText(g.name),
      is_required: g.is_required || true,
      options: g.options.map((o) => ({
        name: cleanText(o.name),
        price_diff: parsePrice(o.price_diff),
      })),
    }));

  const cleanAddons = addonGroups
    .filter((g) => g.name && g.addons.length)
    .map((g) => ({
      name: cleanText(g.name),
      is_required: g.is_required || true,
      max_selection: Number(g.max_selection || 0),
      addons: g.addons.map((a) => {
        const price = parsePrice(a.price);
        return {
          price,
          base_item: {
            name: cleanText(a.name),
            price,
          },
        };
      }),
    }));

  /* =========================================================
     SUBMIT
  ========================================================= */
  const handleSubmit = async () => {
    const error = validateForm();

    if (error) {
      return showError(error);
    }

    setIsSubmitting(true);

    try {
      const cleanedName = cleanText(name);
      const cleanedDescription = cleanText(description);
      const parsedPrice = parsePrice(price);

      const baseItemPayload = useMergeBase
        ? {
            name: cleanedName,
            description: cleanedDescription,
            price: parsedPrice,
          }
        : {
            name: cleanText(manualBaseName),
            description: cleanText(manualBaseDescription),
            price: parsePrice(manualBasePrice),
          };

      const payload = {
        menus: [
          {
            name: "Main Menu",
            is_active: isActive,
            categories: [
              {
                name: cleanText(category),
                items: [
                  {
                    custom_name: cleanedName,
                    description: cleanedDescription,
                    price: parsedPrice,
                    base_item: baseItemPayload,
                    variant_groups: cleanVariants,
                    addon_groups: cleanAddons,
                  },
                ],
              },
            ],
          },
        ],
      };

      await api.post("/accounts/onboard/phase3/", payload);

      setFeedback({
        visible: true,
        message: "Menu item added successfully",
        variant: "success",
      });

      fetchCategories();
      router.push("/(tabs)");
    } catch (error: any) {
      showError(
        error?.response?.data
          ? JSON.stringify(error.response.data)
          : "Something went wrong",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  /* =========================================================
     UI
  ========================================================= */
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

          <Text style={styles.pageTitle}>Set up your Menu</Text>
          <Text style={[styles.sectionTitle, { marginBottom: 20 }]}>
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

          <TouchableOpacity
            style={[styles.continueBtn, isSubmitting && { opacity: 0.6 }]}
            onPress={handleSubmit}
            disabled={isSubmitting}
          >
            <Text style={styles.continueBtnText}>
              {isSubmitting ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.continueBtnText}>Submit</Text>
              )}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>

      <FeedbackModal
        visible={feedback.visible}
        message={feedback.message}
        variant={feedback.variant}
        onClose={() => setFeedback((prev) => ({ ...prev, visible: false }))}
      />
    </SafeAreaView>
  );
}
