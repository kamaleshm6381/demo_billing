
"use client";

import { useState } from "react";

import { FoodMenu } from "@/components/billing/food-menu";
import { CurrentBill } from "@/components/billing/current-bill";

import {
  CheckoutDialog,
  type PaymentDetails,
} from "@/components/billing/checkout-dialog";

import {
  BillReceipt,
  type CompletedBill,
} from "@/components/billing/bill-receipt";

import { useBillingStore } from "@/stores/billing.store";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function HomePage() {
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [receiptOpen, setReceiptOpen] = useState(false);

  const [completedBill, setCompletedBill] =
    useState<CompletedBill | null>(null);

  const items = useBillingStore((state) => state.items);
  const addItem = useBillingStore((state) => state.addItem);

  const increaseQuantity = useBillingStore(
    (state) => state.increaseQuantity
  );

  const decreaseQuantity = useBillingStore(
    (state) => state.decreaseQuantity
  );

  const removeItem = useBillingStore(
    (state) => state.removeItem
  );

  const clearBill = useBillingStore(
    (state) => state.clearBill
  );

  const addBill = useBillingStore(
    (state) => state.addBill
  );

  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  function handleCheckout() {
    if (items.length === 0) return;

    setCheckoutOpen(true);
  }

  function handleConfirmPayment(payment: PaymentDetails) {
    if (items.length === 0) return;

    const bill: CompletedBill = {
      billNumber: `BILL-${Date.now()}`,
      date: new Date().toLocaleString("en-IN"),
      items: items.map((item) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
      })),
      total: subtotal,
      paymentMethod: payment,
    };

    addBill(bill);
    setCompletedBill(bill);

    clearBill();
    setCheckoutOpen(false);
    setReceiptOpen(true);
  }

  return (
    <div className="grid h-full min-h-0 grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1.4fr)_minmax(340px,1fr)]">
      {/* Food Menu */}
      <Card className="flex min-h-[500px] flex-col border-[#DCFCE7] bg-white">
        <CardHeader className="shrink-0">
          <CardTitle className="text-[#14532D]">
            Food Menu
          </CardTitle>
        </CardHeader>

        <CardContent className="min-h-0 flex-1">
          <FoodMenu onAddToBill={addItem} />
        </CardContent>
      </Card>

      {/* Current Bill */}
      <div className="min-h-[500px]">
        <CurrentBill
          items={items}
          onIncrease={increaseQuantity}
          onDecrease={decreaseQuantity}
          onRemove={removeItem}
          onClear={clearBill}
          onCheckout={handleCheckout}
        />
      </div>

      {/* Checkout */}
      <CheckoutDialog
        open={checkoutOpen}
        onOpenChange={setCheckoutOpen}
        total={subtotal}
        onConfirmPayment={handleConfirmPayment}
      />

      {/* Receipt */}
      {completedBill !== null && (
        <BillReceipt
          open={receiptOpen}
          onOpenChange={setReceiptOpen}
          bill={completedBill}
        />
      )}
    </div>
  );
}

