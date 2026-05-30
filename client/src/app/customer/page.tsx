'use client';

import * as React from 'react';
import Link from 'next/link';
import { useBookingStore } from '../../store/useBookingStore';
import { useCustomTripStore } from '../../store/useCustomTripStore';
import { Button } from '../../components/ui/Button';
import {
  Calendar, Heart, Sparkles, AlertCircle, Compass, ArrowRight,
  Clock, CheckCircle2, MessageCircle, RefreshCw
} from 'lucide-react';
import { Badge } from '../../components/ui/Badge';

export default function CustomerDashboardPage() {
  const { bookings, wishlistIds } = useBookingStore();
  const { requests } = useCustomTripStore();

  const pendingBookings = bookings.filter(b => b.status === 'pending');
  const confirmedBookings = bookings.filter(b => b.status === 'confirmed');

  // Compute countdown for nearest confirmed booking
  const upcomingTrip = React.useMemo(() => {
    if (confirmedBookings.length === 0) return null;
    
    // Pick nearest trip
    const sorted = [...confirmedBookings].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    const nearest = sorted[0];

    const today = new Date();
    const tripDate = new Date(nearest.date);
    const diffTime = tripDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return {
      ...nearest,
      daysRemaining: diffDays > 0 ? diffDays : 0
    };
  }, [confirmedBookings]);

  // Combined activity feed
  const activities = [
    { id: 'act-1', type: 'booking', text: 'You submitted a booking request for Coorg Coffee Plantation Trek.', time: '2 hours ago', icon: Calendar, color: 'text-accent bg-teal-50' },
    { id: 'act-2', type: 'custom', text: 'Adventure Nest sent a custom proposal for your Kerala itinerary request.', time: 'Yesterday', icon: Sparkles, color: 'text-purple-600 bg-purple-50' },
    { id: 'act-3', type: 'wishlist', text: 'You saved South Goa Hidden Beach Campout to your wishlist.', time: '3 days ago', icon: Heart, color: 'text-red-500 bg-red-50' }
  ];

  return (
    <div className="flex flex-col gap-8 animate-fade-in">
      
      {/* 1. Welcoming Hero Bar */}
      <div className="bg-slate-900 rounded-2xl p-6 md:p-8 text-white relative overflow-hidden border border-slate-950 flex flex-col gap-3">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1549488344-1f9b8d2bd1f3?w=800')] bg-cover bg-center opacity-10 mix-blend-overlay" />
        <div className="relative z-10 flex flex-col gap-2">
          <span className="text-[10px] font-bold text-teal-400 uppercase tracking-widest leading-none">
            Welcome back explorer
          </span>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white leading-none">
            Where to next, Rithish?
          </h1>
          <p className="text-xs text-slate-400 font-light mt-0.5 max-w-md leading-relaxed">
            You have {pendingBookings.length} booking awaiting host confirmation and {requests.filter(r => r.status === 'responded').length} custom itinerary proposals.
          </p>
        </div>
      </div>

      {/* 2. Main Splits Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 items-start">
        
        {/* Left Side: Countdown & Metrics cards */}
        <div className="col-span-1 md:col-span-2 flex flex-col gap-6">
          
          {/* Countdown Widget */}
          {upcomingTrip ? (
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col gap-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 flex items-center gap-1">
                  <Clock className="w-4 h-4 text-accent" />
                  Upcoming Expedition Countdown
                </span>
                <Badge variant="success" className="font-bold">Confirmed</Badge>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl bg-slate-100 overflow-hidden shrink-0 border border-slate-200">
                  <img src={upcomingTrip.tripImage} alt={upcomingTrip.tripTitle} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-bold text-slate-900 leading-snug truncate">{upcomingTrip.tripTitle}</h3>
                  <p className="text-xs text-slate-400 font-medium mt-0.5">
                    Departure date: {new Date(upcomingTrip.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </p>
                </div>
              </div>

              {/* Day countdown box */}
              <div className="bg-slate-50 rounded-lg p-4 border border-slate-100 flex items-center justify-between mt-1">
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Days Left</span>
                  <span className="text-3xl font-black text-slate-900 mt-1">{upcomingTrip.daysRemaining}</span>
                </div>
                <Link href="/customer/bookings">
                  <Button variant="outline" size="sm" className="font-bold text-xs cursor-pointer flex items-center gap-1">
                    Manage Tickets
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <div className="bg-white border border-slate-200 border-dashed rounded-xl p-6 text-center flex flex-col items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-slate-50 text-slate-400 flex items-center justify-center border border-slate-100">
                <Compass className="w-5 h-5" />
              </div>
              <div className="flex flex-col gap-0.5">
                <h3 className="text-xs font-bold text-slate-800">No upcoming active departures</h3>
                <p className="text-[10px] text-slate-400 max-w-xs leading-normal">
                  Find your next trekking or camping adventure by browsing our curated marketplace packages.
                </p>
              </div>
              <Link href="/trips">
                <Button variant="outline" size="sm" className="font-bold text-[10px] mt-1 cursor-pointer">
                  Explore Active Tours
                </Button>
              </Link>
            </div>
          )}

          {/* Quick Info Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-col gap-2">
              <span className="text-[9px] font-extrabold uppercase tracking-widest text-slate-400 leading-none">Wishlist count</span>
              <span className="text-2xl font-black text-slate-900 leading-none">{wishlistIds.length}</span>
              <Link href="/customer/wishlist" className="text-[10px] font-bold text-accent hover:underline mt-2 flex items-center gap-0.5">
                View saved trips
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-col gap-2">
              <span className="text-[9px] font-extrabold uppercase tracking-widest text-slate-400 leading-none">Custom requests</span>
              <span className="text-2xl font-black text-slate-900 leading-none">{requests.length}</span>
              <Link href="/customer/custom-requests" className="text-[10px] font-bold text-accent hover:underline mt-2 flex items-center gap-0.5">
                View proposal bids
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>

          {/* Recent Activity stream */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col gap-4">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-3">
              Recent Activity Feed
            </h3>
            <div className="flex flex-col gap-4">
              {activities.map((act) => {
                const IconComponent = act.icon;
                return (
                  <div key={act.id} className="flex gap-3.5 items-start">
                    <div className={`p-2 rounded-lg ${act.color} shrink-0`}>
                      <IconComponent className="w-4 h-4" />
                    </div>
                    <div className="flex-1 flex flex-col gap-0.5">
                      <p className="text-xs font-semibold text-slate-700 leading-snug">{act.text}</p>
                      <span className="text-[10px] text-slate-400">{act.time}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Right Side: Quick Notifications & Announcements */}
        <div className="flex flex-col gap-6">
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col gap-4">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-3 flex items-center gap-1.5">
              <AlertCircle className="w-4.5 h-4.5 text-accent" />
              System Alerts
            </h3>
            
            <div className="flex flex-col gap-4 text-xs">
              <div className="flex gap-2.5 items-start bg-amber-50/50 border border-amber-100 rounded-lg p-3 text-amber-800">
                <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <div className="flex flex-col gap-0.5">
                  <span className="font-bold">Pending Documentation</span>
                  <span className="text-[10px] leading-relaxed text-amber-700">Please verify your email address to unlock quick booking triggers.</span>
                </div>
              </div>

              <div className="flex gap-2.5 items-start bg-teal-50/50 border border-teal-100 rounded-lg p-3 text-teal-900">
                <CheckCircle2 className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                <div className="flex flex-col gap-0.5">
                  <span className="font-bold">Safety Guide active</span>
                  <span className="text-[10px] leading-relaxed text-slate-500">All local guides on Vagana are certified by government mountaineering boards.</span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
