"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export type PaymentMethod = "cash" | "upi" | "card" | "split";

export type PaymentDetails = {
  method: PaymentMethod;
  cashAmount: number;
  upiAmount: number;
  cardAmount?: number;
  totalPaid: number;
};

type CheckoutDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  total: number;
  onConfirmPayment: (payment: PaymentDetails) => void;
};

export function CheckoutDialog({
  open,
  onOpenChange,
  total,
  onConfirmPayment,
}: CheckoutDialogProps) {
  const [paymentMode, setPaymentMode] =
    useState<PaymentMethod>("split");

  const [cashAmount, setCashAmount] = useState("");
  const [upiAmount, setUpiAmount] = useState("");

  // Reset payment inputs whenever the dialog opens
  useEffect(() => {
    if (open) {
      setPaymentMode("split");
      setCashAmount("");
      setUpiAmount("");
    }
  }, [open, total]);

  const cash = Math.max(0, Number(cashAmount) || 0);
  const upi = Math.max(0, Number(upiAmount) || 0);

  const totalPaid = cash + upi;
  const remaining = Math.max(0, total - totalPaid);
  const changeDue = Math.max(0, totalPaid - total);

  const isOverpaid = totalPaid > total;
  const isValidPayment =
    total > 0 &&
    totalPaid > 0 &&
    Math.abs(totalPaid - total) < 0.001 &&
    !isOverpaid;

  // Change payment method
  const handleModeChange = (mode: PaymentMethod) => {
    setPaymentMode(mode);
    setCashAmount("");
    setUpiAmount("");
  };

  // When entering cash, calculate the remaining UPI amount
  const handleCashChange = (value: string) => {
    setCashAmount(value);

    if (value === "") {
      setUpiAmount("");
      return;
    }

    const enteredCash = Number(value);

    if (!Number.isFinite(enteredCash) || enteredCash < 0) {
      setUpiAmount("");
      return;
    }

    if (paymentMode === "split") {
      setUpiAmount(
        Math.max(0, total - enteredCash).toFixed(2)
      );
    }
  };

  // When entering UPI, calculate the remaining cash amount
  const handleUpiChange = (value: string) => {
    setUpiAmount(value);

    if (value === "") {
      setCashAmount("");
      return;
    }

    const enteredUpi = Number(value);

    if (!Number.isFinite(enteredUpi) || enteredUpi < 0) {
      setCashAmount("");
      return;
    }

    if (paymentMode === "split") {
      setCashAmount(
        Math.max(0, total - enteredUpi).toFixed(2)
      );
    }
  };

  // Confirm the payment
  const handleConfirm = () => {
    if (!isValidPayment) return;

    const method: PaymentMethod =
      cash > 0 && upi > 0
        ? "split"
        : cash > 0
          ? "cash"
          : "upi";

    onConfirmPayment({
      method,
      cashAmount: cash,
      upiAmount: upi,
      totalPaid,
    });

    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Complete Payment</DialogTitle>
          <DialogDescription>
            Choose how the customer will pay the bill.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5">
          {/* Total bill */}
          <div className="rounded-xl bg-green-50 p-4">
            <p className="text-sm text-green-800">
              Total Bill Amount
            </p>

            <p className="mt-1 text-3xl font-bold text-green-700">
              ₹{total.toFixed(2)}
            </p>
          </div>

          {/* Payment method selector */}
          <div className="grid grid-cols-3 gap-2">
            {(
              [
                ["cash", "Cash"],
                ["upi", "UPI"],
                ["split", "Cash + UPI"],
              ] as const
            ).map(([mode, label]) => (
              <button
                key={mode}
                type="button"
                onClick={() => handleModeChange(mode)}
                aria-pressed={paymentMode === mode}
                className={`rounded-lg border px-2 py-3 text-sm font-medium transition-colors ${
                  paymentMode === mode
                    ? "border-green-600 bg-green-50 text-green-700"
                    : "border-gray-200 hover:bg-gray-50"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Cash input */}
          {(paymentMode === "cash" ||
            paymentMode === "split") && (
            <div className="space-y-2">
              <label
                htmlFor="cash-amount"
                className="text-sm font-medium"
              >
                Cash Amount (₹)
              </label>

              <Input
                id="cash-amount"
                type="number"
                min="0"
                step="0.01"
                placeholder="Enter cash amount"
                value={cashAmount}
                onChange={(event) =>
                  handleCashChange(event.target.value)
                }
              />
            </div>
          )}

          {/* UPI input */}
          {(paymentMode === "upi" ||
            paymentMode === "split") && (
            <div className="space-y-2">
              <label
                htmlFor="upi-amount"
                className="text-sm font-medium"
              >
                UPI Amount (₹)
              </label>

              <Input
                id="upi-amount"
                type="number"
                min="0"
                step="0.01"
                placeholder="Enter UPI amount"
                value={upiAmount}
                onChange={(event) =>
                  handleUpiChange(event.target.value)
                }
              />

              <p className="text-xs text-gray-500">
                Verify that the UPI payment was received before
                confirming.
              </p>
            </div>
          )}

          {/* Payment summary */}
          <div className="space-y-3 rounded-xl border p-4">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">
                Cash received
              </span>
              <span className="font-medium">
                ₹{cash.toFixed(2)}
              </span>
            </div>

            <div className="flex justify-between text-sm">
              <span className="text-gray-500">
                UPI received
              </span>
              <span className="font-medium">
                ₹{upi.toFixed(2)}
              </span>
            </div>

            <div className="flex justify-between text-sm">
              <span className="text-gray-500">
                Total entered
              </span>
              <span className="font-semibold">
                ₹{totalPaid.toFixed(2)}
              </span>
            </div>

            <div className="flex justify-between border-t pt-3">
              <span className="font-medium">
                Balance remaining
              </span>

              <span
                className={`font-bold ${
                  remaining > 0
                    ? "text-red-600"
                    : "text-green-700"
                }`}
              >
                ₹{remaining.toFixed(2)}
              </span>
            </div>

            {changeDue > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">
                  Excess amount
                </span>
                <span className="font-semibold text-amber-600">
                  ₹{changeDue.toFixed(2)}
                </span>
              </div>
            )}
          </div>

          {/* Validation message */}
          {remaining > 0 && totalPaid > 0 && (
            <p className="text-sm text-red-600">
              ₹{remaining.toFixed(2)} remaining. Complete the
              payment before confirming.
            </p>
          )}

          {isOverpaid && (
            <p className="text-sm text-red-600">
              The entered amount exceeds the bill total. Please
              adjust the payment amounts.
            </p>
          )}

          {/* Confirm button */}
          <Button
            type="button"
            onClick={handleConfirm}
            disabled={!isValidPayment}
            className="w-full bg-green-600 hover:bg-green-700"
          >
            Confirm Payment · ₹{total.toFixed(2)}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

