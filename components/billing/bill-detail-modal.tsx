"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import type { CompletedBillRecord } from "@/features/billing/bill.types";
import { ReceiptText, Calendar, CreditCard, Printer, CheckCircle2, Clock, XCircle } from "lucide-react";

type BillDetailModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  bill: CompletedBillRecord | null;
  onPrint?: (bill: CompletedBillRecord) => void;
};

export function BillDetailModal({
  open,
  onOpenChange,
  bill,
  onPrint,
}: BillDetailModalProps) {
  if (!bill) return null;

  const totalQuantity = bill.items.reduce((sum, item) => sum + item.quantity, 0);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Paid":
        return (
          <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100 border-emerald-300 flex items-center gap-1">
            <CheckCircle2 size={12} className="text-emerald-600" />
            Paid
          </Badge>
        );
      case "Pending":
        return (
          <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100 border-amber-300 flex items-center gap-1">
            <Clock size={12} className="text-amber-600" />
            Pending
          </Badge>
        );
      case "Cancelled":
        return (
          <Badge className="bg-rose-100 text-rose-800 hover:bg-rose-100 border-rose-300 flex items-center gap-1">
            <XCircle size={12} className="text-rose-600" />
            Cancelled
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatPaymentMethod = (method: string) => {
    switch (method.toLowerCase()) {
      case "cash":
        return "Cash";
      case "upi":
        return "UPI";
      case "card":
        return "Card";
      case "split":
        return "Cash + UPI (Split)";
      default:
        return method.toUpperCase();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg border-[#DCFCE7] bg-white">
        <DialogHeader className="border-b border-gray-100 pb-3">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="rounded-lg bg-green-100 p-2 text-green-700">
                <ReceiptText size={20} />
              </div>
              <div>
                <DialogTitle className="text-lg font-bold text-gray-900">
                  {bill.billNumber}
                </DialogTitle>
                <DialogDescription className="text-xs text-gray-500">
                  Detailed breakdown of transaction
                </DialogDescription>
              </div>
            </div>
            {getStatusBadge(bill.status)}
          </div>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Metadata Section */}
          <div className="grid grid-cols-2 gap-3 rounded-lg bg-green-50/70 p-3 text-xs">
            <div className="flex items-center gap-2 text-gray-700">
              <Calendar size={14} className="text-green-700 shrink-0" />
              <div>
                <p className="text-[10px] uppercase font-semibold text-gray-500">Date & Time</p>
                <p className="font-medium text-gray-900">{bill.date}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-gray-700">
              <CreditCard size={14} className="text-green-700 shrink-0" />
              <div>
                <p className="text-[10px] uppercase font-semibold text-gray-500">Payment Method</p>
                <p className="font-medium text-gray-900">{formatPaymentMethod(bill.paymentMethod)}</p>
              </div>
            </div>
          </div>

          {/* Payment Breakdown if Split */}
          {bill.paymentDetails && bill.paymentMethod === "split" && (
            <div className="rounded-md border border-amber-200 bg-amber-50/50 p-2.5 text-xs space-y-1">
              <p className="font-semibold text-amber-900 text-[11px]">Split Payment Breakdown:</p>
              <div className="flex justify-between text-gray-700">
                <span>Cash Component:</span>
                <span className="font-medium">₹{(bill.paymentDetails.cashAmount || 0).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-700">
                <span>UPI Component:</span>
                <span className="font-medium">₹{(bill.paymentDetails.upiAmount || 0).toFixed(2)}</span>
              </div>
            </div>
          )}

          {/* Items List */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                Ordered Items ({totalQuantity} {totalQuantity === 1 ? "item" : "items"})
              </h4>
            </div>

            <div className="rounded-lg border border-gray-200 overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 font-semibold">
                  <tr>
                    <th className="py-2.5 px-3">Item Name</th>
                    <th className="py-2.5 px-2 text-center">Qty</th>
                    <th className="py-2.5 px-2 text-right">Price</th>
                    <th className="py-2.5 px-3 text-right">Line Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-gray-800">
                  {bill.items.map((item, index) => (
                    <tr key={`${item.id}-${index}`} className="hover:bg-gray-50/50">
                      <td className="py-2 px-3 font-medium text-gray-900">
                        {item.name}
                        {item.category && (
                          <span className="block text-[10px] text-gray-400 font-normal">
                            {item.category}
                          </span>
                        )}
                      </td>
                      <td className="py-2 px-2 text-center font-medium">{item.quantity}</td>
                      <td className="py-2 px-2 text-right text-gray-600">₹{item.price.toFixed(2)}</td>
                      <td className="py-2 px-3 text-right font-semibold text-green-700">
                        ₹{(item.price * item.quantity).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <Separator className="bg-gray-200" />

          {/* Calculation Summary */}
          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span className="font-medium text-gray-900">₹{bill.subtotal.toFixed(2)}</span>
            </div>

            {bill.tax > 0 && (
              <div className="flex justify-between text-gray-600">
                <span>Tax {bill.taxRate ? `(${bill.taxRate}%)` : ""}</span>
                <span className="font-medium text-gray-900">₹{bill.tax.toFixed(2)}</span>
              </div>
            )}

            <div className="flex justify-between items-baseline pt-2 border-t border-gray-200 text-sm">
              <span className="font-bold text-gray-900">Final Total</span>
              <span className="text-xl font-bold text-green-700">₹{bill.total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex justify-end gap-2 border-t border-gray-100 pt-3">
          {onPrint && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onPrint(bill)}
              className="border-green-600 text-green-700 hover:bg-green-50"
            >
              <Printer size={14} className="mr-1.5" />
              Print Receipt
            </Button>
          )}
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => onOpenChange(false)}
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
