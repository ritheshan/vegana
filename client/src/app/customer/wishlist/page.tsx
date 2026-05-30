'use client';

import * as React from 'react';
import Link from 'next/link';
import { useBookingStore } from '../../../store/useBookingStore';
import { useTripStore } from '../../../store/useTripStore';
import { TripCard } from '../../../components/cards/TripCard';
import { Button } from '../../../components/ui/Button';
import { Heart, Compass, ShieldAlert } from 'lucide-react';

export default function CustomerWishlistPage() {
  const { wishlistIds } = useBookingStore();
  const { trips } = useTripStore();

  const savedTrips = React.useMemo(() => {
    return trips.filter((t) => wishlistIds.includes(t.id) && t.status === 'published');
  }, [trips, wishlistIds]);

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col gap-1.5">
        <h1 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
          <Heart className="w-6 h-6 text-red-500 fill-red-50" />
          Saved Wishlist
        </h1>
        <p className="text-xs text-slate-400 font-medium">
          Manage your saved adventure packages and book departures when ready
        </p>
      </div>

      {/* Wishlist Grid */}
      {savedTrips.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {savedTrips.map((trip) => (
            <div key={trip.id} className="relative">
              <TripCard trip={trip} />
            </div>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-white border border-slate-200 border-dashed rounded-xl p-12 text-center flex flex-col items-center justify-center gap-3 max-w-md mx-auto w-full mt-6">
          <Heart className="w-10 h-10 text-slate-300" />
          <div className="flex flex-col gap-0.5">
            <h3 className="text-xs font-bold text-slate-800">Your wishlist is empty</h3>
            <p className="text-[10px] text-slate-400 max-w-xs leading-normal">
              Click the heart badge on explore cards to save adventure trips here for easy planning.
            </p>
          </div>
          <Link href="/trips">
            <Button variant="outline" size="sm" className="font-bold text-[10px] mt-1 cursor-pointer">
              Explore Active Trips
            </Button>
          </Link>
        </div>
      )}

    </div>
  );
}
