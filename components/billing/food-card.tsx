
"use client";

import { useMemo, useState } from "react";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { MenuSearch } from "@/components/billing/menu-search";
import { CategoryFilter } from "@/components/billing/category-filter";
import { foodItems } from "@/features/billing/billing.data";
export type FoodItem = {
  id: number;
  name: string;
  price: number;
  category: string;
};

type FoodMenuProps = {
  onAddToBill: (item: FoodItem) => void;
};

export function FoodMenu({ onAddToBill }: FoodMenuProps) {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredItems = useMemo(() => {
    return foodItems.filter((item) => {
      const matchesSearch = item.name
        .toLowerCase()
        .includes(search.toLowerCase().trim());

      const matchesCategory =
        selectedCategory === "All" ||
        item.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [search, selectedCategory]);

  return (
    <div className="flex h-full min-h-0 flex-col gap-4">
      {/* Search */}
      <MenuSearch value={search} onChange={setSearch} />

      {/* Category Filter */}
      <CategoryFilter
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />

      {/* Menu Table */}
      <div className="min-h-0 flex-1 overflow-auto rounded-lg border border-[#DCFCE7]">
        <Table>
          <TableHeader className="sticky top-0 z-10 bg-[#F0FDF4]">
            <TableRow className="hover:bg-[#F0FDF4]">
              <TableHead className="font-semibold text-[#14532D]">
                Food Item
              </TableHead>
              <TableHead className="font-semibold text-[#14532D]">
                Category
              </TableHead>
              <TableHead className="text-right font-semibold text-[#14532D]">
                Price
              </TableHead>
              <TableHead className="text-right font-semibold text-[#14532D]">
                Action
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {filteredItems.length > 0 ? (
              filteredItems.map((item) => (
                <TableRow
                  key={item.id}
                  className="hover:bg-[#F0FDF4]/70"
                >
                  <TableCell className="font-medium text-gray-900">
                    {item.name}
                  </TableCell>

                  <TableCell className="text-gray-500">
                    {item.category}
                  </TableCell>

                  <TableCell className="text-right font-semibold text-[#15803D]">
                    ₹{item.price.toFixed(2)}
                  </TableCell>

                  <TableCell className="text-right">
                    <Button
                      type="button"
                      size="sm"
                      onClick={() => onAddToBill(item)}
                      className="bg-[#16A34A] text-white hover:bg-[#15803D]"
                    >
                      <Plus size={15} />
                      Add
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="h-24 text-center text-gray-500"
                >
                  No food items found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <p className="text-xs text-gray-500">
        Showing {filteredItems.length} menu items
      </p>
    </div>
  );
}