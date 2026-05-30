'use client';

import * as React from 'react';
import Link from 'next/link';
import { useBookingStore } from '@/store/useBookingStore';
import { useTripStore } from '@/store/useTripStore';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import {
  Shield, Compass, IndianRupee, Calendar, Star, Users,
  Landmark, AlertCircle, ArrowRight, ShieldCheck, CheckCircle2
} from 'lucide-react';

export default function AdminOverviewPage() {
  const { bookings } = useBookingStore();
  const { trips } = useTripStore();

  // Aggregate global stats
  const totalRevenue = React.useMemo(() => {
    return bookings
      .filter(b => b.status === 'confirmed' || b.status === 'completed')
      .reduce((sum, curr) => sum + curr.totalPrice, 0);
  }, [bookings]);

  const stats = [
    { label: 'Active Explorers', val: '1,240', desc: '+15% registrations this month', icon: Users, color: 'text-accent' },
    { label: 'Verified Hosts', val: '24', desc: '3 pending reviews', icon: Landmark, color: 'text-purple-500' },
    { label: 'Total Packages Listed', val: trips.length.toString(), desc: `${trips.filter(t => t.status === 'published').length} active listings`, icon: Compass, color: 'text-blue-500' },
    { label: 'Platform Volume', val: `₹${totalRevenue.toLocaleString('en-IN')}`, desc: `${bookings.length} reservations tracked`, icon: IndianRupee, color: 'text-green-500' }
  ];

  return (
    <div className="flex flex-col gap-8 animate-fade-in">
      
      {/* Welcome Message */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900 leading-tight">
            Administrative Hub Console
          </h1>
          <p className="text-xs text-slate-400 font-medium mt-0.5">
            Audit platform listings, verified host licenses, payments ledgers, and transaction feeds
          </p>
        </div>

        <Link href="/admin/approvals">
          <Button variant="accent" size="sm" className="font-bold flex items-center gap-1.5 cursor-pointer shadow-sm">
            <ShieldCheck className="w-4 h-4" />
            Review Organizer Licenses
          </Button>
        </Link>
      </div>

      {/* Global stats grid */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {stats.map((s, idx) => {
          const Icon = s.icon;
          return (
            <div key={idx} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col gap-2">
              <span className="text-[9px] font-extrabold uppercase tracking-widest text-slate-400 leading-none">
                {s.label}
              </span>
              <span className="text-xl md:text-2xl font-black text-slate-900 mt-1 flex items-center leading-none gap-1.5">
                <Icon className={`w-5 h-5 shrink-0 ${s.color}`} />
                {s.val}
              </span>
              <span className="text-[9px] font-bold text-slate-400 mt-1 leading-none">
                {s.desc}
              </span>
            </div>
          );
        })}
      </section>

      {/* Split details panel */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 items-start">
        
        {/* Left Side: Audit Actions lists */}
        <div className="col-span-1 md:col-span-2 flex flex-col gap-6">
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col gap-4">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-3">
              Core Administrative Directives
            </h3>

            <div className="flex flex-col gap-3.5 text-xs font-semibold text-slate-700">
              
              <div className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
                <div className="flex gap-3 items-center">
                  <div className="w-8 h-8 rounded-lg bg-teal-50 text-accent flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="font-bold text-slate-900">Host License Verifications</span>
                    <span className="text-[10px] text-slate-400 font-medium">3 travel agencies submitted proof documents.</span>
                  </div>
                </div>
                <Link href="/admin/approvals">
                  <Button variant="outline" size="sm" className="font-bold text-[9px] py-1 cursor-pointer">
                    Review Bids
                  </Button>
                </Link>
              </div>

              <div className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
                <div className="flex gap-3 items-center">
                  <div className="w-8 h-8 rounded-lg bg-teal-50 text-accent flex items-center justify-center shrink-0">
                    <Compass className="w-4 h-4" />
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="font-bold text-slate-900">Listings Safety Audits</span>
                    <span className="text-[10px] text-slate-400 font-medium">Review all draft and published outdoor packages.</span>
                  </div>
                </div>
                <Link href="/admin/trips">
                  <Button variant="outline" size="sm" className="font-bold text-[9px] py-1 cursor-pointer">
                    Audit Listings
                  </Button>
                </Link>
              </div>

            </div>
          </div>
        </div>

        {/* Right Side: Platform System Alert panel */}
        <div className="flex flex-col gap-6">
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col gap-4">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-3 flex items-center gap-1.5">
              <AlertCircle className="w-4.5 h-4.5 text-accent" />
              Global System Log Alerts
            </h3>

            <div className="flex flex-col gap-4 text-xs">
              <div className="flex gap-2.5 items-start bg-amber-50/50 border border-amber-100 rounded-lg p-3 text-amber-800">
                <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <div className="flex flex-col gap-0.5">
                  <span className="font-bold">Pending Host Verification</span>
                  <span className="text-[10px] leading-relaxed text-amber-700">Adventure Trails Ltd uploaded their GSTIN license proof.</span>
                </div>
              </div>
              <div className="flex gap-2.5 items-start bg-teal-50/50 border border-teal-100 rounded-lg p-3 text-slate-900">
                <CheckCircle2 className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                <div className="flex flex-col gap-0.5">
                  <span className="font-bold">Backup Safe</span>
                  <span className="text-[10px] leading-relaxed text-slate-500">Platform database automatic backup was completed.</span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
