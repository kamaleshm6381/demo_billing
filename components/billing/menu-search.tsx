
"use client";

import { Search, X } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type MenuSearchProps = {
  value: string;
  onChange: (value: string) => void;
};

export function MenuSearch({ value, onChange }: MenuSearchProps) {
  return (
    <div className="relative flex w-full items-center">
      <Search
        size={18}
        className="absolute left-3 text-gray-400"
      />

      <Input
        type="text"
        placeholder="Search food items..."
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-11 border-[#DCFCE7] bg-white pl-10 pr-10 focus-visible:border-[#16A34A] focus-visible:ring-[#16A34A]"
      />

      {value && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label="Clear search"
          onClick={() => onChange("")}
          className="absolute right-1 h-8 w-8 text-gray-500 hover:text-[#14532D]"
        >
          <X size={16} />
        </Button>
      )}
    </div>
  );
}