import { useState } from "react";

export function useEditMenuState() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [menuIdState, setMenuId] = useState<any>(null);
  const [categoryIdState, setCategoryId] = useState<any>(null);
  const [itemIdState, setItemId] = useState<any>(null);
  const [baseItemId, setBaseItemId] = useState<any>(null);

  const [menuName, setMenuName] = useState("");
  const [category, setCategory] = useState("");

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");

  const [isActive, setIsActive] = useState(true);

  const [feedback, setFeedback] = useState({
    visible: false,
    message: "",
    variant: "error" as "success" | "error" | "warning" | "info",
  });

  return {
    isSubmitting,
    setIsSubmitting,

    menuIdState,
    setMenuId,

    categoryIdState,
    setCategoryId,

    itemIdState,
    setItemId,

    baseItemId,
    setBaseItemId,

    menuName,
    setMenuName,

    category,
    setCategory,

    name,
    setName,

    description,
    setDescription,

    price,
    setPrice,

    isActive,
    setIsActive,

    feedback,
    setFeedback,
  };
}