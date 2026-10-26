import type { CompletedBillRecord } from "./bill.types";

const BILL_STORAGE_KEY = "hotel-billing-records";

function generateInitialSeedBills(): CompletedBillRecord[] {
  const now = new Date();

  // Utility to create ISO date string shifted by days, hours, minutes
  const getDate = (daysAgo: number, hours: number, minutes: number): { iso: string; readable: string } => {
    const d = new Date(now);
    d.setDate(d.getDate() - daysAgo);
    d.setHours(hours, minutes, 0, 0);
    return {
      iso: d.toISOString(),
      readable: d.toLocaleString("en-IN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }),
    };
  };

  const t1 = getDate(0, 9, 30);
  const t2 = getDate(0, 11, 15);
  const t3 = getDate(0, 12, 45);
  const t4 = getDate(0, 13, 20);
  const t5 = getDate(0, 14, 0);

  const y1 = getDate(1, 19, 10);
  const y2 = getDate(1, 20, 30);
  const d3 = getDate(3, 13, 15);

  return [
    {
      id: "BILL-1008",
      billNumber: "BILL-1008",
      createdAt: t5.iso,
      date: t5.readable,
      items: [
        { id: 4, name: "Poori", price: 40, quantity: 1, category: "Breakfast" },
        { id: 10, name: "Coffee", price: 20, quantity: 1, category: "Drinks" },
      ],
      subtotal: 60,
      tax: 0,
      total: 60,
      paymentMethod: "cash",
      paymentDetails: {
        method: "cash",
        cashAmount: 60,
        upiAmount: 0,
        totalPaid: 60,
      },
      status: "Pending",
    },
    {
      id: "BILL-1007",
      billNumber: "BILL-1007",
      createdAt: t4.iso,
      date: t4.readable,
      items: [
        { id: 8, name: "Chicken Fried Rice", price: 130, quantity: 1, category: "Rice" },
        { id: 9, name: "Tea", price: 15, quantity: 1, category: "Drinks" },
      ],
      subtotal: 145,
      tax: 0,
      total: 145,
      paymentMethod: "card",
      paymentDetails: {
        method: "card",
        cashAmount: 0,
        upiAmount: 0,
        cardAmount: 145,
        totalPaid: 145,
      },
      status: "Paid",
    },
    {
      id: "BILL-1006",
      billNumber: "BILL-1006",
      createdAt: t3.iso,
      date: t3.readable,
      items: [
        { id: 7, name: "Veg Fried Rice", price: 90, quantity: 2, category: "Rice" },
        { id: 9, name: "Tea", price: 15, quantity: 2, category: "Drinks" },
      ],
      subtotal: 210,
      tax: 0,
      total: 210,
      paymentMethod: "split",
      paymentDetails: {
        method: "split",
        cashAmount: 100,
        upiAmount: 110,
        totalPaid: 210,
      },
      status: "Paid",
    },
    {
      id: "BILL-1005",
      billNumber: "BILL-1005",
      createdAt: t2.iso,
      date: t2.readable,
      items: [
        { id: 5, name: "Meals", price: 100, quantity: 1, category: "Lunch" },
        { id: 6, name: "Curd Rice", price: 50, quantity: 1, category: "Lunch" },
      ],
      subtotal: 150,
      tax: 0,
      total: 150,
      paymentMethod: "upi",
      paymentDetails: {
        method: "upi",
        cashAmount: 0,
        upiAmount: 150,
        totalPaid: 150,
      },
      status: "Paid",
    },
    {
      id: "BILL-1004",
      billNumber: "BILL-1004",
      createdAt: t1.iso,
      date: t1.readable,
      items: [
        { id: 1, name: "Idli", price: 30, quantity: 2, category: "Breakfast" },
        { id: 10, name: "Coffee", price: 20, quantity: 2, category: "Drinks" },
      ],
      subtotal: 100,
      tax: 0,
      total: 100,
      paymentMethod: "cash",
      paymentDetails: {
        method: "cash",
        cashAmount: 100,
        upiAmount: 0,
        totalPaid: 100,
      },
      status: "Paid",
    },
    {
      id: "BILL-1003",
      billNumber: "BILL-1003",
      createdAt: y2.iso,
      date: y2.readable,
      items: [
        { id: 5, name: "Meals", price: 100, quantity: 2, category: "Lunch" },
        { id: 6, name: "Curd Rice", price: 50, quantity: 2, category: "Lunch" },
      ],
      subtotal: 300,
      tax: 0,
      total: 300,
      paymentMethod: "card",
      paymentDetails: {
        method: "card",
        cashAmount: 0,
        upiAmount: 0,
        cardAmount: 300,
        totalPaid: 300,
      },
      status: "Cancelled",
    },
    {
      id: "BILL-1002",
      billNumber: "BILL-1002",
      createdAt: y1.iso,
      date: y1.readable,
      items: [
        { id: 2, name: "Dosa", price: 50, quantity: 3, category: "Breakfast" },
        { id: 10, name: "Coffee", price: 20, quantity: 3, category: "Drinks" },
      ],
      subtotal: 210,
      tax: 0,
      total: 210,
      paymentMethod: "upi",
      paymentDetails: {
        method: "upi",
        cashAmount: 0,
        upiAmount: 210,
        totalPaid: 210,
      },
      status: "Paid",
    },
    {
      id: "BILL-1001",
      billNumber: "BILL-1001",
      createdAt: d3.iso,
      date: d3.readable,
      items: [
        { id: 5, name: "Meals", price: 100, quantity: 4, category: "Lunch" },
      ],
      subtotal: 400,
      tax: 0,
      total: 400,
      paymentMethod: "cash",
      paymentDetails: {
        method: "cash",
        cashAmount: 400,
        upiAmount: 0,
        totalPaid: 400,
      },
      status: "Paid",
    },
  ];
}

export function getStoredBills(): CompletedBillRecord[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const saved = localStorage.getItem(BILL_STORAGE_KEY);
    if (!saved) {
      const initial = generateInitialSeedBills();
      localStorage.setItem(BILL_STORAGE_KEY, JSON.stringify(initial));
      return initial;
    }

    const parsed: unknown = JSON.parse(saved);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      const initial = generateInitialSeedBills();
      localStorage.setItem(BILL_STORAGE_KEY, JSON.stringify(initial));
      return initial;
    }

    return parsed as CompletedBillRecord[];
  } catch {
    return generateInitialSeedBills();
  }
}

export function saveStoredBills(bills: CompletedBillRecord[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(BILL_STORAGE_KEY, JSON.stringify(bills));
  } catch {
    // ignore storage quota errors
  }
}
