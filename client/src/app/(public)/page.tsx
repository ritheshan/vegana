'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { CATEGORIES, POPULAR_DESTINATIONS, MOCK_USERS } from '../../constants';
import { useTripStore } from '../../store/useTripStore';
import { TripCard } from '../../components/cards/TripCard';
import { OrganizerCard } from '../../components/cards/OrganizerCard';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Mountain, Waves, Compass, Tent, Sparkles, Trees, BookOpen, Footprints, Search, Calendar, Users, Star } from 'lucide-react';

const ICON_MAP = {
  Mountain,
  Waves,
  Compass,
  Tent,
  Sparkles,
  Trees,
  BookOpen,
  Footprints,
};

export default function HomePage() {
  const router = useRouter();
  const { trips } = useTripStore();
  const featuredTrips = trips.filter(t => t.status === 'published').slice(0, 3);
  const topOrganizers = [MOCK_USERS.organizer1, MOCK_USERS.organizer2];

  // Search Form State
  const [destination, setDestination] = React.useState('');
  const [date, setDate] = React.useState('');
  const [guests, setGuests] = React.useState('1');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (destination) params.append('destination', destination);
    if (date) params.append('date', date);
    if (guests) params.append('guests', guests);
    router.push(`/trips?${params.toString()}`);
  };

  const selectCategory = (categoryName: string) => {
    router.push(`/trips?category=${categoryName}`);
  };

  return (
    <div className="flex flex-col gap-16 md:gap-24">
      
      {/* 1. HERO SECTION */}
      <section className="relative w-full rounded-2xl md:rounded-3xl overflow-hidden aspect-[16/10] md:aspect-[21/9] min-h-[360px] bg-slate-900 flex items-center justify-center p-6 md:p-12">
        {/* Background Image Overlay */}
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1600')] bg-cover bg-center opacity-40 mix-blend-overlay" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/30 to-transparent" />

        <div className="relative z-10 w-full max-w-4xl flex flex-col items-center text-center gap-6 md:gap-8">
          <div className="flex flex-col gap-3">
            <span className="text-[10px] font-bold text-teal-400 uppercase tracking-widest leading-none">
              Explore the Unexplored
            </span>
            <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-tight">
              Discover Amazing Trips <br className="hidden md:inline" /> Around The World
            </h1>
          </div>
          
          {/* Zomato-style Premium Search Bar Container */}
          <form
            onSubmit={handleSearch}
            className="w-full bg-white rounded-xl md:rounded-full p-2 md:p-3 shadow-2xl flex flex-col md:flex-row items-stretch md:items-center gap-2 border border-slate-100 max-w-3xl"
          >
            {/* Destination Input */}
            <div className="flex-1 flex items-center gap-2.5 px-3 py-1.5 md:py-0 border-b md:border-b-0 md:border-r border-slate-100">
              <Search className="w-5 h-5 text-slate-400 shrink-0" />
              <input
                type="text"
                placeholder="Where to? (e.g. Coorg, Goa, Manali)"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="w-full bg-transparent border-none text-sm text-slate-900 outline-none placeholder:text-slate-400 font-medium"
              />
            </div>

            {/* Date Input */}
            <div className="flex-1 flex items-center gap-2.5 px-3 py-1.5 md:py-0 border-b md:border-b-0 md:border-r border-slate-100">
              <Calendar className="w-5 h-5 text-slate-400 shrink-0" />
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-transparent border-none text-sm text-slate-900 outline-none placeholder:text-slate-400 font-medium cursor-pointer"
              />
            </div>

            {/* Guests Input */}
            <div className="flex-1 flex items-center gap-2.5 px-3 py-1.5 md:py-0">
              <Users className="w-5 h-5 text-slate-400 shrink-0" />
              <select
                value={guests}
                onChange={(e) => setGuests(e.target.value)}
                className="w-full bg-transparent border-none text-sm text-slate-900 outline-none placeholder:text-slate-400 font-medium cursor-pointer appearance-none"
              >
                <option value="1">1 Explorer</option>
                <option value="2">2 Explorers</option>
                <option value="3">3 Explorers</option>
                <option value="4">4+ Explorers</option>
              </select>
            </div>

            {/* Search Button */}
            <Button
              variant="accent"
              type="submit"
              className="md:rounded-full font-bold px-6 py-3 cursor-pointer shrink-0"
            >
              Search
            </Button>
          </form>

        </div>
      </section>

      {/* 2. CATEGORIES SECTION */}
      <section className="flex flex-col gap-6">
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-bold text-accent uppercase tracking-widest leading-none">
            Find by vibe
          </span>
          <h2 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900">
            Adventure Categories
          </h2>
        </div>
        
        {/* Horizontal scroll list */}
        <div className="flex items-center gap-3 overflow-x-auto pb-4 -mx-4 px-4 scrollbar-none md:overflow-visible md:flex-wrap md:p-0 md:m-0">
          {CATEGORIES.map((cat) => {
            const IconComponent = ICON_MAP[cat.icon];
            return (
              <button
                key={cat.name}
                onClick={() => selectCategory(cat.name)}
                className="flex items-center gap-2 px-4 py-3 bg-slate-50 border border-slate-200 rounded-full hover:border-slate-400 hover:bg-slate-100 transition-all text-xs font-bold text-slate-700 whitespace-nowrap cursor-pointer hover:scale-105 active:scale-95 shrink-0"
              >
                <IconComponent className="w-4 h-4 text-accent" />
                {cat.name}
              </button>
            );
          })}
        </div>
      </section>

      {/* 3. TRENDING TRIPS */}
      <section className="flex flex-col gap-6">
        <div className="flex items-end justify-between">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-bold text-accent uppercase tracking-widest leading-none">
              Most Popular Listings
            </span>
            <h2 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900">
              Trending Expeditions
            </h2>
          </div>
          <Link href="/trips" className="text-xs font-bold text-accent hover:text-teal-600 transition-colors uppercase tracking-wider">
            View All Trips →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredTrips.map((trip) => (
            <TripCard key={trip.id} trip={trip} />
          ))}
        </div>
      </section>

      {/* 4. POPULAR DESTINATIONS */}
      <section className="flex flex-col gap-6">
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-bold text-accent uppercase tracking-widest leading-none">
            Highly Recommended
          </span>
          <h2 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900">
            Popular Destinations
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {POPULAR_DESTINATIONS.map((dest) => (
            <div
              key={dest.name}
              onClick={() => router.push(`/trips?destination=${dest.name}`)}
              className="group relative rounded-xl overflow-hidden aspect-[4/3] bg-slate-900 border border-slate-100 shadow-md cursor-pointer hover-lift"
            >
              <img
                src={dest.image}
                alt={dest.name}
                className="absolute inset-0 w-full h-full object-cover opacity-60 transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent" />
              <div className="absolute bottom-4 left-4 z-10 flex flex-col">
                <span className="text-[9px] font-black text-teal-400 uppercase tracking-widest">
                  {dest.tag}
                </span>
                <span className="text-base font-bold text-white mt-0.5">
                  {dest.name}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. TOP ORGANIZERS */}
      <section id="organizers" className="flex flex-col gap-6">
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-bold text-accent uppercase tracking-widest leading-none">
            Verified Trip Creators
          </span>
          <h2 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900">
            Top Organizers Section
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {topOrganizers.map((org) => (
            <OrganizerCard key={org.id} organizer={org} />
          ))}
        </div>
      </section>

      {/* 6. TESTIMONIALS */}
      <section className="bg-slate-50 border border-slate-200 rounded-2xl p-6 md:p-10 flex flex-col gap-8 md:gap-10">
        <div className="text-center flex flex-col gap-1 max-w-md mx-auto">
          <span className="text-[10px] font-bold text-accent uppercase tracking-widest leading-none">
            Real Reviews
          </span>
          <h2 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900">
            Loved by Adventurers
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col justify-between gap-4">
            <p className="text-sm text-slate-500 italic leading-relaxed">
              "Booking our Goa Hidden Beach camp was exceptionally smooth. The host Adventure Nest organized kayaks, sea-side barbecues, and beautiful beachfront tents. Unforgettable experience."
            </p>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-slate-200 overflow-hidden">
                <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100" alt="Explorer" className="object-cover w-full h-full" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">Rahul Varma</h4>
                <div className="flex items-center gap-0.5 mt-0.5">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />)}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col justify-between gap-4">
            <p className="text-sm text-slate-500 italic leading-relaxed">
              "The Kashmir Lakes Alpine Trek is challenging, but Himalayan Trails hosted it with top-notch safety. Professional mountaineering leaders, great meals, and ponies for luggage. 5 stars!"
            </p>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-slate-200 overflow-hidden">
                <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100" alt="Explorer" className="object-cover w-full h-full" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">Divya Deshmukh</h4>
                <div className="flex items-center gap-0.5 mt-0.5">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />)}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col justify-between gap-4">
            <p className="text-sm text-slate-500 italic leading-relaxed">
              "Coorg organic plantation trek was very relaxing. Walking through green coffee ridges, staying in Kodava wooden homestays, and tasting filter coffee. Vagana matching platform works great!"
            </p>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-slate-200 overflow-hidden">
                <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100" alt="Explorer" className="object-cover w-full h-full" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">Aditya Sen</h4>
                <div className="flex items-center gap-0.5 mt-0.5">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. CTA */}
      <section className="relative rounded-2xl md:rounded-3xl bg-slate-950 p-8 md:p-12 overflow-hidden border border-slate-900 flex flex-col items-center text-center gap-6">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1486916856992-e4db22c8df33?w=1200')] bg-cover bg-center opacity-10 mix-blend-overlay" />
        
        <div className="relative z-10 max-w-2xl flex flex-col items-center gap-6">
          <div className="flex flex-col gap-2">
            <span className="text-[10px] font-bold text-teal-400 uppercase tracking-widest">
              Grow Your Tourism Business
            </span>
            <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">
              Are you an outdoor trip organizer?
            </h2>
          </div>
          <p className="text-sm text-slate-400 leading-relaxed font-light">
            List your wilderness base treks, nature trails, or beach camping tours on Vagana. Manage bookings, converse with guests, and collect payments on a modern, premium marketplace.
          </p>
          <div className="flex flex-wrap gap-4 mt-2 justify-center">
            <Link href="/auth/register">
              <Button variant="accent" className="font-bold cursor-pointer">
                Create Organizer Account
              </Button>
            </Link>
            <Link href="/trips">
              <Button variant="outline" className="border-slate-800 text-white hover:bg-slate-900 font-bold cursor-pointer">
                Browse Active Tours
              </Button>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
