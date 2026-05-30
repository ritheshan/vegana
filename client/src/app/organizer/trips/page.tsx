'use client';

import * as React from 'react';
import Link from 'next/link';
import { useTripStore } from '@/store/useTripStore';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Trip } from '@/types';
import {
  Compass, PlusCircle, Calendar, Eye, Trash2,
  RefreshCw, CheckCircle2, AlertTriangle, AlertCircle
} from 'lucide-react';

export default function ManageTripsPage() {
  const { trips, togglePublish, deleteTrip } = useTripStore();
  
  // Adventure Nest (user-org-1) trips list
  const orgTrips = React.useMemo(() => {
    return trips.filter((t) => t.organizerId === 'user-org-1');
  }, [trips]);

  const [deleteConfirmationId, setDeleteConfirmationId] = React.useState<string | null>(null);

  const handleDelete = (id: string) => {
    deleteTrip(id);
    setDeleteConfirmationId(null);
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <Compass className="w-6 h-6 text-accent" />
            Manage My Trip Listings
          </h1>
          <p className="text-xs text-slate-400 font-medium">
            Publish/unpublish active adventure tours, modify itineraries, or audit customer ratings
          </p>
        </div>

        <Link href="/organizer/trips/create">
          <Button variant="accent" size="sm" className="font-bold flex items-center gap-1.5 cursor-pointer shadow-sm">
            <PlusCircle className="w-4 h-4" />
            Add New Tour Listing
          </Button>
        </Link>
      </div>

      {/* Listing Cards Container */}
      <div className="flex flex-col gap-4">
        {orgTrips.length > 0 ? (
          orgTrips.map((trip: Trip) => {
            const isPub = trip.status === 'published';
            return (
              <div
                key={trip.id}
                className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-5 shadow-sm hover:border-slate-300 transition-colors"
              >
                
                {/* Details thumbnail split */}
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-xl bg-slate-100 overflow-hidden shrink-0 border border-slate-200">
                    <img src={trip.image} alt={trip.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex flex-col gap-1.5 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge variant={isPub ? 'success' : 'outline'} className="font-bold">
                        {isPub ? 'Active / Published' : 'Draft / Offline'}
                      </Badge>
                      <Badge variant="secondary" className="font-bold">{trip.category}</Badge>
                    </div>

                    <h3 className="text-sm font-bold text-slate-900 leading-snug truncate">
                      {trip.title}
                    </h3>

                    <div className="flex items-center gap-3 text-[10px] text-slate-400 font-medium">
                      <span>₹{trip.price.toLocaleString('en-IN')} Per Guest</span>
                      <span>•</span>
                      <span>{trip.durationDays} Days Duration</span>
                      <span>•</span>
                      <span className="text-green-600 font-bold">{trip.availableSeats} Seats Available</span>
                    </div>
                  </div>
                </div>

                {/* Operations and actions togglers */}
                <div className="flex items-center justify-between md:justify-center gap-3 border-t md:border-t-0 pt-4 md:pt-0 border-slate-100">
                  
                  {/* Status Toggle control */}
                  <Button
                    variant={isPub ? 'secondary' : 'accent'}
                    size="sm"
                    onClick={() => togglePublish(trip.id)}
                    className="font-bold text-[10px] py-2 cursor-pointer flex items-center gap-1"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    {isPub ? 'Take Offline' : 'Publish Live'}
                  </Button>

                  {/* Public preview view */}
                  <Link href={`/trips/${trip.id}`} target="_blank">
                    <Button
                      variant="outline"
                      size="sm"
                      className="font-bold text-[10px] py-2 cursor-pointer flex items-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5 text-slate-400" />
                      Preview
                    </Button>
                  </Link>

                  {/* Delete Button */}
                  <button
                    onClick={() => setDeleteConfirmationId(trip.id)}
                    className="text-slate-400 hover:text-danger p-2 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer"
                    title="Delete Listing"
                  >
                    <Trash2 className="w-4.5 h-4.5" />
                  </button>

                </div>

              </div>
            );
          })
        ) : (
          <div className="bg-white border border-slate-200 border-dashed rounded-xl p-12 text-center flex flex-col items-center justify-center gap-3">
            <Compass className="w-10 h-10 text-slate-300" />
            <div className="flex flex-col gap-0.5">
              <h3 className="text-xs font-bold text-slate-800">No trips listed yet</h3>
              <p className="text-[10px] text-slate-400 max-w-xs leading-normal">
                You do not have any adventure tours registered on your organizer account yet. Let's create one!
              </p>
            </div>
            <Link href="/organizer/trips/create">
              <Button variant="accent" size="sm" className="font-bold mt-2 cursor-pointer">
                Create Your First Listing
              </Button>
            </Link>
          </div>
        )}
      </div>

      {/* Delete confirmation modal */}
      {deleteConfirmationId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div onClick={() => setDeleteConfirmationId(null)} className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm" />
          <div className="relative bg-white rounded-xl shadow-2xl p-6 border border-slate-200 max-w-sm w-full text-center flex flex-col gap-4 z-10 animate-fade-in">
            <div className="w-12 h-12 rounded-full bg-red-50 text-danger border border-red-100 flex items-center justify-center mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div className="flex flex-col gap-0.5">
              <h3 className="font-bold text-slate-950">Remove Trip Listing?</h3>
              <p className="text-xs text-slate-400 leading-normal">
                Are you sure you want to permanently delete this trip package? This action is irreversible and will delete active tickets.
              </p>
            </div>

            <div className="flex gap-3 justify-center pt-2">
              <Button variant="outline" size="sm" onClick={() => setDeleteConfirmationId(null)} className="font-bold cursor-pointer">
                Cancel
              </Button>
              <Button variant="danger" size="sm" onClick={() => handleDelete(deleteConfirmationId)} className="font-bold cursor-pointer">
                Delete Package
              </Button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
