import { Category, Restaurant } from '@/types/restaurant';

//Get the categories from resturant
export function getUniqueCategories(restaurants: Restaurant[]): string[] {
  const categories = restaurants.map((restaurant) => restaurant.cuisine);
  return [...new Set(categories)];
}

//Get the categories from categories list
export function getUniqueCategoriesFromCategory(
  categories: Category[]
): Category[] {
  const uniqueMap = new Map();

  categories.forEach((cat) => {
    if (!uniqueMap.has(cat.name)) {
      uniqueMap.set(cat.name, cat);
    }
  });

  return Array.from(uniqueMap.values());
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
