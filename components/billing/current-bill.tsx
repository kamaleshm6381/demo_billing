
"use client";

import { useMemo } from "react";
import { ReceiptText, ShoppingBasket, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import {
  BillItem,
  type BillLineItem,
} from "@/components/billing/bill-item";
import { BillSummary } from "@/components/billing/bill-summary";

type CurrentBillProps = {
  items: BillLineItem[];
  onIncrease: (id: number) => void;
  onDecrease: (id: number) => void;
  onRemove: (id: number) => void;
  onClear: () => void;
  onCheckout: () => void;
};

export function CurrentBill({
  items,
  onIncrease,
  onDecrease,
  onRemove,
  onClear,
  onCheckout,
}: CurrentBillProps) {
  const subtotal = useMemo(
    () => items.reduce((total, item) => total + item.price * item.quantity, 0),
    [items]
  );

  const totalQuantity = items.reduce(
    (total, item) => total + item.quantity,
    0
  );

  return (
    <Card className="flex h-full min-h-[350px] flex-col border-[#DCFCE7] bg-white shadow-sm">
      <CardHeader className="shrink-0 px-3 py-3">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="rounded-md bg-[#F0FDF4] p-1.5 text-[#16A34A]">
              <ReceiptText size={17} />
            </div>

            <div>
              <CardTitle className="text-base text-[#14532D]">
                Current Bill
              </CardTitle>
              <p className="text-xs text-gray-500">
                {totalQuantity} items · {items.length} different dishes
              </p>
            </div>
          </div>

          {items.length > 0 && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onClear}
              className="h-8 px-2 text-xs text-red-500 hover:bg-red-50 hover:text-red-600"
            >
              <Trash2 size={14} />
              Clear
            </Button>
          )}
        </div>
      </CardHeader>

      <Separator className="bg-[#DCFCE7]" />

      <CardContent className="flex min-h-0 flex-1 flex-col gap-2 p-3">
        <div className="min-h-0 flex-1 overflow-y-auto">
          {items.length > 0 ? (
            <div className="space-y-1">
              {items.map((item) => (
                <BillItem
                  key={item.id}
                  item={item}
                  onIncrease={onIncrease}
                  onDecrease={onDecrease}
                  onRemove={onRemove}
                />
              ))}
            </div>
          ) : (
            <div className="flex h-full min-h-32 flex-col items-center justify-center text-center">
              <ShoppingBasket size={24} className="mb-2 text-[#16A34A]" />
              <p className="text-sm font-semibold text-gray-700">
                Your bill is empty
              </p>
              <p className="text-xs text-gray-500">
                Add food items from the menu.
              </p>
            </div>
          )}
        </div>

        <div className="shrink-0 space-y-2 border-t border-[#DCFCE7] pt-2">
          <BillSummary subtotal={subtotal} />

          <Button
            type="button"
            disabled={items.length === 0}
            onClick={onCheckout}
            className="h-9 w-full bg-[#16A34A] text-sm font-semibold text-white hover:bg-[#15803D] disabled:cursor-not-allowed"
          >
            Proceed to Checkout · ₹{subtotal.toFixed(2)}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}