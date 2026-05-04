import api from "@/services/apiClient";
import { useEffect, useState } from "react";

export const useCategories = () => {
  const [categories, setCategories] = useState<string[]>([]);
  const [category, setCategory] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState(false);

  const cleanText = (text: string) => text.trim();

  const fetchCategories = async () => {
    try {
      setLoadingCategories(true);

      const res = await api.get("/menu/business/menu-list/");

      const menus = Array.isArray(res.data)
        ? res.data
        : res.data?.menus || res.data?.data?.menus || res.data?.results || [];

      const extracted: string[] = [];

      menus.forEach((menu: any) => {
        (menu.categories || []).forEach((cat: any) => {
          if (cat?.name) extracted.push(cat.name.trim());
        });
      });

      setCategories([...new Set(extracted)]);
    } catch (err) {
      console.log("CATEGORY FETCH ERROR:", err);
    } finally {
      setLoadingCategories(false);
    }
  };

  const handleAddCategory = () => {
    if (!newCategory.trim()) return;

    const cleaned = cleanText(newCategory);

    setCategories((prev) => [...new Set([...prev, cleaned])]);
    setCategory(cleaned);
    setNewCategory("");
    setShowAddCategory(false);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return {
    categories,
    category,
    setCategory,
    newCategory,
    setNewCategory,
    showAddCategory,
    setShowAddCategory,
    loadingCategories,
    fetchCategories,
    handleAddCategory,
  };
};