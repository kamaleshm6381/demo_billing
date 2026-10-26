import type { FoodItem } from "./menu.types";

export const initialMenu: FoodItem[] = [
  { id: 1, name: "Idli", price: 30, category: "Tiffin", available: true },
  { id: 2, name: "Plain Dosa", price: 50, category: "Tiffin", available: true },
  { id: 3, name: "Pongal", price: 40, category: "Tiffin", available: true },
  { id: 4, name: "Meals", price: 100, category: "Meals", available: true },
  { id: 5, name: "Parotta", price: 20, category: "Tiffin", available: true },
  { id: 6, name: "Vada", price: 15, category: "Snacks", available: true },
  { id: 7, name: "Tea", price: 12, category: "Beverages", available: true },
  { id: 8, name: "Coffee", price: 20, category: "Beverages", available: true },
];