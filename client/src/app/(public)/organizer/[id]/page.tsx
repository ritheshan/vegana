'use client';

import * as React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { MOCK_USERS, INITIAL_REVIEWS } from '@/constants';
import { useTripStore } from '@/store/useTripStore';
import { TripCard } from '@/components/cards/TripCard';
import { ReviewCard } from '@/components/cards/ReviewCard';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { useChatStore } from '@/store/useChatStore';
import { useAuthStore } from '@/store/useAuthStore';
import { Star, ShieldCheck, Compass, Users, Clock, Mail, Phone, Globe, MapPin, MessageSquare } from 'lucide-react';
import { User, Trip, Review } from '@/types';

export default function OrganizerProfilePage() {
  const params = useParams();
  const router = useRouter();
  
  const orgId = params.id as string;
  const { trips } = useTripStore();
  const { createConversation } = useChatStore();
  const { isAuthenticated } = useAuthStore();

  // Find matching organizer profile
  const org = Object.values(MOCK_USERS).find(u => u.id === orgId && u.role === 'organizer') as User | undefined;

  if (!org) {
    return (
      <div className="py-20 text-center flex flex-col items-center gap-4">
        <Compass className="w-12 h-12 text-slate-400" />
        <h2 className="text-xl font-bold">Organizer Profile Not Found</h2>
        <Button variant="outline" onClick={() => router.push('/')}>
          Return Home
        </Button>
      </div>
    );
  }

  // Get trips listed by this organizer
  const orgTrips = trips.filter(t => t.organizerId === org.id && t.status === 'published');

  // Get reviews of trips conducted by this organizer
  const orgReviews = INITIAL_REVIEWS.filter(r => {
    const trip = trips.find(t => t.id === r.tripId);
    return trip?.organizerId === org.id;
  });

  const handleStartChat = () => {
    if (!isAuthenticated) {
      router.push(`/auth/login?redirect=/organizer/${org.id}`);
      return;
    }

    const conversationId = createConversation(
      org.id,
      org.companyName || org.name,
      org.avatar || '',
      'organizer'
    );
    router.push(`/customer/custom-requests?active_chat=${conversationId}`);
  };

  return (
    <div className="flex flex-col gap-10 animate-fade-in">
      
      {/* 1. Header Banner & Profile Info */}
      <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-md">
        {/* Banner Cover */}
        <div className="h-44 md:h-64 bg-slate-900 relative">
          <img
            src={org.banner || 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200'}
            alt={org.companyName || org.name}
            className="w-full h-full object-cover opacity-50"
          />
        </div>

        {/* Profile Card Overlay */}
        <div className="px-6 pb-6 pt-16 md:pt-20 bg-white relative flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
          {/* Logo container */}
          <div className="absolute top-0 left-6 -translate-y-1/2 w-24 h-24 md:w-28 md:h-28 rounded-2xl overflow-hidden border-4 border-white bg-white shadow-lg">
            <img
              src={org.avatar || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150'}
              alt={org.companyName || org.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Org details */}
          <div className="flex flex-col gap-2 pl-0 md:pl-32">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight leading-none">
                {org.companyName || org.name}
              </h1>
              {org.verified && (
                <Badge variant="accent" className="font-bold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 fill-teal-50" />
                  Verified Host
                </Badge>
              )}
            </div>

            <p className="text-xs text-slate-400 font-bold flex items-center gap-1.5 mt-0.5">
              <MapPin className="w-3.5 h-3.5" />
              {org.address || 'Bangalore, India'}
            </p>
          </div>

          {/* Quick actions */}
          <div className="flex items-center gap-3 shrink-0">
            <Button
              variant="accent"
              onClick={handleStartChat}
              className="flex items-center gap-1.5 font-bold cursor-pointer"
            >
              <MessageSquare className="w-4 h-4" />
              Chat with Host
            </Button>
          </div>
        </div>
      </div>

      {/* 2. Portfolio Statistics Grid */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-slate-50 border border-slate-200 rounded-xl p-5 shadow-sm text-center">
        <div className="flex flex-col gap-1 border-r border-slate-200 md:border-r">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">
            Trips Hosted
          </span>
          <span className="text-xl font-black text-slate-900 mt-1 flex items-center justify-center gap-1">
            <Compass className="w-5 h-5 text-accent" />
            {org.tripsConducted || 42}
          </span>
        </div>
        <div className="flex flex-col gap-1 border-r border-slate-200 md:border-r">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">
            Customers Served
          </span>
          <span className="text-xl font-black text-slate-900 mt-1 flex items-center justify-center gap-1">
            <Users className="w-5 h-5 text-accent" />
            {org.customersServed || 450}+
          </span>
        </div>
        <div className="flex flex-col gap-1 border-r border-slate-200 md:border-r-0">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">
            Average Rating
          </span>
          <span className="text-xl font-black text-slate-900 mt-1 flex items-center justify-center gap-1">
            <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
            {org.rating?.toFixed(1) || '4.8'}
          </span>
        </div>
        <div className="flex flex-col gap-1 col-span-2 md:col-span-1 pt-4 md:pt-0 border-t border-slate-200 md:border-t-0">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">
            Years Active
          </span>
          <span className="text-xl font-black text-slate-900 mt-1 flex items-center justify-center gap-1">
            <Clock className="w-5 h-5 text-accent" />
            {org.yearsActive || 3} Years
          </span>
        </div>
      </section>

      {/* 3. Main Split details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12 items-start">
        
        {/* Left Side: About & Contact details */}
        <div className="flex flex-col gap-8">
          {/* About Column */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col gap-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              About the Host
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed font-normal">
              {org.description || 'Professional travel host offering curated excursions in the mountains, beachfront campouts, and customized wildlife adventures.'}
            </p>
          </div>

          {/* Contact Details Card */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col gap-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Business Contacts
            </h3>
            <div className="flex flex-col gap-3.5 text-xs text-slate-600 font-medium">
              <div className="flex items-center gap-2">
                <Mail className="w-4.5 h-4.5 text-slate-400" />
                <span>{org.email}</span>
              </div>
              {org.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="w-4.5 h-4.5 text-slate-400" />
                  <span>{org.phone}</span>
                </div>
              )}
              {org.website && (
                <div className="flex items-center gap-2">
                  <Globe className="w-4.5 h-4.5 text-slate-400" />
                  <a href={org.website} target="_blank" rel="noreferrer" className="text-accent hover:underline">
                    {org.website.replace('https://', '')}
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Side: Active Trip Listings & Reviews */}
        <div className="col-span-1 lg:col-span-2 flex flex-col gap-10">
          
          {/* Listed Trips */}
          <div className="flex flex-col gap-6">
            <h2 className="text-lg font-bold text-slate-900 uppercase tracking-wider">
              Active Trips Portfolio
            </h2>
            {orgTrips.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {orgTrips.map((trip: Trip) => (
                  <TripCard key={trip.id} trip={trip} />
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic">This organizer has no active published listings right now.</p>
            )}
          </div>

          {/* Customer Feedback */}
          <div className="flex flex-col gap-6">
            <h2 className="text-lg font-bold text-slate-900 uppercase tracking-wider">
              Reviews & Client History
            </h2>
            {orgReviews.length > 0 ? (
              <div className="flex flex-col gap-4">
                {orgReviews.map((rev: Review) => (
                  <ReviewCard key={rev.id} review={rev} />
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic">No reviews logged for this host yet.</p>
            )}
          </div>

        </div>

      </div>

    </div>
  );
}
