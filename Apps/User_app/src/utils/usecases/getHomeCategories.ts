import { Category } from "../entities/Category";

export const getHomeCategories = () => {
  return [
    { name: "Chicken", icon: "🍗" },
    { name: "Pasta", icon: "🍝" },
    { name: "Soup", icon: "🍲" },
    { name: "Rice", icon: "🍚" },
    { name: "Seafood", icon: "🦐" },
    { name: "Snacks", icon: "🍿" },
    { name: "Drinks", icon: "🥤" },
    { name: "Desserts", icon: "🍰" },
  ].map(item => new Category(item.name, item.icon));
};
