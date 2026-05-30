'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { RoleSwitcher } from '@/components/common/RoleSwitcher';
import { MobileBottomNav } from '@/components/layouts/MobileBottomNav';
import {
  Compass, Landmark, Calendar, Sparkles, Settings,
  LogOut, ShieldCheck, ChevronRight, PlusCircle, LayoutDashboard
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

export default function OrganizerDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, role, isAuthenticated, logout } = useAuthStore();

  React.useEffect(() => {
    // Session role validation
    if (!isAuthenticated) {
      router.push('/auth/login?redirect=/organizer');
    } else if (role !== 'organizer') {
      // Allow developer bypass, but if it is actually in customer/admin, route appropriately
      // router.push(`/${role}`);
    }
  }, [isAuthenticated, role, router]);

  const navLinks = [
    { label: 'Overview Metrics', path: '/organizer', icon: LayoutDashboard },
    { label: 'Manage Listing Trips', path: '/organizer/trips', icon: Compass },
    { label: 'Create New Trip', path: '/organizer/trips/create', icon: PlusCircle },
    { label: 'Incoming Bookings', path: '/organizer/bookings', icon: Calendar },
    { label: 'Custom Itinerary Requests', path: '/organizer/custom-requests', icon: Sparkles },
    { label: 'Host Settings', path: '/organizer/settings', icon: Settings },
  ];

  const getActiveLabel = () => {
    const active = navLinks.find(link => pathname === link.path);
    return active ? active.label : 'Organizer Host Portal';
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-accent" />
          <span className="text-xs text-slate-400 font-bold">Authenticating Host session...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row pb-16 md:pb-0">
      
      {/* 1. Desktop Left Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-slate-950 text-white p-5 border-r border-slate-900 justify-between h-screen sticky top-0 shrink-0">
        <div className="flex flex-col gap-8">
          
          {/* Logo link */}
          <Link href="/" className="flex items-center gap-2 px-2">
            <div className="w-8 h-8 rounded-lg bg-teal-500 text-slate-950 flex items-center justify-center font-black text-lg">
              V
            </div>
            <span className="text-xl font-bold tracking-tight text-white">Vagana</span>
          </Link>

          {/* Organizer details card */}
          <div className="flex items-center gap-3 px-2 py-3 bg-slate-900 border border-slate-800 rounded-xl">
            <img
              src={user.avatar || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100'}
              alt={user.companyName || user.name}
              className="w-10 h-10 rounded-full object-cover border border-slate-800"
            />
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-bold text-white truncate leading-snug">{user.companyName || user.name}</span>
              <span className="text-[9px] font-bold text-teal-400 uppercase tracking-widest leading-none mt-0.5 flex items-center gap-0.5">
                <ShieldCheck className="w-3 h-3" />
                Verified Host
              </span>
            </div>
          </div>

          {/* Sidebar menu links */}
          <nav className="flex flex-col gap-1.5">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.path;
              return (
                <Link
                  key={link.path}
                  href={link.path}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-teal-500 text-slate-950 font-extrabold shadow-md'
                      : 'hover:bg-slate-900 text-slate-400 hover:text-white'
                  }`}
                >
                  <Icon className="w-4.5 h-4.5 shrink-0" />
                  {link.label}
                </Link>
              );
            })}
          </nav>

        </div>

        {/* Bottom controls */}
        <div className="flex flex-col gap-3">
          <Link href="/">
            <Button variant="outline" className="w-full text-xs border-slate-800 hover:bg-slate-900 text-white font-bold cursor-pointer flex items-center gap-1.5">
              <Compass className="w-4 h-4 text-accent" />
              Public Website
            </Button>
          </Link>
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-bold text-slate-400 hover:text-danger hover:bg-red-500/10 transition-colors cursor-pointer"
          >
            <LogOut className="w-4.5 h-4.5" />
            Log Out
          </button>
        </div>
      </aside>

      {/* 2. Right Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 max-h-screen overflow-y-auto">
        
        {/* Header - Desktop only */}
        <header className="hidden md:flex items-center justify-between px-8 h-16 bg-white border-b border-slate-200">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-bold uppercase tracking-widest">Organizer Console</span>
            <ChevronRight className="w-4.5 h-4.5 text-slate-300" />
            <h2 className="text-sm font-bold text-slate-800 tracking-tight">{getActiveLabel()}</h2>
          </div>

          <div className="flex items-center gap-4">
            <Badge variant="success" className="font-extrabold py-0.5">Platform Payouts Status: ACTIVE</Badge>
          </div>
        </header>

        {/* Content body wrapper */}
        <main className="flex-1 p-6 md:p-8 max-w-5xl w-full mx-auto flex flex-col gap-8">
          {children}
        </main>

      </div>

      {/* Floating Developer Persona Switcher & Mobile Bottom Navigation */}
      <MobileBottomNav />
      <RoleSwitcher />

    </div>
  );
}
