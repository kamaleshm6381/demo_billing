import { initialMenu } from "./menu.data";
import type { FoodItem } from "./menu.types";

const MENU_STORAGE_KEY = "hotel-menu-items";

export function getMenuItems(): FoodItem[] {
  if (typeof window === "undefined") {
    return initialMenu;
  }

  try {
    const savedMenu = localStorage.getItem(MENU_STORAGE_KEY);

    if (!savedMenu) {
      return initialMenu;
    }

    const parsedMenu: unknown = JSON.parse(savedMenu);

    if (!Array.isArray(parsedMenu)) {
      return initialMenu;
    }

    return parsedMenu as FoodItem[];
  } catch {
    return initialMenu;
  }
}

export function saveMenuItems(items: FoodItem[]): void {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.setItem(
    MENU_STORAGE_KEY,
    JSON.stringify(items)
  );
}

