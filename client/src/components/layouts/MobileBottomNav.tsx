'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '../../store/useAuthStore';
import { Home, Search, Calendar, Heart, User } from 'lucide-react';

export const MobileBottomNav: React.FC = () => {
  const pathname = usePathname();
  const { role, isAuthenticated } = useAuthStore();

  const getPath = (key: 'bookings' | 'wishlist' | 'profile') => {
    if (!isAuthenticated) return '/auth/login';
    if (key === 'bookings') {
      return role === 'organizer' ? '/organizer/bookings' : '/customer/bookings';
    }
    if (key === 'wishlist') {
      return role === 'organizer' ? '/organizer/trips' : '/customer/wishlist';
    }
    if (key === 'profile') {
      return role === 'organizer' ? '/organizer/settings' : '/customer/settings';
    }
    return '/';
  };

  const navItems = [
    { label: 'Home', path: '/', icon: Home },
    { label: 'Search', path: '/trips', icon: Search },
    { label: 'Bookings', path: getPath('bookings'), icon: Calendar },
    { label: 'Wishlist', path: getPath('wishlist'), icon: Heart },
    { label: 'Profile', path: getPath('profile'), icon: User },
  ];

  const isActive = (path: string) => {
    if (path === '/') return pathname === '/';
    return pathname.startsWith(path);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 md:hidden bg-white border-t border-slate-100 shadow-2xl px-4 py-2 flex items-center justify-around pb-safe">
      {navItems.map((item) => {
        const Icon = item.icon;
        const active = isActive(item.path);
        return (
          <Link
            key={item.label}
            href={item.path}
            className={`flex flex-col items-center gap-1 py-1 px-3 rounded-lg transition-all ${
              active ? 'text-accent' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <Icon className="w-5 h-5" />
            <span className="text-[10px] font-bold tracking-wider uppercase">
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
};
