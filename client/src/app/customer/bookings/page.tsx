'use client';

import * as React from 'react';
import { useSearchParams } from 'next/navigation';
import { useBookingStore } from '../../../store/useBookingStore';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { Dialog } from '../../../components/ui/Dialog';
import {
  Calendar, Users, IndianRupee, Clock, CheckCircle2,
  AlertCircle, XCircle, FileText, Printer, Sparkles
} from 'lucide-react';

export default function CustomerBookingsPage() {
  return (
    <React.Suspense fallback={
      <div className="py-20 text-center flex flex-col items-center justify-center gap-3">
        <div className="w-10 h-10 border-4 border-t-accent border-slate-200 rounded-full animate-spin" />
        <p className="text-xs text-slate-400 font-bold">Loading Bookings Ledger...</p>
      </div>
    }>
      <CustomerBookingsContent />
    </React.Suspense>
  );
}

function CustomerBookingsContent() {
  const searchParams = useSearchParams();
  const { bookings, updateBookingStatus } = useBookingStore();

  const [activeTab, setActiveTab] = React.useState<'all' | 'upcoming' | 'completed' | 'cancelled'>('all');
  const [selectedBookingId, setSelectedBookingId] = React.useState<string | null>(null);
  const [cancelConfirmationId, setCancelConfirmationId] = React.useState<string | null>(null);
  const [successToast, setSuccessToast] = React.useState(searchParams.get('new_booking') === 'true');

  const filteredBookings = React.useMemo(() => {
    return bookings.filter((b) => {
      if (activeTab === 'all') return true;
      if (activeTab === 'upcoming') return b.status === 'pending' || b.status === 'confirmed';
      if (activeTab === 'completed') return b.status === 'completed';
      if (activeTab === 'cancelled') return b.status === 'cancelled';
      return true;
    });
  }, [bookings, activeTab]);

  const selectedBooking = bookings.find(b => b.id === selectedBookingId);

  const handleCancelBooking = (id: string) => {
    updateBookingStatus(id, 'cancelled');
    setCancelConfirmationId(null);
  };

  const getStatusBadge = (status: typeof bookings[number]['status']) => {
    switch (status) {
      case 'pending': return <Badge variant="warning" className="font-bold">Pending Host Approval</Badge>;
      case 'confirmed': return <Badge variant="success" className="font-bold">Booking Confirmed</Badge>;
      case 'completed': return <Badge variant="primary" className="font-bold">Completed</Badge>;
      case 'cancelled': return <Badge variant="danger" className="font-bold">Cancelled</Badge>;
    }
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      
      {/* Success Notification Banner */}
      {successToast && (
        <div className="bg-teal-50 border border-teal-200 text-teal-900 rounded-xl p-4 flex justify-between items-center gap-3">
          <div className="flex gap-3 items-center">
            <Sparkles className="w-5 h-5 text-accent shrink-0" />
            <div className="flex flex-col text-xs leading-relaxed">
              <span className="font-bold">Trip Booking Submitted Successfully!</span>
              <span className="text-slate-500 font-medium">Your request is sent to the organizer. They will review and confirm within 12 hours.</span>
            </div>
          </div>
          <button onClick={() => setSuccessToast(false)} className="text-slate-400 hover:text-slate-600 text-xs font-bold shrink-0 cursor-pointer">
            Dismiss
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col gap-1.5">
        <h1 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
          <Calendar className="w-6 h-6 text-accent" />
          My Booking Ledger
        </h1>
        <p className="text-xs text-slate-400 font-medium">
          Check status, cancel departures, or download verified trip boarding passes
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 gap-6">
        {[
          { id: 'all', label: 'All Trips' },
          { id: 'upcoming', label: 'Upcoming / Pending' },
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
            {tab.label}
          </button>
        ))}
      </div>

      {/* Booking List Container */}
      <div className="flex flex-col gap-4">
        {filteredBookings.length > 0 ? (
          filteredBookings.map((book) => (
            <div
              key={book.id}
              className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-5 hover:border-slate-300 transition-colors"
            >
              {/* Trip details */}
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl bg-slate-100 overflow-hidden shrink-0 border border-slate-200">
                  <img src={book.tripImage} alt={book.tripTitle} className="w-full h-full object-cover" />
                </div>
                <div className="flex flex-col gap-1.5 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    {getStatusBadge(book.status)}
                    <span className="text-[10px] text-slate-400 font-bold">ID: {book.id}</span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 leading-snug truncate">
                    {book.tripTitle}
                  </h3>
                  <div className="flex flex-wrap items-center gap-4 text-[10px] text-slate-500 font-medium">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(book.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5" />
                      {book.seats} {book.seats === 1 ? 'Guest' : 'Guests'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Price and Action triggers */}
              <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-4 border-t md:border-t-0 pt-4 md:pt-0 border-slate-100">
                <div className="flex flex-col md:items-end">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none">Total paid</span>
                  <span className="text-sm font-black text-slate-900 mt-1">₹{book.totalPrice.toLocaleString('en-IN')}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedBookingId(book.id)}
                    className="font-bold text-[10px] py-2 cursor-pointer flex items-center gap-1"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    Details
                  </Button>
                  {(book.status === 'pending' || book.status === 'confirmed') && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setCancelConfirmationId(book.id)}
                      className="font-bold text-[10px] text-danger hover:bg-red-50 py-2 cursor-pointer"
                    >
                      Cancel
                    </Button>
                  )}
                </div>
              </div>

            </div>
          ))
        ) : (
          <div className="bg-white border border-slate-200 border-dashed rounded-xl p-10 text-center flex flex-col items-center justify-center gap-3">
            <Calendar className="w-10 h-10 text-slate-300" />
            <div className="flex flex-col gap-0.5">
              <h3 className="text-xs font-bold text-slate-800">No bookings found</h3>
              <p className="text-[10px] text-slate-400 max-w-xs leading-normal">
                You do not have any bookings listed under this filter status tab.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Ticket Details Dialog */}
      <Dialog
        isOpen={!!selectedBookingId}
        onClose={() => setSelectedBookingId(null)}
        title="Adventure Boarding Ticket"
        size="md"
      >
        {selectedBooking && (
          <div className="flex flex-col gap-5 text-slate-800 animate-fade-in">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="text-xs font-bold text-slate-400">Order ID: {selectedBooking.id}</span>
              {getStatusBadge(selectedBooking.status)}
            </div>

            <div className="flex items-center gap-4 bg-slate-50 border border-slate-200 rounded-xl p-4">
              <div className="w-14 h-14 rounded-lg bg-slate-100 overflow-hidden shrink-0">
                <img src={selectedBooking.tripImage} alt={selectedBooking.tripTitle} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-bold text-slate-900 truncate leading-snug">{selectedBooking.tripTitle}</h4>
                <p className="text-[10px] text-slate-400 mt-0.5">Standard Explorer Package</p>
              </div>
            </div>

            {/* Boarding details table */}
            <div className="grid grid-cols-2 gap-4 text-xs font-medium text-slate-600 bg-white border border-slate-100 rounded-xl p-4">
              <div className="flex flex-col">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none">Explorer Name</span>
                <span className="text-slate-900 mt-1 font-bold">{selectedBooking.customerName}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none">Departure Date</span>
                <span className="text-slate-900 mt-1 font-bold">
                  {new Date(selectedBooking.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none">Group Size</span>
                <span className="text-slate-900 mt-1 font-bold">{selectedBooking.seats} Seats Reserved</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none">Total paid</span>
                <span className="text-slate-900 mt-1 font-bold text-sm">₹{selectedBooking.totalPrice.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div className="flex justify-between gap-3 border-t border-slate-100 pt-4 mt-2">
              <Button variant="outline" size="sm" className="font-bold flex items-center gap-1.5 cursor-pointer" onClick={() => window.print()}>
                <Printer className="w-4 h-4 text-slate-500" />
                Print Ticket
              </Button>
              <Button variant="primary" size="sm" className="font-bold cursor-pointer" onClick={() => setSelectedBookingId(null)}>
                Close Ticket
              </Button>
            </div>
          </div>
        )}
      </Dialog>

      {/* Cancel Confirmation Dialog */}
      <Dialog
        isOpen={!!cancelConfirmationId}
        onClose={() => setCancelConfirmationId(null)}
        title="Confirm Trip Cancellation"
        size="sm"
      >
        <div className="flex flex-col gap-4 text-slate-800 text-center p-2">
          <div className="w-12 h-12 rounded-full bg-red-50 text-danger flex items-center justify-center border border-red-100 mx-auto">
            <XCircle className="w-6 h-6" />
          </div>
          <div className="flex flex-col gap-1">
            <h3 className="font-bold text-slate-950">Cancel this trip?</h3>
            <p className="text-xs text-slate-400 leading-relaxed font-light">
              Are you sure you want to cancel this booking? A full refund will be processed back to your original bank source.
            </p>
          </div>
          
          <div className="flex gap-3 justify-center pt-2">
            <Button variant="outline" size="sm" className="font-bold cursor-pointer" onClick={() => setCancelConfirmationId(null)}>
              No, Keep Booking
            </Button>
            <Button variant="danger" size="sm" className="font-bold cursor-pointer" onClick={() => handleCancelBooking(cancelConfirmationId!)}>
              Yes, Cancel Booking
            </Button>
          </div>
        </div>
      </Dialog>

    </div>
  );
}
