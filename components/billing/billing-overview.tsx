"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  IndianRupee,
  ReceiptText,
  TrendingUp,
  Wallet,
  Smartphone,
  CreditCard,
  Plus,
  ArrowRight,
  Eye,
  Calendar,
  Layers,
  CheckCircle2,
  Clock,
  XCircle,
} from "lucide-react";

import { useBillingStore } from "@/stores/billing.store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BillDetailModal } from "@/components/billing/bill-detail-modal";
import type { CompletedBillRecord } from "@/features/billing/bill.types";

export function BillingOverview() {
  const bills = useBillingStore((state) => state.bills);
  const billsLoaded = useBillingStore((state) => state.billsLoaded);
  const loadBills = useBillingStore((state) => state.loadBills);

  const [selectedBill, setSelectedBill] = useState<CompletedBillRecord | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState<Date | null>(null);

  useEffect(() => {
    setCurrentDate(new Date());
    if (!billsLoaded) {
      loadBills();
    }
  }, [billsLoaded, loadBills]);

  // Today's metrics calculations
  const todayMetrics = useMemo(() => {
    if (!currentDate) {
      return {
        totalSalesToday: 0,
        paidCountToday: 0,
        avgBillValueToday: 0,
        cashToday: 0,
        upiToday: 0,
        cardToday: 0,
      };
    }

    const today = currentDate;
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
    const todayEnd = todayStart + 24 * 60 * 60 * 1000 - 1;

    const todayPaidBills = bills.filter((b) => {
      if (b.status !== "Paid") return false;
      const t = new Date(b.createdAt).getTime();
      return !isNaN(t) && t >= todayStart && t <= todayEnd;
    });

    const totalSalesToday = todayPaidBills.reduce((sum, b) => sum + b.total, 0);
    const paidCountToday = todayPaidBills.length;
    const avgBillValueToday = paidCountToday > 0 ? totalSalesToday / paidCountToday : 0;

    let cashToday = 0;
    let upiToday = 0;
    let cardToday = 0;

    todayPaidBills.forEach((b) => {
      const m = b.paymentMethod.toLowerCase();
      if (m === "cash") {
        cashToday += b.total;
      } else if (m === "upi") {
        upiToday += b.total;
      } else if (m === "card") {
        cardToday += b.total;
      } else if (m === "split") {
        cashToday += b.paymentDetails?.cashAmount || 0;
        upiToday += b.paymentDetails?.upiAmount || 0;
        cardToday += b.paymentDetails?.cardAmount || 0;
      }
    });

    return {
      totalSalesToday,
      paidCountToday,
      avgBillValueToday,
      cashToday,
      upiToday,
      cardToday,
    };
  }, [bills, currentDate]);

  // 5 Most Recent Bills
  const recentBills = useMemo(() => {
    return [...bills]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);
  }, [bills]);

  const handleViewBill = (bill: CompletedBillRecord) => {
    setSelectedBill(bill);
    setDetailOpen(true);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Paid":
        return (
          <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100 border-emerald-300">
            <CheckCircle2 size={11} className="mr-1 text-emerald-600" />
            Paid
          </Badge>
        );
      case "Pending":
        return (
          <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100 border-amber-300">
            <Clock size={11} className="mr-1 text-amber-600" />
            Pending
          </Badge>
        );
      case "Cancelled":
        return (
          <Badge className="bg-rose-100 text-rose-800 hover:bg-rose-100 border-rose-300">
            <XCircle size={11} className="mr-1 text-rose-600" />
            Cancelled
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const totalPaymentToday = todayMetrics.cashToday + todayMetrics.upiToday + todayMetrics.cardToday;
  const cashPercent = totalPaymentToday > 0 ? (todayMetrics.cashToday / totalPaymentToday) * 100 : 0;
  const upiPercent = totalPaymentToday > 0 ? (todayMetrics.upiToday / totalPaymentToday) * 100 : 0;
  const cardPercent = totalPaymentToday > 0 ? (todayMetrics.cardToday / totalPaymentToday) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-xl bg-[#14532D] p-5 text-white shadow-md">
        <div>
          <h1 className="text-xl font-bold tracking-tight md:text-2xl">
            Billing Overview
          </h1>
          <p className="text-xs text-green-200 mt-1 flex items-center gap-1.5">
            <Calendar size={14} className="text-green-300" />
            Real-time daily sales, payment summaries, and recent activity
          </p>
        </div>

        <Link href="/">
          <Button className="bg-[#16A34A] text-white hover:bg-[#15803D] font-semibold gap-2 shadow-sm">
            <Plus size={18} />
            Create New Bill
          </Button>
        </Link>
      </div>

      {/* Summary Cards Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Today's Total Sales */}
        <Card className="border-[#DCFCE7] bg-white shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              Today&apos;s Total Sales
            </CardTitle>
            <div className="rounded-lg bg-green-100 p-2 text-[#16A34A]">
              <IndianRupee size={18} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#14532D]">
              ₹{todayMetrics.totalSalesToday.toFixed(2)}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              From {todayMetrics.paidCountToday} completed transactions
            </p>
          </CardContent>
        </Card>

        {/* Paid Bills Today */}
        <Card className="border-[#DCFCE7] bg-white shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              Paid Bills Today
            </CardTitle>
            <div className="rounded-lg bg-emerald-100 p-2 text-emerald-600">
              <ReceiptText size={18} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {todayMetrics.paidCountToday}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Successfully paid today
            </p>
          </CardContent>
        </Card>

        {/* Average Bill Value */}
        <Card className="border-[#DCFCE7] bg-white shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              Average Bill Value
            </CardTitle>
            <div className="rounded-lg bg-blue-100 p-2 text-blue-600">
              <TrendingUp size={18} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              ₹{todayMetrics.avgBillValueToday.toFixed(2)}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Average sales per paid bill
            </p>
          </CardContent>
        </Card>

        {/* Cash Received Today */}
        <Card className="border-[#DCFCE7] bg-white shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              Cash Received Today
            </CardTitle>
            <div className="rounded-lg bg-amber-100 p-2 text-amber-600">
              <Wallet size={18} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              ₹{todayMetrics.cashToday.toFixed(2)}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Physical cash collected
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Payment Summary Section */}
      <Card className="border-[#DCFCE7] bg-white shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base text-[#14532D]">
                Payment Summary (Today)
              </CardTitle>
              <p className="text-xs text-gray-500">
                Breakdown of payment channels collected today
              </p>
            </div>
            <span className="text-xs font-semibold text-green-700 bg-green-50 px-2.5 py-1 rounded-full border border-green-200">
              Total: ₹{totalPaymentToday.toFixed(2)}
            </span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {/* Cash Card */}
            <div className="rounded-xl border border-amber-200 bg-amber-50/50 p-4 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-amber-900 font-semibold text-sm">
                  <Wallet size={16} className="text-amber-600" />
                  <span>Cash</span>
                </div>
                <span className="text-xs font-bold text-amber-700">{cashPercent.toFixed(0)}%</span>
              </div>
              <p className="text-xl font-bold text-amber-950">₹{todayMetrics.cashToday.toFixed(2)}</p>
              <div className="h-1.5 w-full rounded-full bg-amber-200 overflow-hidden">
                <div className="h-full bg-amber-500" style={{ width: `${cashPercent}%` }} />
              </div>
            </div>

            {/* UPI Card */}
            <div className="rounded-xl border border-blue-200 bg-blue-50/50 p-4 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-blue-900 font-semibold text-sm">
                  <Smartphone size={16} className="text-blue-600" />
                  <span>UPI</span>
                </div>
                <span className="text-xs font-bold text-blue-700">{upiPercent.toFixed(0)}%</span>
              </div>
              <p className="text-xl font-bold text-blue-950">₹{todayMetrics.upiToday.toFixed(2)}</p>
              <div className="h-1.5 w-full rounded-full bg-blue-200 overflow-hidden">
                <div className="h-full bg-blue-500" style={{ width: `${upiPercent}%` }} />
              </div>
            </div>

            {/* Card Payment */}
            <div className="rounded-xl border border-purple-200 bg-purple-50/50 p-4 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-purple-900 font-semibold text-sm">
                  <CreditCard size={16} className="text-purple-600" />
                  <span>Card</span>
                </div>
                <span className="text-xs font-bold text-purple-700">{cardPercent.toFixed(0)}%</span>
              </div>
              <p className="text-xl font-bold text-purple-950">₹{todayMetrics.cardToday.toFixed(2)}</p>
              <div className="h-1.5 w-full rounded-full bg-purple-200 overflow-hidden">
                <div className="h-full bg-purple-500" style={{ width: `${cardPercent}%` }} />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Bills Table */}
      <Card className="border-[#DCFCE7] bg-white shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <div>
            <CardTitle className="text-base text-[#14532D]">
              Recent Bills
            </CardTitle>
            <p className="text-xs text-gray-500">
              Showing the 5 most recent transactions
            </p>
          </div>

          <Link href="/history">
            <Button variant="outline" size="sm" className="border-green-600 text-green-700 hover:bg-green-50 text-xs font-semibold gap-1">
              View All
              <ArrowRight size={14} />
            </Button>
          </Link>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-y border-gray-100 bg-gray-50 text-gray-600 font-semibold">
                <tr>
                  <th className="py-3 px-4">Bill No.</th>
                  <th className="py-3 px-4">Date & Time</th>
                  <th className="py-3 px-4 text-center">Items Qty</th>
                  <th className="py-3 px-4">Payment Method</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Total Amount</th>
                  <th className="py-3 px-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-800">
                {recentBills.length > 0 ? (
                  recentBills.map((bill) => {
                    const totalQty = bill.items.reduce((sum, item) => sum + item.quantity, 0);
                    return (
                      <tr key={bill.billNumber} className="hover:bg-green-50/40 transition-colors">
                        <td className="py-3 px-4 font-bold text-gray-900">
                          {bill.billNumber}
                        </td>
                        <td className="py-3 px-4 text-gray-600 whitespace-nowrap">
                          {bill.date}
                        </td>
                        <td className="py-3 px-4 text-center font-medium">
                          {totalQty} {totalQty === 1 ? "item" : "items"}
                        </td>
                        <td className="py-3 px-4 capitalize font-medium">
                          <span className="inline-flex items-center gap-1 rounded-md bg-gray-100 px-2 py-0.5 text-[11px] text-gray-700 border">
                            {bill.paymentMethod}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          {getStatusBadge(bill.status)}
                        </td>
                        <td className="py-3 px-4 text-right font-bold text-[#15803D]">
                          ₹{bill.total.toFixed(2)}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => handleViewBill(bill)}
                            className="size-8 text-green-700 hover:bg-green-100 hover:text-green-800"
                            title="View bill details"
                          >
                            <Eye size={15} />
                          </Button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-gray-500">
                      <div className="flex flex-col items-center gap-2">
                        <Layers size={24} className="text-gray-400" />
                        <p className="font-semibold text-sm">No recent bills found</p>
                        <p className="text-xs text-gray-400">Bills created at the POS counter will appear here.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Bill Detail Modal */}
      <BillDetailModal
        open={detailOpen}
        onOpenChange={setDetailOpen}
        bill={selectedBill}
      />
    </div>
  );
}
