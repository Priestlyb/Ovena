import { useEffect, useState } from "react";

export const useHomeData = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [topPicks, setTopPicks] = useState<any[]>([]);
  const [recentlyVisited, setRecentlyVisited] = useState<any[]>([]);
  const [foodCategories, setFoodCategories] = useState<any[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setTimeout(() => {
      setCategories([
        { id: 1, name: "Pizza", image: require("../../../assets/images/Pizza.png") },
        { id: 2, name: "Chicken", image: require("../../../assets/images/chicken.png") },
        { id: 3, name: "Ice Cream", image: require("../../../assets/images/Ice Cream.png") },
        { id: 4, name: "Shawarma", image: require("../../../assets/images/Shawarma.png") },
        { id: 5, name: "Promotions", image: require("../../../assets/images/Promotions.png") },
        { id: 6, name: "hooch", image: require("../../../assets/images/hooch.png") },
        { id: 7, name: "Burger", image: require("../../../assets/images/Burger.png") },
        { id: 8, name: "Cake", image: require("../../../assets/images/Cake.png") },
        { id: 9, name: "CocaCola", image: require("../../../assets/images/CocaCola.png") },
        { id: 10, name: "SpinTheWheels", image: require("../../../assets/images/SpinTheWheels.png") },
      ]);

      setTopPicks([
        { id: 1, name: "Pristina Hotel", image: require("../../../assets/images/room.png") },
        { id: 2, name: "Transcorp Hilton Hotel", image: require("../../../assets/images/room.png") },
        { id: 3, name: "Hotspot Shawarma", image: require("../../../assets/images/room.png") },
        { id: 4, name: "Chicken Republic", image: require("../../../assets/images/room.png") },
        { id: 5, name: "Taco Bell", image: require("../../../assets/images/room.png") },
      ]);

      setRecentlyVisited([
        { id: 1, name: "Pristina Hotel", image: require("../../../assets/images/room.png") },
        { id: 2, name: "Dominos", image: require("../../../assets/images/room.png") },
        { id: 3, name: "Pizza Hut", image: require("../../../assets/images/room.png") },
        { id: 4, name: "Chicken Republic", image: require("../../../assets/images/room.png") },
        { id: 5, name: "Taco Bell", image: require("../../../assets/images/room.png") },
      ]);

      setLoading(false);
    }, 800);
  }, []);


  return {
    categories,
    topPicks,
    recentlyVisited,
    foodCategories,
    loading,
    error,
    refetch: () => { },
  };
};
