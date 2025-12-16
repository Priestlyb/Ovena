export class Restaurant {
  id: string;
  name: string;
  image: string;
  rating: number;
  openTime: string;
  reviews: number;

  constructor(data: Restaurant) {
    this.id = data.id;
    this.name = data.name;
    this.image = data.image;
    this.rating = data.rating;
    this.openTime = data.openTime;
    this.reviews = data.reviews;
  }
}
