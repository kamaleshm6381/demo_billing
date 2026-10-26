
import { create } from "zustand";

import type { FoodItem } from "@/components/billing/food-card";
import type { BillLineItem } from "@/components/billing/bill-item";
import type {
  CompletedBillRecord,
  BillStatus,
  BillPaymentMethod,
} from "@/features/billing/bill.types";
import {
  getStoredBills,
  saveStoredBills,
} from "@/features/billing/bill-storage";

type BillingStore = {
  // POS current active bill items
  items: BillLineItem[];
  addItem: (item: FoodItem) => void;
  increaseQuantity: (id: number) => void;
  decreaseQuantity: (id: number) => void;
  removeItem: (id: number) => void;
  clearBill: () => void;

  // Completed bills list for overview and history
  bills: CompletedBillRecord[];
  billsLoaded: boolean;
  loadBills: () => void;
  addBill: (billInput: any) => void;
  updateBillStatus: (billNumber: string, status: BillStatus) => void;
};

export const useBillingStore = create<BillingStore>((set, get) => ({
  items: [],

  addItem: (item) =>
    set((state) => {
      const existingItem = state.items.find(
        (billItem) => billItem.id === item.id
      );

      if (existingItem) {
        return {
          items: state.items.map((billItem) =>
            billItem.id === item.id
              ? { ...billItem, quantity: billItem.quantity + 1 }
              : billItem
          ),
        };
      }

      return {
        items: [...state.items, { ...item, quantity: 1 }],
      };
    }),

  increaseQuantity: (id) =>
    set((state) => ({
      items: state.items.map((item) =>
        item.id === id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ),
    })),

  decreaseQuantity: (id) =>
    set((state) => ({
      items: state.items.map((item) =>
        item.id === id && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      ),
    })),

  removeItem: (id) =>
    set((state) => ({
      items: state.items.filter((item) => item.id !== id),
    })),

  clearBill: () => set({ items: [] }),

  // Completed Bills Actions
  bills: [],
  billsLoaded: false,

  loadBills: () => {
    if (typeof window === "undefined") return;
    const stored = getStoredBills();
    set({ bills: stored, billsLoaded: true });
  },

  addBill: (billInput: any) => {
    const state = get();
    const currentBills = state.billsLoaded ? state.bills : getStoredBills();

    const now = new Date();
    const billNumber = billInput.billNumber || `BILL-${Date.now()}`;
    
    // Process payment method
    let method: BillPaymentMethod = "cash";
    let paymentDetails = billInput.paymentDetails || undefined;

    if (typeof billInput.paymentMethod === "string") {
      const m = billInput.paymentMethod.toLowerCase();
      if (m.includes("upi")) method = "upi";
      else if (m.includes("card")) method = "card";
      else if (m.includes("split")) method = "split";
      else method = "cash";
    } else if (billInput.paymentMethod && typeof billInput.paymentMethod === "object") {
      paymentDetails = billInput.paymentMethod;
      const m = (billInput.paymentMethod.method || "cash").toLowerCase();
      if (m.includes("upi")) method = "upi";
      else if (m.includes("card")) method = "card";
      else if (m.includes("split")) method = "split";
      else method = "cash";
    }

    const items = (billInput.items || []).map((i: any) => ({
      id: i.id,
      name: i.name,
      price: Number(i.price) || 0,
      quantity: Number(i.quantity) || 1,
      category: i.category || "",
    }));

    const subtotal =
      billInput.subtotal !== undefined
        ? Number(billInput.subtotal)
        : items.reduce((sum: number, i: any) => sum + i.price * i.quantity, 0);

    const tax = Number(billInput.tax) || 0;
    const total = Number(billInput.total) || subtotal + tax;

    const newRecord: CompletedBillRecord = {
      id: billNumber,
      billNumber,
      date: billInput.date || now.toLocaleString("en-IN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }),
      createdAt: billInput.createdAt || now.toISOString(),
      items,
      subtotal,
      tax,
      taxRate: billInput.taxRate || 0,
      total,
      paymentMethod: method,
      paymentDetails: paymentDetails || {
        method,
        cashAmount: method === "cash" ? total : paymentDetails?.cashAmount || 0,
        upiAmount: method === "upi" ? total : paymentDetails?.upiAmount || 0,
        cardAmount: method === "card" ? total : paymentDetails?.cardAmount || 0,
        totalPaid: total,
      },
      status: billInput.status || "Paid",
    };

    const updatedBills = [newRecord, ...currentBills];
    saveStoredBills(updatedBills);
    set({ bills: updatedBills, billsLoaded: true });
  },

  updateBillStatus: (billNumber: string, status: BillStatus) => {
    const state = get();
    const currentBills = state.billsLoaded ? state.bills : getStoredBills();
    const updatedBills = currentBills.map((b) =>
      b.billNumber === billNumber ? { ...b, status } : b
    );
    saveStoredBills(updatedBills);
    set({ bills: updatedBills, billsLoaded: true });
  },
}));