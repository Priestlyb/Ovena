import { Restaurant } from "../entities/Restaurant";

export const getRecentlyVisited = () => {
  return [
    {
      id: "1",
      name: "Burger King",
      image: "https://i.imgur.com/QZ5QZQy.jpg",
      rating: 4.8,
      openTime: "9:00am",
      reviews: 36,
    },
    {
      id: "2",
      name: "Amala For Real",
      image: "https://i.imgur.com/QZ5QZQy.jpg",
      rating: 4.8,
      openTime: "9:00am",
      reviews: 36,
    },
  ].map(item => new Restaurant(item));
};
