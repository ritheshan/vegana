'use client';

import * as React from 'react';
import { useTripStore } from '@/store/useTripStore';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Compass, ShieldAlert, CheckCircle2, Star, Trash2, Eye } from 'lucide-react';
import Link from 'next/link';
import { Trip } from '@/types';

export default function AdminTripsPage() {
  const { trips, togglePublish, deleteTrip } = useTripStore();
  
  const [toastText, setToastText] = React.useState('');

  const handleToggleFeatured = (id: string, current: boolean) => {
    // Simulated toggle feature in state updates
    const trip = trips.find(t => t.id === id);
    if (!trip) return;

    trip.featured = !current;
    setToastText(`Trip "${trip.title}" featured status changed!`);
    setTimeout(() => setToastText(''), 3000);
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      
      {/* Dynamic Action Alerts */}
      {toastText && (
        <div className="bg-teal-50 border border-teal-200 text-teal-900 rounded-xl p-4 flex gap-3 items-center text-xs animate-pulse">
          <CheckCircle2 className="w-5 h-5 text-accent shrink-0" />
          <span className="font-bold">{toastText}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col gap-1.5 border-b border-slate-200 pb-4">
        <h1 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
          <Compass className="w-6 h-6 text-accent" />
          Platform Trip Audit listings
        </h1>
        <p className="text-xs text-slate-400 font-medium">
          Monitor all registered travel packages, toggle featured categories, or unpublish listings globally
        </p>
      </div>

      {/* Global listings Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-100 bg-slate-50">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Platform Active listings</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50/50 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-100">
                <th className="p-4">Listing details</th>
                <th className="p-4">Host Name</th>
                <th className="p-4">Budget Per head</th>
                <th className="p-4">Audit status</th>
                <th className="p-4 text-right">Directives</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {trips.map((trip: Trip) => {
                const isPub = trip.status === 'published';
                return (
                  <tr key={trip.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img src={trip.image} alt={trip.title} className="w-10 h-10 rounded-lg object-cover border border-slate-200 shrink-0" />
                        <div className="flex flex-col gap-0.5 min-w-0">
                          <span className="font-bold text-slate-900 truncate max-w-xs">{trip.title}</span>
                          <span className="text-[9px] text-slate-400">ID: {trip.id} • Category: {trip.category} • Duration: {trip.durationDays} Days</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">{trip.organizerName}</td>
                    <td className="p-4 font-bold text-slate-900">₹{trip.price.toLocaleString('en-IN')}</td>
                    <td className="p-4">
                      <Badge variant={isPub ? 'success' : 'outline'} className="font-bold uppercase text-[9px]">
                        {trip.status}
                      </Badge>
                      {trip.featured && (
                        <Badge variant="accent" className="font-bold uppercase text-[9px] ml-1">
                          Featured
                        </Badge>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/trips/${trip.id}`} target="_blank">
                          <Button variant="outline" size="sm" className="font-bold text-[9px] py-1 cursor-pointer">
                            <Eye className="w-3.5 h-3.5" />
                          </Button>
                        </Link>
                        <Button
                          variant={trip.featured ? 'primary' : 'outline'}
                          size="sm"
                          onClick={() => handleToggleFeatured(trip.id, !!trip.featured)}
                          className="font-bold text-[9px] py-1 cursor-pointer flex items-center gap-0.5"
                          title="Toggle Featured"
                        >
                          <Star className={`w-3.5 h-3.5 ${trip.featured ? 'fill-amber-400 text-amber-400' : 'text-slate-400'}`} />
                        </Button>
                        <Button
                          variant={isPub ? 'secondary' : 'accent'}
                          size="sm"
                          onClick={() => togglePublish(trip.id)}
                          className="font-bold text-[9px] py-1 cursor-pointer"
                        >
                          {isPub ? 'Unpublish' : 'Publish'}
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
