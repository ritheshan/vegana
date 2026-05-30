'use client';

import * as React from 'react';
import { useBookingStore } from '@/store/useBookingStore';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Dialog } from '@/components/ui/Dialog';
import {
  Calendar, Users, IndianRupee, Clock, CheckCircle2,
  AlertCircle, XCircle, FileText, Check, ShieldCheck
} from 'lucide-react';

export default function OrganizerBookingsPage() {
  const { bookings, updateBookingStatus } = useBookingStore();

  const [activeTab, setActiveTab] = React.useState<'pending' | 'confirmed' | 'completed' | 'cancelled'>('pending');
  const [selectedBookingId, setSelectedBookingId] = React.useState<string | null>(null);

  // Adventure Nest (user-org-1) bookings
  const orgBookings = React.useMemo(() => {
    return bookings.filter((b) => {
      if (b.organizerId !== 'user-org-1') return false;
      return b.status === activeTab;
    });
  }, [bookings, activeTab]);

  const selectedBooking = bookings.find(b => b.id === selectedBookingId);

  const getStatusBadge = (status: typeof bookings[number]['status']) => {
    switch (status) {
      case 'pending': return <Badge variant="warning" className="font-bold text-[10px]">Awaiting Confirmation</Badge>;
      case 'confirmed': return <Badge variant="success" className="font-bold text-[10px]">Confirmed</Badge>;
      case 'completed': return <Badge variant="primary" className="font-bold text-[10px]">Completed</Badge>;
      case 'cancelled': return <Badge variant="danger" className="font-bold text-[10px]">Cancelled</Badge>;
    }
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      
      {/* Header */}
      <div className="flex flex-col gap-1.5 border-b border-slate-200 pb-4">
        <h1 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
          <Calendar className="w-6 h-6 text-accent" />
          Customer Bookings Queue
        </h1>
        <p className="text-xs text-slate-400 font-medium">
          Confirm explorer seat requests, cancel departures, or manage group capacities
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 gap-6">
        {[
          { id: 'pending', label: 'Pending Approvals' },
          { id: 'confirmed', label: 'Confirmed Batches' },
          { id: 'completed', label: 'Completed' },
          { id: 'cancelled', label: 'Cancelled' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`pb-3 text-xs font-bold transition-all relative border-b-2 ${
              activeTab === tab.id
                ? 'border-accent text-slate-950 font-black'
                : 'border-transparent text-slate-400 hover:text-slate-600'
            } cursor-pointer`}
          >
            {tab.label} ({bookings.filter(b => b.organizerId === 'user-org-1' && b.status === tab.id).length})
          </button>
        ))}
      </div>

      {/* Bookings Queue */}
      <div className="flex flex-col gap-4">
        {orgBookings.length > 0 ? (
          orgBookings.map((book) => (
            <div
              key={book.id}
              className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-5 hover:border-slate-300 transition-colors"
            >
              
              {/* Trip details & client profile split */}
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-lg bg-slate-100 overflow-hidden shrink-0 border border-slate-200">
                  <img src={book.tripImage} alt={book.tripTitle} className="w-full h-full object-cover" />
                </div>
                <div className="flex flex-col gap-1 min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {getStatusBadge(book.status)}
                    <span className="text-[9px] text-slate-400 font-bold">Booking Reference: {book.id}</span>
                  </div>
                  
                  <h4 className="text-sm font-bold text-slate-900 truncate leading-snug">
                    {book.tripTitle}
                  </h4>
                  
                  <div className="flex flex-wrap items-center gap-3 text-[10px] text-slate-500 font-medium">
                    <span className="font-bold text-slate-800">Client: {book.customerName}</span>
                    <span>•</span>
                    <span>Date: {book.date}</span>
                    <span>•</span>
                    <span>Size: {book.seats} Explorers</span>
                  </div>
                </div>
              </div>

              {/* Price calculations and action triggers */}
              <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-4 border-t md:border-t-0 pt-4 md:pt-0 border-slate-100">
                <div className="flex flex-col md:items-end">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none">Net Payout</span>
                  <span className="text-sm font-black text-slate-900 mt-1">₹{book.totalPrice.toLocaleString('en-IN')}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedBookingId(book.id)}
                    className="font-bold text-[9px] py-1.5 cursor-pointer"
                  >
                    View Details
                  </Button>

                  {book.status === 'pending' && (
                    <React.Fragment>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => updateBookingStatus(book.id, 'cancelled')}
                        className="font-bold text-[9px] text-danger hover:bg-red-50 py-1.5 cursor-pointer"
                      >
                        Decline
                      </Button>
                      <Button
                        variant="accent"
                        size="sm"
                        onClick={() => updateBookingStatus(book.id, 'confirmed')}
                        className="font-bold text-[9px] py-1.5 cursor-pointer flex items-center gap-1"
                      >
                        <Check className="w-3.5 h-3.5" />
                        Confirm Seat
                      </Button>
                    </React.Fragment>
                  )}
                </div>
              </div>

            </div>
          ))
        ) : (
          <div className="bg-white border border-slate-200 border-dashed rounded-xl p-12 text-center flex flex-col items-center justify-center gap-3">
            <Calendar className="w-10 h-10 text-slate-300" />
            <div className="flex flex-col gap-0.5">
              <h3 className="text-xs font-bold text-slate-800">Queue is currently empty</h3>
              <p className="text-[10px] text-slate-400 max-w-xs leading-normal">
                No active bookings listed under this filter status tab.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Ticket Details Sheet Dialog */}
      <Dialog
        isOpen={!!selectedBookingId}
        onClose={() => setSelectedBookingId(null)}
        title="Host Reservation Details"
        size="md"
      >
        {selectedBooking && (
          <div className="flex flex-col gap-5 text-slate-800 animate-fade-in">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="text-xs font-bold text-slate-400">Order Ref: {selectedBooking.id}</span>
              {getStatusBadge(selectedBooking.status)}
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs font-medium text-slate-600 bg-slate-50 border border-slate-200 rounded-xl p-4">
              <div className="flex flex-col">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none">Customer Account</span>
                <span className="text-slate-900 mt-1 font-bold">{selectedBooking.customerName}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none">Registered Email</span>
                <span className="text-slate-900 mt-1 font-bold">rithish@example.com</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none">Booked Expedition</span>
                <span className="text-slate-900 mt-1 font-bold truncate">{selectedBooking.tripTitle}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none">Departure Date</span>
                <span className="text-slate-900 mt-1 font-bold">{selectedBooking.date}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none">Group seats</span>
                <span className="text-slate-900 mt-1 font-bold">{selectedBooking.seats} Seats</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none">Net Paid</span>
                <span className="text-slate-900 mt-1 font-bold text-sm">₹{selectedBooking.totalPrice.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 mt-2">
              <Button variant="primary" size="sm" className="font-bold cursor-pointer" onClick={() => setSelectedBookingId(null)}>
                Close Details
              </Button>
            </div>
          </div>
        )}
      </Dialog>

    </div>
  );
}
