'use client';

import * as React from 'react';
import Link from 'next/link';
import { useBookingStore } from '@/store/useBookingStore';
import { useTripStore } from '@/store/useTripStore';
import { useCustomTripStore } from '@/store/useCustomTripStore';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import {
  Compass, IndianRupee, Calendar, Star, TrendingUp,
  PlusCircle, Sparkles, CheckCircle2, MessageCircle, Clock
} from 'lucide-react';

export default function OrganizerOverviewPage() {
  const { bookings } = useBookingStore();
  const { trips } = useTripStore();
  const { requests } = useCustomTripStore();

  const orgTrips = trips.filter(t => t.organizerId === 'user-org-1');
  const orgBookings = bookings.filter(b => b.organizerId === 'user-org-1');

  // Compute metrics
  const totalTripsCount = orgTrips.length;
  const activeBookingsCount = orgBookings.filter(b => b.status === 'pending' || b.status === 'confirmed').length;
  
  const totalRevenue = React.useMemo(() => {
    return orgBookings
      .filter(b => b.status === 'confirmed' || b.status === 'completed')
      .reduce((sum, curr) => sum + curr.totalPrice, 0);
  }, [orgBookings]);

  // Simulated metrics
  const hostRating = 4.8;
  const reviewsCount = 39;

  // Custom visual SVG bar chart details (months vs bookings)
  const chartData = [
    { month: 'Jan', revenue: 15, bookings: 4 },
    { month: 'Feb', revenue: 32, bookings: 8 },
    { month: 'Mar', revenue: 24, bookings: 6 },
    { month: 'Apr', revenue: 48, bookings: 12 },
    { month: 'May', revenue: 65, bookings: 16 }
  ];

  return (
    <div className="flex flex-col gap-8 animate-fade-in">
      
      {/* 1. Welcome Headline */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900 leading-tight">
            Host Dashboard Overview
          </h1>
          <p className="text-xs text-slate-400 font-medium mt-0.5">
            Monitor listings, payouts ledger, customer bids, and platform ratings
          </p>
        </div>

        <Link href="/organizer/trips/create">
          <Button variant="accent" size="sm" className="font-bold flex items-center gap-1.5 cursor-pointer">
            <PlusCircle className="w-4 h-4" />
            Create Trip Listing
          </Button>
        </Link>
      </div>

      {/* 2. Metrics Cards Grid */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        
        {/* Earnings Card */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col gap-2">
          <span className="text-[9px] font-extrabold uppercase tracking-widest text-slate-400 leading-none">
            Total Revenue
          </span>
          <span className="text-xl md:text-2xl font-black text-slate-900 mt-1 flex items-center leading-none">
            <IndianRupee className="w-4.5 h-4.5 text-accent" />
            {totalRevenue.toLocaleString('en-IN')}
          </span>
          <span className="text-[9px] font-bold text-green-600 mt-1 flex items-center gap-0.5">
            <TrendingUp className="w-3 h-3" />
            +18.2% vs last month
          </span>
        </div>

        {/* Listings count Card */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col gap-2">
          <span className="text-[9px] font-extrabold uppercase tracking-widest text-slate-400 leading-none">
            Active Packages
          </span>
          <span className="text-xl md:text-2xl font-black text-slate-900 mt-1 flex items-center leading-none gap-1">
            <Compass className="w-5 h-5 text-accent" />
            {totalTripsCount}
          </span>
          <span className="text-[9px] font-bold text-slate-400 mt-1">
            {orgTrips.filter(t => t.status === 'draft').length} saved drafts
          </span>
        </div>

        {/* Active Bookings Card */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col gap-2">
          <span className="text-[9px] font-extrabold uppercase tracking-widest text-slate-400 leading-none">
            Active Bookings
          </span>
          <span className="text-xl md:text-2xl font-black text-slate-900 mt-1 flex items-center leading-none gap-1">
            <Calendar className="w-5 h-5 text-accent" />
            {activeBookingsCount}
          </span>
          <span className="text-[9px] font-bold text-amber-500 mt-1">
            {orgBookings.filter(b => b.status === 'pending').length} approvals pending
          </span>
        </div>

        {/* Reviews Rating Card */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col gap-2">
          <span className="text-[9px] font-extrabold uppercase tracking-widest text-slate-400 leading-none">
            Host Rating
          </span>
          <span className="text-xl md:text-2xl font-black text-slate-900 mt-1 flex items-center leading-none gap-1">
            <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
            {hostRating.toFixed(1)}
          </span>
          <span className="text-[9px] font-bold text-slate-400 mt-1">
            Across {reviewsCount} verified reviews
          </span>
        </div>

      </section>

      {/* 3. Splitted Analytics Graphs & Activity Feed */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 items-start">
        
        {/* Left Side: SVG Charts and Trends */}
        <div className="col-span-1 md:col-span-2 flex flex-col gap-6">
          
          {/* Custom SVG Bookings Chart */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col gap-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1">
                <TrendingUp className="w-4 h-4 text-accent animate-pulse" />
                Bookings & Revenue Performance
              </span>
              <span className="text-[10px] text-slate-400 font-medium">Year: {new Date().getFullYear()}</span>
            </div>

            {/* Custom SVG Line and Bar Graph */}
            <div className="w-full h-48 flex items-end justify-between px-4 pb-2 border-b border-slate-200 relative pt-6">
              {/* Grid Lines */}
              <div className="absolute inset-x-0 bottom-12 border-t border-slate-100 border-dashed" />
              <div className="absolute inset-x-0 bottom-24 border-t border-slate-100 border-dashed" />
              <div className="absolute inset-x-0 bottom-36 border-t border-slate-100 border-dashed" />

              {chartData.map((data, index) => {
                const barHeight = `${(data.revenue / 75) * 100}%`;
                return (
                  <div key={index} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group z-10">
                    {/* Tooltip hover */}
                    <div className="opacity-0 group-hover:opacity-100 absolute bottom-32 bg-slate-950 text-white rounded text-[10px] py-1 px-2 font-bold transition-all shadow-md">
                      ₹{(data.revenue * 1000).toLocaleString()} • {data.bookings} Bookings
                    </div>

                    {/* Bar chart column */}
                    <div
                      style={{ height: barHeight }}
                      className="w-10 bg-accent/80 hover:bg-accent rounded-t-md transition-all shadow-sm flex items-end justify-center"
                    />
                    
                    {/* Month name label */}
                    <span className="text-[10px] text-slate-400 font-bold">{data.month}</span>
                  </div>
                );
              })}
            </div>
            
            <div className="flex gap-4 text-[10px] text-slate-500 font-bold justify-center">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 bg-accent rounded" />
                Monthly Revenue (₹ Thousands)
              </span>
            </div>
          </div>
        </div>

        {/* Right Side: Feed of Recent Activity alerts */}
        <div className="flex flex-col gap-6">
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col gap-4">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-3 flex items-center gap-1.5">
              <Sparkles className="w-4.5 h-4.5 text-accent" />
              Host Log Alert Feed
            </h3>

            <div className="flex flex-col gap-4 text-xs font-medium text-slate-600">
              
              {/* Alert 1 */}
              <div className="flex gap-3 items-start">
                <div className="w-2 h-2 rounded-full bg-accent mt-2 animate-ping shrink-0" />
                <div className="flex flex-col gap-0.5">
                  <span className="font-bold text-slate-900">New Booking Pending</span>
                  <span className="text-[10px] text-slate-400">Rithish N paid ₹6,998 for Coorg Plantation trek.</span>
                  <span className="text-[9px] text-slate-400 mt-0.5">2 hours ago</span>
                </div>
              </div>

              {/* Alert 2 */}
              <div className="flex gap-3 items-start">
                <div className="w-2 h-2 rounded-full bg-purple-500 mt-2 shrink-0" />
                <div className="flex flex-col gap-0.5">
                  <span className="font-bold text-slate-900">Custom Request Received</span>
                  <span className="text-[10px] text-slate-400">Kerala custom itinerary bid request received.</span>
                  <span className="text-[9px] text-slate-400 mt-0.5">Yesterday</span>
                </div>
              </div>

              {/* Alert 3 */}
              <div className="flex gap-3 items-start">
                <div className="w-2 h-2 rounded-full bg-green-500 mt-2 shrink-0" />
                <div className="flex flex-col gap-0.5">
                  <span className="font-bold text-slate-900">New Customer Review</span>
                  <span className="text-[10px] text-slate-400">Aarav Mehta rated 5 stars on Coorg plantation trek.</span>
                  <span className="text-[9px] text-slate-400 mt-0.5">3 days ago</span>
                </div>
              </div>

            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
