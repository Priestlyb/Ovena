import { useMemo, useState } from "react";

export const useFoodsTab = (categories: any[] = []) => {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const categoryNames = useMemo(() => {
    return categories.map((category) => category.name);
  }, [categories]);

  const filteredCategories = useMemo(() => {
    return categories.filter((category) =>
      activeCategory === null
        ? true
        : category.name === activeCategory,
    );
  }, [categories, activeCategory]);

  const handleSeeAll = (category: string) => {
    console.log(`See all items in category: ${category}`);
  };

  return {
    activeCategory,
    setActiveCategory,
    categoryNames,
    filteredCategories,
    handleSeeAll,
  };
};