import { unformatPrice } from "./formatPrice";

type Params = {
  category: string;
  showAddCategory: boolean;
  newCategory: string;

  name: string;
  price: string;

  useMergeBase: boolean;

  manualBaseName: string;
  manualBasePrice: string;
};

export const validateMenuForm = ({
  category,
  showAddCategory,
  newCategory,
  name,
  price,
  useMergeBase,
  manualBaseName,
  manualBasePrice,
}: Params) => {
  // CATEGORY
  if (!category) {
    return "Please select or add a category";
  }

  // UNSAVED CATEGORY
  if (showAddCategory && newCategory.trim()) {
    return "You added a category but didn’t save it";
  }

  // NAME
  if (!name.trim()) {
    return "Product name is required";
  }

  // PRICE
  if (!price.trim()) {
    return "Product price is required";
  }

  if (unformatPrice(price) <= 0) {
    return "Price must be greater than 0";
  }

  // BASE ITEM VALIDATION
  if (!useMergeBase) {
    if (!manualBaseName.trim()) {
      return "Base item name is required";
    }

    if (!manualBasePrice.trim()) {
      return "Base item price is required";
    }

    if (unformatPrice(manualBasePrice) <= 0) {
      return "Base item price must be greater than 0";
    }
  }

  return null;
};