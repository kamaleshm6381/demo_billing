
"use client";

import { useEffect, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import type { PaymentDetails } from "./checkout-dialog";
import type { BillPaymentDetails } from "@/features/billing/bill.types";

export type CompletedBill = {
  billNumber: string;
  date: string;
  items: {
    id: number | string;
    name: string;
    price: number;
    quantity: number;
  }[];
  total: number;
  paymentMethod: PaymentDetails | BillPaymentDetails | string;
};

type BillReceiptProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  bill: CompletedBill | null;
};

function money(amount: number) {
  return `₹${amount.toFixed(2)}`;
}

export function BillReceipt({
  open,
  onOpenChange,
  bill,
}: BillReceiptProps) {
  const printedBillRef = useRef<string | null>(null);

  useEffect(() => {
    if (!open || !bill) return;

    // Prevent duplicate printing of the same bill.
    if (printedBillRef.current === bill.billNumber) return;

    printedBillRef.current = bill.billNumber;

    const timer = window.setTimeout(() => {
      window.print();
    }, 700);

    return () => window.clearTimeout(timer);
  }, [open, bill]);

  if (!bill) return null;

  const subtotal = bill.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const paymentRows =
    typeof bill.paymentMethod === "string"
      ? [
          {
            label: "Payment Method",
            value: bill.paymentMethod.toUpperCase(),
          },
        ]
      : [
          ...((bill.paymentMethod.cashAmount || 0) > 0
            ? [
                {
                  label: "Cash",
                  value: money(bill.paymentMethod.cashAmount || 0),
                },
              ]
            : []),
          ...((bill.paymentMethod.upiAmount || 0) > 0
            ? [
                {
                  label: "UPI",
                  value: money(bill.paymentMethod.upiAmount || 0),
                },
              ]
            : []),
          ...((bill.paymentMethod.cardAmount || 0) > 0
            ? [
                {
                  label: "Card",
                  value: money(bill.paymentMethod.cardAmount || 0),
                },
              ]
            : []),
        ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-md print:!fixed print:!left-0 print:!top-0 print:!block print:!h-auto print:!w-[76mm] print:!max-w-none print:!translate-x-0 print:!translate-y-0 print:!border-0 print:!p-0 print:!shadow-none">
        <div
          id="bill-receipt"
          className="receipt-print space-y-3 bg-white p-2 text-black"
        >
          <DialogHeader className="border-b border-dashed border-gray-400 pb-3 text-center">
            <DialogTitle className="text-center text-xl font-bold text-black">
              HOTEL BILL
            </DialogTitle>
            <p className="text-xs text-black">
              Thank you for visiting!
            </p>
          </DialogHeader>

          <div className="space-y-1 text-xs">
            <div className="flex justify-between gap-2">
              <span>Bill No.</span>
              <span>{bill.billNumber}</span>
            </div>
            <div className="flex justify-between gap-2">
              <span>Date</span>
              <span className="text-right">{bill.date}</span>
            </div>
          </div>

          <div className="border-y border-dashed border-gray-400 py-2">
            <div className="mb-2 grid grid-cols-[1fr_auto_auto] gap-2 text-xs font-bold">
              <span>Item</span>
              <span>Qty</span>
              <span>Amount</span>
            </div>

            {bill.items.map((item, index) => (
              <div
                key={`${item.id}-${index}`}
                className="mb-2 grid grid-cols-[1fr_auto_auto] gap-2 text-xs"
              >
                <span className="break-words">{item.name}</span>
                <span>{item.quantity}</span>
                <span className="text-right">
                  {money(item.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>

          <div className="space-y-1 text-xs">
            <div className="flex justify-between gap-2">
              <span>Subtotal</span>
              <span>{money(subtotal)}</span>
            </div>
            <div className="flex justify-between gap-2 border-t border-gray-400 pt-2 text-base font-bold">
              <span>Total</span>
              <span>{money(bill.total)}</span>
            </div>
          </div>

          <div className="space-y-1 border-t border-dashed border-gray-400 pt-2 text-xs">
            <p className="font-bold">Payment Details</p>

            {paymentRows.length > 0 ? (
              paymentRows.map((row) => (
                <div
                  key={row.label}
                  className="flex justify-between gap-2"
                >
                  <span>{row.label}</span>
                  <span>{row.value}</span>
                </div>
              ))
            ) : (
              <p>Payment details not available</p>
            )}
          </div>

          <div className="border-t border-dashed border-gray-400 pt-3 text-center text-xs">
            <p className="font-bold">Thank you! Visit again.</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

