import { Restaurant } from '@/types/restaurant';

export function getUniqueCategories(restaurants: Restaurant[]): string[] {
  const categories = restaurants.map((restaurant) => restaurant.cuisine);
  return [...new Set(categories)];
}

export function formatDistance(distance: number): string {
  if (distance < 1) {
    return `${(distance * 1000).toFixed(0)} m`;
  }
  return `${distance.toFixed(1)} km`;
}

export function formatPrice(price: number): string {
  return `$${price.toFixed(2)}`;
}
