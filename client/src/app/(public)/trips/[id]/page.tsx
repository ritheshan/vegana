'use client';

import * as React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useTripStore } from '@/store/useTripStore';
import { useBookingStore } from '@/store/useBookingStore';
import { useAuthStore } from '@/store/useAuthStore';
import { useChatStore } from '@/store/useChatStore';
import { ReviewCard } from '@/components/cards/ReviewCard';
import { TripCard } from '@/components/cards/TripCard';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import {
  Star, MapPin, Clock, Users, ShieldCheck, CheckCircle2, XCircle,
  Calendar, ArrowRight, MessageCircle, AlertCircle, Heart
} from 'lucide-react';
import { INITIAL_REVIEWS } from '@/constants';
import { Trip, ItineraryItem, Review } from '@/types';

export default function TripDetailsPage() {
  const params = useParams();
  const router = useRouter();
  
  const tripId = params.id as string;
  const { getTripById, trips } = useTripStore();
  const { createBooking, toggleWishlist, isInWishlist } = useBookingStore();
  const { user, isAuthenticated } = useAuthStore();
  const { createConversation } = useChatStore();

  const trip = getTripById(tripId);
  const isWishlisted = isInWishlist(tripId);

  // Booking Card state
  const [selectedDate, setSelectedDate] = React.useState(trip?.dates[0] || '');
  const [seats, setSeats] = React.useState(1);
  const [isBooking, setIsBooking] = React.useState(false);
  const [activeItineraryDay, setActiveItineraryDay] = React.useState<number | null>(1);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);
  const [successMsg, setSuccessMsg] = React.useState<string | null>(null);

  if (!trip) {
    return (
      <div className="py-20 text-center flex flex-col items-center gap-4">
        <AlertCircle className="w-12 h-12 text-danger" />
        <h2 className="text-xl font-bold">Trip Package Not Found</h2>
        <Button variant="outline" onClick={() => router.push('/trips')} className="cursor-pointer">
          Back to Explorers Page
        </Button>
      </div>
    );
  }

  // Related Trips (same category, different id)
  const relatedTrips = trips
    .filter((t: Trip) => t.category === trip.category && t.id !== trip.id && t.status === 'published')
    .slice(0, 2);

  // Reviews matching this trip
  const tripReviews = INITIAL_REVIEWS.filter((r: Review) => r.tripId === trip.id);

  const totalPrice = trip.price * seats;

  // Load Razorpay script dynamically
  const loadRazorpayScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if ((window as any).Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleCheckout = async () => {
    if (!isAuthenticated) {
      router.push(`/auth/login?redirect=/trips/${trip.id}`);
      return;
    }

    setIsBooking(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      // 1. Load Razorpay Script
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        throw new Error('Failed to load Razorpay SDK. Please check your internet connection and try again.');
      }

      // 2. Call local backend to create order
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const token = `mock_token_${user?.id || 'user-customer-1'}`;

      const amountInPaise = totalPrice * 100;

      const createOrderRes = await fetch(`${apiUrl}/api/create-order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          amount: amountInPaise,
          currency: 'INR',
          receipt: `receipt_${trip.id}_${Date.now()}`
        })
      });

      if (!createOrderRes.ok) {
        const errorData = await createOrderRes.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to create payment order (${createOrderRes.status})`);
      }

      const orderData = await createOrderRes.json();

      // 3. Open Razorpay checkout modal
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_SvUmc2Uhn62irJ',
        amount: orderData.amount,
        currency: orderData.currency || 'INR',
        name: 'Vagana Expeditions',
        description: trip.title,
        order_id: orderData.order_id,
        prefill: {
          name: user?.name || 'Rithish N',
          email: user?.email || 'customer@vegana.com'
        },
        theme: {
          color: '#14B8A6' // accent teal color matching our theme
        },
        handler: async function (response: any) {
          try {
            setIsBooking(true);
            setErrorMsg(null);
            setSuccessMsg('Verifying your payment signature...');

            // 4. Verify signature on backend
            const verifyRes = await fetch(`${apiUrl}/api/verify-payment`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature
              })
            });

            if (!verifyRes.ok) {
              const verifyError = await verifyRes.json().catch(() => ({}));
              throw new Error(verifyError.message || 'Payment verification failed');
            }

            // Payment successfully verified! Add booking to local Zustand store
            const newBookingId = `book-${Date.now()}`;
            createBooking({
              id: newBookingId,
              tripId: trip.id,
              tripTitle: trip.title,
              tripImage: trip.image,
              customerId: user?.id || 'user-customer-1',
              customerName: user?.name || 'Rithish N',
              organizerId: trip.organizerId,
              date: selectedDate,
              seats: seats,
              totalPrice: totalPrice,
              status: 'confirmed', // payment verified, hence booking is confirmed!
              createdAt: new Date().toISOString()
            });

            setSuccessMsg('Booking Confirmed Successfully!');
            setIsBooking(false);

            // Redirect after brief delay to show success
            setTimeout(() => {
              router.push('/customer/bookings?new_booking=true');
            }, 1000);

          } catch (err: any) {
            setErrorMsg(err.message || 'Verification failed. Please contact support.');
            setSuccessMsg(null);
            setIsBooking(false);
          }
        },
        modal: {
          ondismiss: function () {
            setIsBooking(false);
            setErrorMsg('Payment cancelled by user.');
          }
        }
      };

      const rzp = new (window as any).Razorpay(options);

      rzp.on('payment.failed', function (response: any) {
        setIsBooking(false);
        setErrorMsg(`Payment failed: ${response.error.description || 'Unknown error'}`);
      });

      rzp.open();

    } catch (err: any) {
      setErrorMsg(err.message || 'An unexpected error occurred while initializing checkout.');
      setIsBooking(false);
    }
  };

  const handleChatWithHost = () => {
    if (!isAuthenticated) {
      router.push(`/auth/login?redirect=/trips/${trip.id}`);
      return;
    }

    const conversationId = createConversation(
      trip.organizerId,
      trip.organizerName,
      trip.organizerLogo,
      'organizer'
    );
    router.push(`/customer/custom-requests?active_chat=${conversationId}`);
  };

  return (
    <div className="flex flex-col gap-10 animate-fade-in">
      
      {/* 1. Header Details */}
      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="accent" className="font-bold">{trip.category}</Badge>
          {trip.featured && <Badge variant="success" className="font-bold">Staff Pick</Badge>}
        </div>

        <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight text-slate-900 leading-tight">
          {trip.title}
        </h1>

        <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 font-medium border-b border-slate-100 pb-4">
          <div className="flex items-center gap-1.5">
            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
            <span className="font-bold text-slate-900">{trip.rating.toFixed(1)}</span>
            <span>({trip.reviewsCount} verified reviews)</span>
          </div>
          <span className="text-slate-300">•</span>
          <div className="flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-slate-400" />
            <span className="font-bold text-slate-800">{trip.destination}</span>
          </div>
          <span className="text-slate-300">•</span>
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-slate-400" />
            <span className="font-bold text-slate-800">{trip.durationDays} Days</span>
          </div>
        </div>
      </div>

      {/* 2. Image Gallery Section */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4 h-[300px] md:h-[400px] rounded-2xl overflow-hidden shadow-md">
        <div className="md:col-span-2 relative w-full h-full bg-slate-100 overflow-hidden">
          <img src={trip.image} alt={trip.title} className="w-full h-full object-cover" />
        </div>
        <div className="hidden md:flex flex-col gap-4 w-full h-full">
          <div className="flex-1 relative w-full bg-slate-100 overflow-hidden">
            <img src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600" alt="Landscape details" className="w-full h-full object-cover" />
          </div>
          <div className="flex-1 relative w-full bg-slate-100 overflow-hidden">
            <img src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600" alt="Mountain tour details" className="w-full h-full object-cover" />
          </div>
        </div>
      </section>

      {/* 3. Main Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12 items-start">
        
        {/* Left Side details */}
        <div className="col-span-1 lg:col-span-2 flex flex-col gap-10">
          
          {/* Overview */}
          <div className="flex flex-col gap-4">
            <h2 className="text-lg font-bold text-slate-900 uppercase tracking-wider">
              Trip Overview
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed font-normal">
              {trip.description}
            </p>

            {/* Quick specifications grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 border border-slate-200 rounded-xl p-4 bg-slate-50/50 mt-2">
              <div className="flex gap-3 items-center">
                <div className="w-9 h-9 rounded-lg bg-teal-50 text-accent flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Duration</span>
                  <span className="text-xs font-bold text-slate-800">{trip.durationDays} Days / {trip.durationDays - 1} Nights</span>
                </div>
              </div>
              <div className="flex gap-3 items-center">
                <div className="w-9 h-9 rounded-lg bg-teal-50 text-accent flex items-center justify-center shrink-0">
                  <Users className="w-5 h-5" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Capacity</span>
                  <span className="text-xs font-bold text-slate-800">{trip.maxSeats} Max Seats</span>
                </div>
              </div>
              <div className="flex gap-3 items-center col-span-2 md:col-span-1">
                <div className="w-9 h-9 rounded-lg bg-teal-50 text-accent flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Available</span>
                  <span className="text-xs font-bold text-green-600">{trip.availableSeats} Seats left</span>
                </div>
              </div>
            </div>
          </div>

          {/* Collapsible/Expandable Itinerary */}
          <div className="flex flex-col gap-4">
            <h2 className="text-lg font-bold text-slate-900 uppercase tracking-wider">
              Day-by-Day Itinerary
            </h2>
            <div className="flex flex-col gap-3">
              {trip.itinerary.map((day: ItineraryItem) => {
                const isOpen = activeItineraryDay === day.day;
                return (
                  <div
                    key={day.day}
                    className="border border-slate-200 rounded-xl overflow-hidden transition-all bg-white"
                  >
                    <button
                      onClick={() => setActiveItineraryDay(isOpen ? null : day.day)}
                      className="w-full text-left px-5 py-4 font-bold flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xs bg-slate-950 text-white font-bold w-6 h-6 rounded-full flex items-center justify-center">
                          {day.day}
                        </span>
                        <span className="text-sm text-slate-900 tracking-tight">{day.title}</span>
                      </div>
                      <span className="text-slate-400 text-xs font-bold uppercase">
                        {isOpen ? 'Collapse' : 'Expand'}
                      </span>
                    </button>

                    {isOpen && (
                      <div className="px-5 pb-5 pt-1 border-t border-slate-100 flex flex-col gap-4 animate-fade-in">
                        <p className="text-xs text-slate-500 font-normal leading-relaxed">
                          {day.description}
                        </p>
                        {day.activities && (
                          <div className="flex flex-col gap-2">
                            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Day Highlights:</span>
                            <div className="flex flex-wrap gap-1.5">
                              {day.activities.map((act: string) => (
                                <Badge key={act} variant="secondary" className="font-bold text-[10px] px-2.5 py-1">
                                  {act}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Included / Excluded Columns */}
          <div className="flex flex-col gap-4">
            <h2 className="text-lg font-bold text-slate-900 uppercase tracking-wider">
              Highlights & Checklist
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Included list */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 flex flex-col gap-3">
                <span className="text-xs font-extrabold uppercase tracking-widest text-green-700 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                  What is Included
                </span>
                <ul className="flex flex-col gap-2.5 text-xs text-slate-600">
                  {trip.included.map((inc: string) => (
                    <li key={inc} className="flex items-start gap-2">
                      <span className="text-green-500 font-bold shrink-0 mt-0.5">•</span>
                      <span>{inc}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Excluded list */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 flex flex-col gap-3">
                <span className="text-xs font-extrabold uppercase tracking-widest text-red-700 flex items-center gap-1.5">
                  <XCircle className="w-4 h-4 text-red-500" />
                  What is Excluded
                </span>
                <ul className="flex flex-col gap-2.5 text-xs text-slate-600">
                  {trip.excluded.map((exc: string) => (
                    <li key={exc} className="flex items-start gap-2">
                      <span className="text-red-400 font-bold shrink-0 mt-0.5">•</span>
                      <span>{exc}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Organizer Widget */}
          <div className="flex flex-col gap-4 border border-slate-200 rounded-xl p-5 bg-card-bg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={trip.organizerLogo}
                  alt={trip.organizerName}
                  className="w-12 h-12 rounded-full object-cover border border-slate-200"
                />
                <div>
                  <div className="flex items-center gap-1">
                    <h4 className="font-bold text-slate-900 text-sm">{trip.organizerName}</h4>
                    <ShieldCheck className="w-4 h-4 text-accent fill-teal-50" />
                  </div>
                  <span className="text-xs text-slate-400">Verified Vagana Expedition Host</span>
                </div>
              </div>
              
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleChatWithHost}
                className="flex items-center gap-1.5 font-bold cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 text-accent" />
                Message Host
              </Button>
            </div>
          </div>

          {/* Reviews list */}
          <div className="flex flex-col gap-4">
            <h2 className="text-lg font-bold text-slate-900 uppercase tracking-wider">
              Reviews & Feedback
            </h2>
            {tripReviews.length > 0 ? (
              <div className="flex flex-col gap-4">
                {tripReviews.map((rev: Review) => (
                  <ReviewCard key={rev.id} review={rev} />
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic">No reviews yet for this trip package.</p>
            )}
          </div>

        </div>

        {/* Right Side - Sticky Booking Sidebar */}
        <div className="col-span-1 sticky top-24">
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xl flex flex-col gap-5">
            <div className="flex items-end justify-between border-b border-slate-100 pb-4">
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">
                  Price Per Explorer
                </span>
                <span className="text-2xl font-black text-slate-900 mt-1">
                  ₹{trip.price.toLocaleString('en-IN')}
                </span>
              </div>
              <Badge variant="accent" className="font-bold">
                {trip.availableSeats} seats left
              </Badge>
            </div>

            {/* Select Travel Dates */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500">
                Departure Date
              </label>
              <div className="relative">
                <select
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2.5 text-xs font-bold text-slate-900 outline-none focus:border-accent appearance-none cursor-pointer"
                >
                  {trip.dates.map((dt: string) => (
                    <option key={dt} value={dt}>
                      {new Date(dt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </option>
                  ))}
                </select>
                <Calendar className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Seats Select */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500">
                Number of Explorers
              </label>
              <div className="flex items-center gap-3">
                <button
                  disabled={seats <= 1}
                  onClick={() => setSeats(seats - 1)}
                  className="w-9 h-9 border border-slate-200 hover:border-slate-400 rounded-lg flex items-center justify-center font-bold text-sm disabled:opacity-40 cursor-pointer active:scale-95 shrink-0"
                >
                  -
                </button>
                <div className="flex-1 text-center font-black text-sm text-slate-900">
                  {seats} {seats === 1 ? 'Explorer' : 'Explorers'}
                </div>
                <button
                  disabled={seats >= trip.availableSeats}
                  onClick={() => setSeats(seats + 1)}
                  className="w-9 h-9 border border-slate-200 hover:border-slate-400 rounded-lg flex items-center justify-center font-bold text-sm disabled:opacity-40 cursor-pointer active:scale-95 shrink-0"
                >
                  +
                </button>
              </div>
            </div>

            {errorMsg && (
              <div className="bg-red-50 border border-red-200 text-danger text-xs rounded-lg p-3 flex items-start gap-2 animate-fade-in">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            {successMsg && (
              <div className="bg-teal-50 border border-teal-200 text-teal-900 text-xs rounded-lg p-3 flex items-start gap-2 animate-fade-in">
                <CheckCircle2 className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                <span>{successMsg}</span>
              </div>
            )}

            {/* Price Calculations */}
            <div className="bg-slate-50 rounded-lg p-3.5 border border-slate-100 flex flex-col gap-2 text-xs text-slate-600">
              <div className="flex justify-between font-medium">
                <span>₹{trip.price.toLocaleString('en-IN')} × {seats} guests</span>
                <span>₹{totalPrice.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between font-medium">
                <span>Platform Commission Fee</span>
                <span className="text-green-600 font-bold">FREE (MVP)</span>
              </div>
              <div className="flex justify-between font-black text-slate-900 pt-2 border-t border-slate-200 text-sm mt-1">
                <span>Total Amount Due</span>
                <span>₹{totalPrice.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Book trigger */}
            <Button
              variant="accent"
              isLoading={isBooking}
              onClick={handleCheckout}
              className="w-full font-extrabold py-3.5 flex items-center justify-center gap-1.5 cursor-pointer shadow-lg"
            >
              Confirm Booking
              <ArrowRight className="w-4.5 h-4.5" />
            </Button>

            <span className="text-[10px] text-slate-400 font-medium text-center leading-normal">
              72h Free Cancellation • Fully Refutable • Verified Local Leader
            </span>

          </div>
        </div>

      </div>

      {/* 4. Related Trips Grid */}
      {relatedTrips.length > 0 && (
        <section className="flex flex-col gap-6 pt-10 border-t border-slate-100">
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Similar Adventures You Might Like
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {relatedTrips.map((related: Trip) => (
              <TripCard key={related.id} trip={related} />
            ))}
          </div>
        </section>
      )}

    </div>
  );
}
