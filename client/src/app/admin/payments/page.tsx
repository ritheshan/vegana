'use client';

import * as React from 'react';
import { useBookingStore } from '@/store/useBookingStore';
import { IndianRupee, ShieldCheck, Search, ArrowUpRight, TrendingUp } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';

export default function AdminPaymentsPage() {
  const { bookings } = useBookingStore();

  const totalVolume = React.useMemo(() => {
    return bookings
      .filter(b => b.status === 'confirmed' || b.status === 'completed')
      .reduce((sum, curr) => sum + curr.totalPrice, 0);
  }, [bookings]);

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      
      {/* Header */}
      <div className="flex flex-col gap-1.5 border-b border-slate-200 pb-4">
        <h1 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
          <IndianRupee className="w-6 h-6 text-accent" />
          Payments & Payout Ledger
        </h1>
        <p className="text-xs text-slate-400 font-medium">
          Audit global customer payment transactions, verify payout transfers, or manage refund dispute balances
        </p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col gap-2">
          <span className="text-[9px] font-extrabold uppercase tracking-widest text-slate-400">Total Volume Tracked</span>
          <span className="text-xl font-black text-slate-900 flex items-center">
            <IndianRupee className="w-5 h-5 text-accent" />
            {totalVolume.toLocaleString('en-IN')}
          </span>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col gap-2">
          <span className="text-[9px] font-extrabold uppercase tracking-widest text-slate-400">Net Platform Commission (10%)</span>
          <span className="text-xl font-black text-slate-900 flex items-center text-teal-600">
            <IndianRupee className="w-5 h-5 text-teal-500" />
            {(totalVolume * 0.1).toLocaleString('en-IN')}
          </span>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col gap-2">
          <span className="text-[9px] font-extrabold uppercase tracking-widest text-slate-400">Payouts Cleared</span>
          <span className="text-xl font-black text-slate-950 flex items-center">
            <IndianRupee className="w-5 h-5 text-slate-400" />
            {(totalVolume * 0.9).toLocaleString('en-IN')}
          </span>
        </div>
      </div>

      {/* Ledger Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-100 bg-slate-50">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">All Transaction History</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50/50 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-100">
                <th className="p-4">Transaction ID</th>
                <th className="p-4">Client Name</th>
                <th className="p-4">Host Name</th>
                <th className="p-4">Paid Total</th>
                <th className="p-4">Transfer Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {bookings.map((book) => {
                const isPaid = book.status === 'confirmed' || book.status === 'completed';
                return (
                  <tr key={book.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-4 font-bold text-slate-900">{book.id.replace('book', 'txn')}</td>
                    <td className="p-4">{book.customerName}</td>
                    <td className="p-4">Adventure Nest</td>
                    <td className="p-4 font-bold text-slate-950">₹{book.totalPrice.toLocaleString('en-IN')}</td>
                    <td className="p-4">
                      <Badge variant={isPaid ? 'success' : book.status === 'pending' ? 'warning' : 'danger'} className="font-bold text-[9px] uppercase">
                        {isPaid ? 'Captured & Cleared' : book.status === 'pending' ? 'Authorized' : 'Refunded'}
                      </Badge>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
