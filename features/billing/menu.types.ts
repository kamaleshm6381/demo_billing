
export const FOOD_CATEGORIES = [
  "Tiffin",
  "Meals",
  "Snacks",
  "Beverages",
  "Other Items",
] as const;

export type FoodCategory = (typeof FOOD_CATEGORIES)[number];

export type FoodItem = {
  id: number;
  name: string;
  price: number;
  category: FoodCategory;
  available: boolean;
};

