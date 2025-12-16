import { getHomeCategories } from "../usecases/getHomeCategories";
import { getRecentlyVisited } from "../usecases/getRecentlyVisited";
import { getTopPicks } from "../usecases/getTopPicks";
import { getFoodCategories } from "../usecases/getFoodCategories";

export const useHomeData = () => {
  return {
    categories: getHomeCategories(),
    foodCategories: getFoodCategories(),
    recentlyVisited: getRecentlyVisited(),
    topPicks: getTopPicks(),
  };
};
