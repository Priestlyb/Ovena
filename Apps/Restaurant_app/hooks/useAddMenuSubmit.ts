import { useState } from "react";

import api from "@/services/apiClient";

import { validateMenuForm } from "@/utils/addmenuValidation";
import { buildMenuPayload } from "@/utils/payload";

/* =========================================
   TYPES
========================================= */
type FeedbackVariant =
  | "success"
  | "error"
  | "warning"
  | "info";

type Params = {
  category: string;
  showAddCategory: boolean;
  newCategory: string;

  name: string;
  description: string;
  price: string;

  isActive: boolean;

  useMergeBase: boolean;

  manualBaseName: string;
  manualBaseDescription: string;
  manualBasePrice: string;

  productImage: {
    uri: string;
    uploadedUrl?: string;
  } | null;

  cleanVariants: any[];
  cleanAddons: any[];

  showFeedback: (
    message: string,
    variant: FeedbackVariant,
  ) => void;

  fetchCategories: () => void;

  onSuccess?: () => void;
};

export function useAddMenuSubmit({
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

  showFeedback,

  fetchCategories,

  onSuccess,
}: Params) {
  /* =========================================
     STATE
  ========================================= */
  const [isSubmitting, setIsSubmitting] = useState(false);

  /* =========================================
     SUBMIT HANDLER
  ========================================= */
  const handleSubmit = async () => {
    /* =========================================
       VALIDATION
    ========================================= */
    const error = validateMenuForm({
      category,
      showAddCategory,
      newCategory,
      name,
      price,
      useMergeBase,
      manualBaseName,
      manualBasePrice,
    });

    if (error) {
      showFeedback(error, "error");
      return;
    }

    /* =========================================
       DEBUG IMAGE STATE
    ========================================= */
    console.log("IMAGE STATE CHECK:");
    console.log({
      uri: productImage?.uri,
      uploadedUrl: productImage?.uploadedUrl,
    });

    /* =========================================
       BUILD PAYLOAD
    ========================================= */
    const payload = buildMenuPayload({
      name,
      description,
      price,
      category,
      isActive,
      productImage,
      cleanVariants,
      cleanAddons,
      useMergeBase,
      manualBaseName,
      manualBaseDescription,
      manualBasePrice,
    });

    console.log(
      "FINAL PAYLOAD:",
      JSON.stringify(payload, null, 2),
    );

    setIsSubmitting(true);

    try {
      const response = await api.post(
        "/accounts/onboard/phase3/",
        payload,
      );

      console.log("API SUCCESS RESPONSE:", response?.data);

      showFeedback(
        "Menu item added successfully",
        "success",
      );

      fetchCategories();

      onSuccess?.();
    } catch (error: any) {
      /* =========================================
         IMPORTANT: SHOW REAL BACKEND ERROR
      ========================================= */
      const backendError =
        error?.response?.data;

      const message =
        backendError
          ? typeof backendError === "string"
            ? backendError
            : JSON.stringify(backendError)
          : error?.message || "Something went wrong";

      console.log("SUBMIT ERROR RAW:", error);
      console.log("SUBMIT ERROR DATA:", backendError);

      showFeedback(message, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    handleSubmit,
    isSubmitting,
  };
}