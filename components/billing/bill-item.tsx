
"use client";

import { Minus, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export type BillLineItem = {
  id: number;
  name: string;
  price: number;
  quantity: number;
  category: string;
};

type BillItemProps = {
  item: BillLineItem;
  onIncrease: (id: number) => void;
  onDecrease: (id: number) => void;
  onRemove: (id: number) => void;
};

export function BillItem({
  item,
  onIncrease,
  onDecrease,
  onRemove,
}: BillItemProps) {
  return (
    <div className="flex min-h-12 items-center gap-2 border-b border-[#DCFCE7] px-1 py-2">
      {/* Dish name */}
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-gray-800">
          {item.name}
        </p>
        <p className="text-xs text-gray-500">
          ₹{item.price.toFixed(2)} each
        </p>
      </div>

      {/* Item total */}
      <div className="w-20 shrink-0 text-right">
        <p className="text-sm font-bold text-[#15803D]">
          ₹{(item.price * item.quantity).toFixed(2)}
        </p>
      </div>

      {/* Quantity controls */}
      <div className="flex shrink-0 items-center gap-1">
        <Button
          type="button"
          variant="outline"
          size="icon"
          aria-label={`Decrease ${item.name} quantity`}
          onClick={() => onDecrease(item.id)}
          disabled={item.quantity <= 1}
          className="size-7 border-[#DCFCE7] text-[#15803D]"
        >
          <Minus size={13} />
        </Button>

        <span className="w-6 text-center text-sm font-semibold tabular-nums">
          {item.quantity}
        </span>

        <Button
          type="button"
          variant="outline"
          size="icon"
          aria-label={`Increase ${item.name} quantity`}
          onClick={() => onIncrease(item.id)}
          className="size-7 border-[#DCFCE7] text-[#15803D]"
        >
          <Plus size={13} />
        </Button>
      </div>

      {/* Delete with X */}
      <Button
        type="button"
        variant="ghost"
        size="icon"
        aria-label={`Remove ${item.name} from bill`}
        onClick={() => onRemove(item.id)}
        className="size-7 shrink-0 text-red-500 hover:bg-red-50 hover:text-red-600"
      >
        <X size={17} />
      </Button>
    </div>
  );
}