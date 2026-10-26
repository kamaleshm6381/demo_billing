"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Search,
  RotateCcw,
  Calendar,
  Filter,
  Eye,
  CheckCircle2,
  Clock,
  XCircle,
  FileSpreadsheet,
  Layers,
  Printer,
} from "lucide-react";

import { useBillingStore } from "@/stores/billing.store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BillDetailModal } from "@/components/billing/bill-detail-modal";
import { BillReceipt, type CompletedBill } from "@/components/billing/bill-receipt";
import type { CompletedBillRecord, DateFilterOption } from "@/features/billing/bill.types";

export function BillingHistory() {
  const bills = useBillingStore((state) => state.bills);
  const billsLoaded = useBillingStore((state) => state.billsLoaded);
  const loadBills = useBillingStore((state) => state.loadBills);

  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState<DateFilterOption>("all");
  const [paymentFilter, setPaymentFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Modal states
  const [selectedBill, setSelectedBill] = useState<CompletedBillRecord | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [receiptOpen, setReceiptOpen] = useState(false);
  const [receiptBill, setReceiptBill] = useState<CompletedBill | null>(null);
  const [currentDate, setCurrentDate] = useState<Date | null>(null);

  useEffect(() => {
    setCurrentDate(new Date());
    if (!billsLoaded) {
      loadBills();
    }
  }, [billsLoaded, loadBills]);

  // Combined filtering logic
  const filteredBills = useMemo(() => {
    if (!currentDate) return bills;

    const now = currentDate;
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const yesterdayStart = todayStart - 24 * 60 * 60 * 1000;
    const yesterdayEnd = todayStart - 1;
    const sevenDaysAgo = todayStart - 6 * 24 * 60 * 60 * 1000;
    const thirtyDaysAgo = todayStart - 29 * 24 * 60 * 60 * 1000;

    return bills.filter((bill) => {
      // 1. Search filter (bill number)
      if (searchTerm.trim() !== "") {
        const query = searchTerm.trim().toLowerCase();
        if (!bill.billNumber.toLowerCase().includes(query)) {
          return false;
        }
      }

      // 2. Date filter
      if (dateFilter !== "all") {
        const billTime = new Date(bill.createdAt).getTime();
        if (isNaN(billTime)) return false;

        if (dateFilter === "today") {
          if (billTime < todayStart || billTime > todayStart + 24 * 60 * 60 * 1000 - 1) {
            return false;
          }
        } else if (dateFilter === "yesterday") {
          if (billTime < yesterdayStart || billTime > yesterdayEnd) {
            return false;
          }
        } else if (dateFilter === "last7days") {
          if (billTime < sevenDaysAgo) {
            return false;
          }
        } else if (dateFilter === "last30days") {
          if (billTime < thirtyDaysAgo) {
            return false;
          }
        }
      }

      // 3. Payment method filter
      if (paymentFilter !== "all") {
        if (bill.paymentMethod.toLowerCase() !== paymentFilter.toLowerCase()) {
          return false;
        }
      }

      // 4. Status filter
      if (statusFilter !== "all") {
        if (bill.status.toLowerCase() !== statusFilter.toLowerCase()) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [bills, searchTerm, dateFilter, paymentFilter, statusFilter, currentDate]);

  // Aggregate metrics of filtered results
  const filteredMetrics = useMemo(() => {
    const totalCount = filteredBills.length;
    const totalSales = filteredBills.reduce((sum, b) => sum + (b.status === "Paid" ? b.total : 0), 0);
    const paidCount = filteredBills.filter((b) => b.status === "Paid").length;
    const pendingCount = filteredBills.filter((b) => b.status === "Pending").length;
    const cancelledCount = filteredBills.filter((b) => b.status === "Cancelled").length;

    return { totalCount, totalSales, paidCount, pendingCount, cancelledCount };
  }, [filteredBills]);

  const handleClearFilters = () => {
    setSearchTerm("");
    setDateFilter("all");
    setPaymentFilter("all");
    setStatusFilter("all");
  };

  const handleViewBill = (bill: CompletedBillRecord) => {
    setSelectedBill(bill);
    setDetailOpen(true);
  };

  const handlePrintReceipt = (billRecord: CompletedBillRecord) => {
    const formatted: CompletedBill = {
      billNumber: billRecord.billNumber,
      date: billRecord.date,
      items: billRecord.items.map((i) => ({
        id: i.id,
        name: i.name,
        price: i.price,
        quantity: i.quantity,
      })),
      total: billRecord.total,
      paymentMethod: billRecord.paymentDetails || billRecord.paymentMethod,
    };
    setReceiptBill(formatted);
    setReceiptOpen(true);
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

  const isFiltered = searchTerm !== "" || dateFilter !== "all" || paymentFilter !== "all" || statusFilter !== "all";

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col gap-2 rounded-xl bg-[#14532D] p-5 text-white shadow-md">
        <h1 className="text-xl font-bold tracking-tight md:text-2xl">
          Billing History
        </h1>
        <p className="text-xs text-green-200 flex items-center gap-1.5">
          <Calendar size={14} className="text-green-300" />
          Search, filter, inspect, and manage previously generated customer bills
        </p>
      </div>

      {/* Filter and Search Bar Card */}
      <Card className="border-[#DCFCE7] bg-white shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-semibold text-[#14532D] flex items-center gap-2">
              <Filter size={16} className="text-green-700" />
              Filter & Search Bills
            </CardTitle>

            {isFiltered && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleClearFilters}
                className="h-8 px-2.5 text-xs text-red-600 hover:bg-red-50 hover:text-red-700 font-medium gap-1"
              >
                <RotateCcw size={13} />
                Clear All Filters
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {/* Search Input */}
            <div className="space-y-1">
              <label htmlFor="search-bill" className="text-xs font-semibold text-gray-600">
                Search Bill Number
              </label>
              <div className="relative">
                <Search size={15} className="absolute left-2.5 top-2.5 text-gray-400" />
                <Input
                  id="search-bill"
                  type="text"
                  placeholder="e.g. BILL-1004"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 text-xs border-gray-200 focus-visible:ring-green-600"
                />
              </div>
            </div>

            {/* Date Filter */}
            <div className="space-y-1">
              <label htmlFor="date-filter" className="text-xs font-semibold text-gray-600">
                Date Range
              </label>
              <Select value={dateFilter} onValueChange={(val) => setDateFilter(val as DateFilterOption)}>
                <SelectTrigger id="date-filter" className="text-xs border-gray-200">
                  <SelectValue placeholder="All Dates" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Dates</SelectItem>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="yesterday">Yesterday</SelectItem>
                  <SelectItem value="last7days">Last 7 Days</SelectItem>
                  <SelectItem value="last30days">Last 30 Days</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Payment Method Filter */}
            <div className="space-y-1">
              <label htmlFor="payment-filter" className="text-xs font-semibold text-gray-600">
                Payment Method
              </label>
              <Select value={paymentFilter} onValueChange={setPaymentFilter}>
                <SelectTrigger id="payment-filter" className="text-xs border-gray-200">
                  <SelectValue placeholder="All Methods" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Methods</SelectItem>
                  <SelectItem value="cash">Cash</SelectItem>
                  <SelectItem value="upi">UPI</SelectItem>
                  <SelectItem value="card">Card</SelectItem>
                  <SelectItem value="split">Cash + UPI (Split)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Status Filter */}
            <div className="space-y-1">
              <label htmlFor="status-filter" className="text-xs font-semibold text-gray-600">
                Payment Status
              </label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger id="status-filter" className="text-xs border-gray-200">
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Summary Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-green-200 bg-green-50/60 px-4 py-2.5 text-xs text-green-900">
        <div className="flex items-center gap-2 font-medium">
          <FileSpreadsheet size={15} className="text-green-700" />
          <span>
            Showing <strong className="text-green-950 font-bold">{filteredMetrics.totalCount}</strong> {filteredMetrics.totalCount === 1 ? "bill" : "bills"}
          </span>
          {isFiltered && <span className="text-green-600">(filtered from {bills.length} total)</span>}
        </div>

        <div className="flex items-center gap-4 text-xs font-semibold">
          <span className="text-emerald-800">
            Paid Sales: <strong className="text-emerald-950">₹{filteredMetrics.totalSales.toFixed(2)}</strong> ({filteredMetrics.paidCount})
          </span>
          {filteredMetrics.pendingCount > 0 && (
            <span className="text-amber-800">
              Pending: {filteredMetrics.pendingCount}
            </span>
          )}
          {filteredMetrics.cancelledCount > 0 && (
            <span className="text-rose-800">
              Cancelled: {filteredMetrics.cancelledCount}
            </span>
          )}
        </div>
      </div>

      {/* Bill History Table */}
      <Card className="border-[#DCFCE7] bg-white shadow-sm overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-gray-200 bg-gray-50 text-gray-700 font-semibold">
                <tr>
                  <th className="py-3 px-4">Bill Number</th>
                  <th className="py-3 px-4">Date & Time</th>
                  <th className="py-3 px-4 text-center">Items Qty</th>
                  <th className="py-3 px-4">Payment Method</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Total Amount</th>
                  <th className="py-3 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-800">
                {filteredBills.length > 0 ? (
                  filteredBills.map((bill) => {
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
                          <span className="inline-flex items-center gap-1 rounded-md bg-gray-100 px-2.5 py-1 text-[11px] text-gray-700 border">
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
                          <div className="flex items-center justify-center gap-1">
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => handleViewBill(bill)}
                              className="h-8 px-2 text-green-700 hover:bg-green-100 font-medium gap-1 text-xs"
                              title="View bill details"
                            >
                              <Eye size={14} />
                              View
                            </Button>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => handlePrintReceipt(bill)}
                              className="size-8 text-gray-600 hover:bg-gray-100"
                              title="Print receipt"
                            >
                              <Printer size={14} />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-gray-500">
                      <div className="flex flex-col items-center gap-2">
                        <Layers size={32} className="text-gray-300" />
                        <p className="font-semibold text-sm text-gray-700">No matching bills found</p>
                        <p className="text-xs text-gray-400">
                          {isFiltered
                            ? "Try adjusting or clearing your search and filter options."
                            : "No billing records have been created yet."}
                        </p>
                        {isFiltered && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={handleClearFilters}
                            className="mt-2 text-xs border-green-600 text-green-700 hover:bg-green-50"
                          >
                            Reset Filters
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Bill Details Modal */}
      <BillDetailModal
        open={detailOpen}
        onOpenChange={setDetailOpen}
        bill={selectedBill}
        onPrint={handlePrintReceipt}
      />

      {/* Receipt Modal for Printing */}
      {receiptBill !== null && (
        <BillReceipt
          open={receiptOpen}
          onOpenChange={setReceiptOpen}
          bill={receiptBill}
        />
      )}
    </div>
  );
}
