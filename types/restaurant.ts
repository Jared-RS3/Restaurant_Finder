export interface Restaurant {
  id: string;
  name: string;
  cuisine: string;
  address: string;
  priceLevel: string;
  rating: number;
  reviewCount: number;
  image: string;
  latitude: number;
  longitude: number;
  isFavorite: boolean;
  openingHours: string;
  phone: string;
  website: string;
  deliveryTime: string;
  deliveryFee: string;
}