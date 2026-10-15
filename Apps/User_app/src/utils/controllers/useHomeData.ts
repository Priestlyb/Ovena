import { useEffect, useState, useCallback } from "react";

export const useHomeData = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = useCallback(() => {
    try {
      setLoading(true);

      setTimeout(() => {
        setCategories([
          {
            id: 1,
            name: "Pizza",
            image: require("../../../assets/images/Pizza.png"),
          },
          {
            id: 2,
            name: "Chicken",
            image: require("../../../assets/images/chicken.png"),
          },
          {
            id: 3,
            name: "Ice Cream",
            image: require("../../../assets/images/Ice Cream.png"),
          },
          {
            id: 4,
            name: "Shawarma",
            image: require("../../../assets/images/Shawarma.png"),
          },
          {
            id: 5,
            name: "Promotions",
            image: require("../../../assets/images/Promotions.png"),
          },
          {
            id: 6,
            name: "hooch",
            image: require("../../../assets/images/hooch.png"),
          },
          {
            id: 7,
            name: "Burger",
            image: require("../../../assets/images/Burger.png"),
          },
          {
            id: 8,
            name: "Cake",
            image: require("../../../assets/images/Cake.png"),
          },
          {
            id: 9,
            name: "CocaCola",
            image: require("../../../assets/images/CocaCola.png"),
          },
          {
            id: 10,
            name: "SpinTheWheels",
            image: require("../../../assets/images/SpinTheWheels.png"),
          },
        ]);

        setLoading(false);
      }, 800);
    } catch (err) {
      setError("Failed to load categories");
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return {
    categories,
    loading,
    error,
    refetch: fetchCategories,
  };
};