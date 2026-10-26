
"use client";

import { Button } from "@/components/ui/button";

const categories = [
  "All",
  "Breakfast",
  "Lunch",
  "Rice",
  "Drinks",
];

type CategoryFilterProps = {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
};

export function CategoryFilter({
  selectedCategory,
  onCategoryChange,
}: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((category) => {
        const isActive = selectedCategory === category;

        return (
          <Button
            key={category}
            type="button"
            variant={isActive ? "default" : "outline"}
            onClick={() => onCategoryChange(category)}
            className={
              isActive
                ? "bg-[#16A34A] text-white hover:bg-[#15803D]"
                : "border-[#DCFCE7] bg-white text-[#14532D] hover:bg-[#F0FDF4]"
            }
          >
            {category}
          </Button>
        );
      })}
    </div>
  );
}