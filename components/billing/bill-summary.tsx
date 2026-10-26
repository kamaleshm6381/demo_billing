
import { Separator } from "@/components/ui/separator";

type BillSummaryProps = {
  subtotal: number;
  taxRate?: number;
};

export function BillSummary({
  subtotal,
  taxRate = 0,
}: BillSummaryProps) {
  const taxAmount = (subtotal * taxRate) / 100;
  const total = subtotal + taxAmount;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-500">Subtotal</span>
        <span className="font-medium text-gray-900">
          ₹{subtotal.toFixed(2)}
        </span>
      </div>

      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-500">
          Tax ({taxRate}%)
        </span>
        <span className="font-medium text-gray-900">
          ₹{taxAmount.toFixed(2)}
        </span>
      </div>

      <Separator className="bg-[#DCFCE7]" />

      <div className="flex items-center justify-between gap-3">
        <span className="text-base font-bold text-[#14532D]">
          Total Amount
        </span>
        <span className="text-2xl font-bold text-[#16A34A]">
          ₹{total.toFixed(2)}
        </span>
      </div>
    </div>
  );
}