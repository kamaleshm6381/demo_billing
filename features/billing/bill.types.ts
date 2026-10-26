export type BillPaymentMethod = "cash" | "upi" | "card" | "split";
export type BillStatus = "Paid" | "Pending" | "Cancelled";

export type BillItem = {
  id: number | string;
  name: string;
  price: number;
  quantity: number;
  category?: string;
};

export type BillPaymentDetails = {
  method: BillPaymentMethod;
  cashAmount?: number;
  upiAmount?: number;
  cardAmount?: number;
  totalPaid?: number;
};

export type CompletedBillRecord = {
  id: string;
  billNumber: string;
  date: string;
  createdAt: string;
  items: BillItem[];
  subtotal: number;
  tax: number;
  taxRate?: number;
  total: number;
  paymentMethod: BillPaymentMethod;
  paymentDetails?: BillPaymentDetails;
  status: BillStatus;
  notes?: string;
};

export type DateFilterOption = "all" | "today" | "yesterday" | "last7days" | "last30days";
