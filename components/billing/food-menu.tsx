
"use client";

import { useMemo, useState } from "react";
import { Search, X } from "lucide-react";

import { FOOD_CATEGORIES } from "@/features/billing/menu.types";
import { useMenuStore } from "@/stores/menu.store";
import { Input } from "@/components/ui/input";

type FoodMenuProps = {
  onAddToBill: (item: {
    id: number;
    name: string;
    price: number;
    category: (typeof FOOD_CATEGORIES)[number];
  }) => void;
};

export function FoodMenu({ onAddToBill }: FoodMenuProps) {
  const { menuItems } = useMenuStore();

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  const categories = ["All", ...FOOD_CATEGORIES];

  // Filter food items by search, category, and availability
  const filteredItems = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return menuItems.filter((item) => {
      const matchesCategory =
        selectedCategory === "All" ||
        item.category === selectedCategory;

      const matchesSearch = item.name
        .toLowerCase()
        .includes(normalizedSearch);

      return item.available && matchesCategory && matchesSearch;
    });
  }, [menuItems, selectedCategory, searchTerm]);

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("All");
  };

  return (
    <div className="flex min-h-0 flex-col gap-4">
      {/* Search bar */}
      <div className="relative shrink-0">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

        <Input
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          placeholder="Search food items..."
          aria-label="Search food items"
          className="h-11 border-gray-200 bg-white pl-10 pr-10 focus-visible:border-green-600 focus-visible:ring-green-600"
        />

        {searchTerm && (
          <button
            type="button"
            onClick={() => setSearchTerm("")}
            aria-label="Clear search"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Category tabs */}
      <div className="flex shrink-0 flex-wrap gap-2">
        {categories.map((category) => {
          const isActive = selectedCategory === category;

          return (
            <button
              key={category}
              type="button"
              onClick={() => setSelectedCategory(category)}
              aria-pressed={isActive}
              className={`rounded-xl border px-4 py-2 text-sm font-medium transition-colors ${
                isActive
                  ? "border-green-600 bg-green-600 text-white"
                  : "border-green-100 bg-white text-green-900 hover:bg-green-50"
              }`}
            >
              {category}
            </button>
          );
        })}
      </div>

      {/* Results count */}
      <div className="flex shrink-0 items-center justify-between">
        <p className="text-sm text-gray-500">
          {filteredItems.length} food item
          {filteredItems.length !== 1 ? "s" : ""} found
        </p>

        {(searchTerm || selectedCategory !== "All") && (
          <button
            type="button"
            onClick={clearFilters}
            className="text-sm font-medium text-green-700 hover:text-green-800"
          >
            Clear filters
          </button>
        )}
      </div>

      {/* Scrollable food cards */}
      <div
        className="max-h-[55vh] min-h-0 overflow-y-auto overscroll-contain rounded-xl pr-2 pb-2"
        role="region"
        aria-label="Available food items"
      >
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {filteredItems.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() =>
                onAddToBill({
                  id: item.id,
                  name: item.name,
                  price: item.price,
                  category: item.category,
                })
              }
              className="min-w-0 rounded-xl border border-green-100 bg-white p-4 text-left transition-colors hover:border-green-400 hover:bg-green-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-600"
            >
              <p className="break-words font-semibold text-gray-900">
                {item.name}
              </p>

              <p className="mt-2 font-bold text-green-700">
                ₹{item.price.toFixed(2)}
              </p>

              <p className="mt-1 break-words text-xs text-gray-500">
                {item.category}
              </p>
            </button>
          ))}

          {/* Empty state */}
          {filteredItems.length === 0 && (
            <div className="col-span-full rounded-xl border border-dashed border-green-200 bg-white p-8 text-center">
              <Search className="mx-auto h-8 w-8 text-gray-300" />

              <p className="mt-3 font-medium text-gray-700">
                No food items found
              </p>

              <p className="mt-1 text-sm text-gray-500">
                Try another food name or select a different category.
              </p>

              {(searchTerm || selectedCategory !== "All") && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="mt-3 text-sm font-semibold text-green-700 hover:text-green-800"
                >
                  Clear search and filters
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

