'use client';

import * as React from 'react';
import Link from 'next/link';
import { User } from '../../types';
import { Star, ShieldCheck, Compass } from 'lucide-react';
import { Button } from '../ui/Button';

export interface OrganizerCardProps {
  organizer: User;
}

export const OrganizerCard: React.FC<OrganizerCardProps> = ({ organizer }) => {
  return (
    <div className="bg-card-bg border border-slate-200 rounded-xl p-5 hover-lift flex flex-col justify-between h-full airbnb-card-shadow">
      
      <div className="flex flex-col gap-4">
        {/* Banner/Header */}
        <div className="flex items-center gap-4">
          <img
            src={organizer.avatar || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150'}
            alt={organizer.companyName || organizer.name}
            className="w-14 h-14 rounded-full object-cover border border-slate-200 bg-slate-50"
          />
          <div>
            <div className="flex items-center gap-1">
              <h3 className="font-bold text-slate-900 leading-tight">
                {organizer.companyName || organizer.name}
              </h3>
              {organizer.verified && (
                <span title="Verified Host">
                  <ShieldCheck className="w-4 h-4 text-accent fill-teal-50" />
                </span>
              )}
            </div>
            
            {/* Rating */}
            <div className="flex items-center gap-1 mt-1">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span className="text-xs font-bold text-slate-700">{organizer.rating?.toFixed(1) || '4.8'}</span>
              <span className="text-xs text-slate-400">({organizer.yearsActive || 3} yrs active)</span>
            </div>
          </div>
        </div>

        {/* Bio */}
        <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed">
          {organizer.description || 'Verified Vagana outdoor travel organizer hosting premium wilderness camps, eco tours, and mountaineering trips.'}
        </p>

        {/* Statistics grid */}
        <div className="grid grid-cols-2 gap-2 bg-white rounded-lg p-3 border border-slate-100 mt-1">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">
              Trips Hosted
            </span>
            <span className="text-sm font-black text-slate-800 mt-1 flex items-center gap-1">
              <Compass className="w-3.5 h-3.5 text-accent" />
              {organizer.tripsConducted || 24}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">
              Happy Explorers
            </span>
            <span className="text-sm font-black text-slate-800 mt-1">
              {organizer.customersServed?.toLocaleString('en-IN') || '450'}+
            </span>
          </div>
        </div>
      </div>

      <div className="pt-4 border-t border-slate-100 mt-5">
        <Link href={`/organizer/${organizer.id}`} className="w-full">
          <Button variant="outline" className="w-full text-xs font-bold py-2 cursor-pointer">
            View Host Profile
          </Button>
        </Link>
      </div>

    </div>
  );
};
