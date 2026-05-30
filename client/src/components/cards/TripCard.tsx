'use client';

import * as React from 'react';
import Link from 'next/link';
import { Trip } from '../../types';
import { useBookingStore } from '../../store/useBookingStore';
import { Star, MapPin, Clock, Heart } from 'lucide-react';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

export interface TripCardProps {
  trip: Trip;
}

export const TripCard: React.FC<TripCardProps> = ({ trip }) => {
  const { toggleWishlist, isInWishlist } = useBookingStore();
  const isWishlisted = isInWishlist(trip.id);

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(trip.id);
  };

  return (
    <div className="group relative bg-card-bg rounded-xl border border-slate-200 overflow-hidden hover-lift flex flex-col h-full airbnb-card-shadow">
      
      {/* Thumbnail */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100">
        <img
          src={trip.image}
          alt={trip.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        
        {/* Category tag */}
        <div className="absolute top-3 left-3 z-10">
          <Badge variant="primary" className="bg-slate-950/80 backdrop-blur-sm text-white border-none font-bold">
            {trip.category}
          </Badge>
        </div>

        {/* Wishlist Heart Toggle */}
        <button
          onClick={handleWishlistClick}
          className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center border border-slate-100 shadow-md transition-all active:scale-90 hover:bg-white cursor-pointer"
        >
          <Heart
            className={`w-4.5 h-4.5 transition-colors ${
              isWishlisted ? 'fill-red-500 text-red-500' : 'text-slate-400 group-hover/heart:text-slate-600'
            }`}
          />
        </button>
      </div>

      {/* Body Details */}
      <div className="flex-1 p-4 flex flex-col justify-between gap-4">
        <div className="flex flex-col gap-2">
          {/* Rating */}
          <div className="flex items-center gap-1 text-xs text-slate-500 font-medium">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span className="font-bold text-slate-900">{trip.rating.toFixed(1)}</span>
            <span>({trip.reviewsCount} reviews)</span>
            <span className="mx-1.5 text-slate-300">•</span>
            <span className="font-bold text-slate-800 truncate">{trip.organizerName}</span>
          </div>

          {/* Title */}
          <h3 className="text-base font-bold text-slate-900 tracking-tight leading-snug line-clamp-1 group-hover:text-accent transition-colors">
            {trip.title}
          </h3>

          {/* Specs */}
          <div className="flex items-center gap-3 text-xs text-slate-500 font-medium mt-1">
            <div className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              <span>{trip.destination}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>{trip.durationDays} Days</span>
            </div>
          </div>
        </div>

        {/* Pricing and Action */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-100 mt-auto">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">
              Price From
            </span>
            <span className="text-lg font-black text-slate-900 mt-0.5">
              ₹{trip.price.toLocaleString('en-IN')}
            </span>
          </div>
          
          <Link href={`/trips/${trip.id}`}>
            <Button variant="accent" size="sm" className="font-bold cursor-pointer">
              Book Now
            </Button>
          </Link>
        </div>

      </div>

    </div>
  );
};
