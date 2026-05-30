'use client';

import * as React from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useTripStore } from '@/store/useTripStore';
import { TripCard } from '@/components/cards/TripCard';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Search, SlidersHorizontal, Compass, ShieldAlert } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Trip } from '@/types';

export default function SearchPage() {
  return (
    <React.Suspense fallback={
      <div className="py-20 text-center flex flex-col items-center justify-center gap-3">
        <div className="w-10 h-10 border-4 border-t-accent border-slate-200 rounded-full animate-spin" />
        <p className="text-xs text-slate-400 font-bold">Loading Adventures Discovery...</p>
      </div>
    }>
      <SearchPageContent />
    </React.Suspense>
  );
}

function SearchPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { trips } = useTripStore();

  // Active filter states populated by URL queries initially
  const [searchTerm, setSearchTerm] = React.useState(searchParams.get('destination') || '');
  const [selectedCategory, setSelectedCategory] = React.useState(searchParams.get('category') || 'All');
  const [budget, setBudget] = React.useState(searchParams.get('budget') ? Number(searchParams.get('budget')) : 15000);
  const [duration, setDuration] = React.useState('All'); // 'All' | '1-3' | '4-6' | '7+'
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  // Apply filters to list of trips
  const filteredTrips = React.useMemo(() => {
    return trips.filter((trip: Trip) => {
      // Must be published to view on public search
      if (trip.status !== 'published') return false;

      // Destination filter
      if (searchTerm) {
        const destMatch = trip.destination.toLowerCase().includes(searchTerm.toLowerCase());
        const titleMatch = trip.title.toLowerCase().includes(searchTerm.toLowerCase());
        if (!destMatch && !titleMatch) return false;
      }

      // Category filter
      if (selectedCategory !== 'All' && trip.category !== selectedCategory) {
        return false;
      }

      // Budget filter
      if (trip.price > budget) {
        return false;
      }

      // Duration filter
      if (duration !== 'All') {
        const days = trip.durationDays;
        if (duration === '1-3' && (days < 1 || days > 3)) return false;
        if (duration === '4-6' && (days < 4 || days > 6)) return false;
        if (duration === '7+' && days < 7) return false;
      }

      return true;
    });
  }, [trips, searchTerm, selectedCategory, budget, duration]);

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('All');
    setBudget(15000);
    setDuration('All');
    router.push('/trips');
  };

  const categories = ['All', 'Trekking', 'Beach', 'Adventure', 'Camping', 'Spiritual', 'Nature', 'Historical', 'Wildlife'];

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      
      {/* 1. Top Search Header */}
      <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Compass className="w-6 h-6 text-accent" />
            Explore Adventures
          </h1>
          <p className="text-xs text-slate-400 font-medium mt-0.5">
            Showing {filteredTrips.length} active packages matched your choice
          </p>
        </div>

        {/* Top text search input */}
        <div className="w-full md:w-80 flex items-center bg-white border border-slate-200 rounded-lg px-3 py-2.5 text-sm">
          <Search className="w-4.5 h-4.5 text-slate-400 mr-2" />
          <input
            type="text"
            placeholder="Search destination or trip title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-transparent border-none outline-none text-slate-950 placeholder:text-slate-400 font-medium"
          />
        </div>
      </div>

      {/* 2. Main Layout Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 items-start">
        
        {/* Left Filter Sidebar - Hidden on mobile, sticky on desktop */}
        <aside className="hidden md:flex flex-col gap-6 bg-card-bg border border-slate-200 rounded-xl p-6 sticky top-24 animate-fade-in">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <span className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <SlidersHorizontal className="w-4 h-4 text-accent" />
              Filter Sidebar
            </span>
            <button
              onClick={resetFilters}
              className="text-[10px] font-bold text-slate-400 hover:text-accent transition-colors uppercase tracking-widest cursor-pointer"
            >
              Reset
            </button>
          </div>

          {/* Category Tabs list */}
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500">
              Trip Category
            </label>
            <div className="flex flex-col gap-1 max-h-48 overflow-y-auto pr-1">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    selectedCategory === cat
                      ? 'bg-accent text-white'
                      : 'hover:bg-slate-100 text-slate-600 hover:text-slate-900'
                  } cursor-pointer`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Budget Range slider */}
          <div className="flex flex-col gap-3">
            <div className="flex justify-between items-center">
              <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500">
                Max Budget
              </label>
              <span className="text-xs font-black text-slate-800">
                ₹{budget.toLocaleString('en-IN')}
              </span>
            </div>
            <input
              type="range"
              min="2000"
              max="20000"
              step="500"
              value={budget}
              onChange={(e) => setBudget(Number(e.target.value))}
              className="w-full accent-accent cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-bold">
              <span>₹2,000</span>
              <span>₹20,000</span>
            </div>
          </div>

          {/* Duration Selector */}
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500">
              Duration
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              {['All', '1-3', '4-6', '7+'].map((dur) => (
                <button
                  key={dur}
                  onClick={() => setDuration(dur)}
                  className={`px-2 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider border text-center transition-all ${
                    duration === dur
                      ? 'bg-primary text-white border-primary'
                      : 'bg-white border-slate-200 text-slate-600 hover:border-slate-400'
                  } cursor-pointer`}
                >
                  {dur} Days
                </button>
              ))}
            </div>
          </div>

        </aside>

        {/* Mobile Filters Toggle trigger */}
        <div className="md:hidden flex items-center justify-between">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setMobileMenuOpen(true)}
            className="flex items-center gap-2 font-bold cursor-pointer"
          >
            <SlidersHorizontal className="w-4 h-4 text-accent" />
            Adjust Filters
          </Button>
          
          <button
            onClick={resetFilters}
            className="text-[10px] font-bold text-slate-400 uppercase tracking-widest cursor-pointer"
          >
            Reset All
          </button>
        </div>

        {/* Right Results Grid */}
        <div className="col-span-1 md:col-span-3 flex flex-col gap-6">
          {filteredTrips.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {filteredTrips.map((trip: Trip) => (
                <TripCard key={trip.id} trip={trip} />
              ))}
            </div>
          ) : (
            /* Visual Empty State */
            <div className="bg-slate-50 border border-slate-200 border-dashed rounded-xl p-12 text-center flex flex-col items-center justify-center gap-4 max-w-lg mx-auto w-full mt-6">
              <div className="w-12 h-12 rounded-full bg-red-50 text-danger flex items-center justify-center border border-red-100">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="font-bold text-slate-900">No matching trips found</h3>
                <p className="text-xs text-slate-400 max-w-sm">
                  We couldn't find any active trips matching your chosen criteria. Try adjusting your sliders or category tabs.
                </p>
              </div>
              <Button variant="outline" size="sm" onClick={resetFilters} className="font-bold mt-2 cursor-pointer">
                Clear Filters
              </Button>
            </div>
          )}
        </div>

      </div>

      {/* Mobile Drawer Filter Panel */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div
            onClick={() => setMobileMenuOpen(false)}
            className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm"
          />
          <div className="relative w-80 bg-white h-full ml-auto shadow-2xl flex flex-col p-6 gap-6 z-10 animate-slide-in-right overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="font-extrabold text-xs uppercase tracking-wider text-slate-900">
                Adjust Filters
              </span>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="text-xs font-bold text-slate-400 cursor-pointer"
              >
                Close
              </button>
            </div>

            {/* Content identical to desktop sidebar */}
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500">
                Category
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => { setSelectedCategory(cat); setMobileMenuOpen(false); }}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-bold border transition-all ${
                      selectedCategory === cat
                        ? 'bg-accent text-white border-accent'
                        : 'bg-slate-55 border-slate-200 text-slate-700'
                    } cursor-pointer`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <div className="flex justify-between items-center">
                <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500">
                  Max Budget
                </label>
                <span className="text-xs font-black text-slate-800">
                  ₹{budget.toLocaleString('en-IN')}
                </span>
              </div>
              <input
                type="range"
                min="2000"
                max="20000"
                step="500"
                value={budget}
                onChange={(e) => setBudget(Number(e.target.value))}
                className="w-full accent-accent cursor-pointer"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500">
                Duration
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                {['All', '1-3', '4-6', '7+'].map((dur) => (
                  <button
                    key={dur}
                    onClick={() => { setDuration(dur); setMobileMenuOpen(false); }}
                    className={`px-2 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider border text-center transition-all ${
                      duration === dur
                        ? 'bg-primary text-white border-primary'
                        : 'bg-white border-slate-200 text-slate-600'
                    } cursor-pointer`}
                  >
                    {dur} Days
                  </button>
                ))}
              </div>
            </div>

            <Button
              variant="primary"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full mt-auto font-bold cursor-pointer"
            >
              Apply Filters
            </Button>
          </div>
        </div>
      )}

    </div>
  );
}
