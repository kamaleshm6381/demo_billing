import { create } from "zustand";

import type {
  FoodCategory,
  FoodItem,
} from "@/features/billing/menu.types";

import { initialMenu } from "@/features/billing/menu.data";

import {
  getMenuItems,
  saveMenuItems,
} from "@/features/billing/menu-storage";

type MenuStore = {
  menuItems: FoodItem[];
  menuLoaded: boolean;

  loadMenu: () => void;
  addMenuItem: (item: FoodItem) => void;
  updateMenuItem: (id: number, updates: Partial<FoodItem>) => void;
  deleteMenuItem: (id: number) => void;
  toggleAvailability: (id: number) => void;
};

export const useMenuStore = create<MenuStore>((set, get) => ({
  menuItems: initialMenu,
  menuLoaded: false,

  loadMenu: () => {
    if (typeof window === "undefined") return;

    const items = getMenuItems();

    set({
      menuItems: items,
      menuLoaded: true,
    });
  },

  addMenuItem: (item) => {
    const menuItems = [...get().menuItems, item];

    saveMenuItems(menuItems);
    set({ menuItems });
  },

  updateMenuItem: (id, updates) => {
    const menuItems = get().menuItems.map((item) =>
      item.id === id ? { ...item, ...updates } : item,
    );

    saveMenuItems(menuItems);
    set({ menuItems });
  },

  deleteMenuItem: (id) => {
    const menuItems = get().menuItems.filter(
      (item) => item.id !== id,
    );

    saveMenuItems(menuItems);
    set({ menuItems });
  },

  toggleAvailability: (id) => {
    const menuItems = get().menuItems.map((item) =>
      item.id === id
        ? { ...item, available: !item.available }
        : item,
    );

    saveMenuItems(menuItems);
    set({ menuItems });
  },
}));