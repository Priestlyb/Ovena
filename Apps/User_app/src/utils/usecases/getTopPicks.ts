import { Restaurant } from "../entities/Restaurant";

export const getTopPicks = () => {
  return [
    {
      id: "3",
      name: "Pristina Hotel",
      image: "https://i.imgur.com/QZ5QZQy.jpg",
      rating: 4.8,
      openTime: "9:00am",
      reviews: 36,
    },
    {
      id: "4",
      name: "Transcorp Hilton Hotel",
      image: "https://i.imgur.com/QZ5QZQy.jpg",
      rating: 4.8,
      openTime: "9:00am",
      reviews: 36,
    },
  ].map(item => new Restaurant(item));
};
