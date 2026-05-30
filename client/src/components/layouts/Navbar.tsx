'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '../../store/useAuthStore';
import { Compass, User, Landmark, Shield, LogOut, MessageSquare, Menu, X } from 'lucide-react';
import { Button } from '../ui/Button';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const { user, role, logout } = useAuthStore();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const navLinks = [
    { label: 'Explore Trips', path: '/trips' },
    { label: 'Organizers', path: '/#organizers' },
    { label: 'Custom Trips', path: '/customer/custom-requests' },
  ];

  const getDashboardPath = () => {
    if (role === 'customer') return '/customer';
    if (role === 'organizer') return '/organizer';
    if (role === 'admin') return '/admin';
    return '/';
  };

  const isActive = (path: string) => pathname === path;

  return (
    <header className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-md border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center font-black text-lg transition-transform group-hover:scale-105">
            V
          </div>
          <span className="text-xl font-extrabold tracking-tight text-slate-900">
            Vagana
          </span>
        </Link>

        {/* Desktop Links */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              href={link.path}
              className={`text-sm font-medium transition-colors hover:text-slate-900 ${
                isActive(link.path) ? 'text-accent border-b-2 border-accent pb-1' : 'text-slate-500'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Auth controls */}
        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-3">
              {/* Chat Quick Link */}
              <Link href={`${role === 'organizer' ? '/organizer/custom-requests' : '/customer/custom-requests'}`}>
                <button className="text-slate-500 hover:text-slate-950 p-2 rounded-lg hover:bg-slate-50 relative cursor-pointer">
                  <MessageSquare className="w-5 h-5" />
                  <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-accent rounded-full border-2 border-white animate-pulse" />
                </button>
              </Link>

              <Link href={getDashboardPath()}>
                <Button variant="outline" size="sm" className="flex items-center gap-1.5 cursor-pointer">
                  {role === 'customer' && <User className="w-4 h-4 text-accent" />}
                  {role === 'organizer' && <Landmark className="w-4 h-4 text-accent" />}
                  {role === 'admin' && <Shield className="w-4 h-4 text-accent" />}
                  <span className="font-bold">My Dashboard</span>
                </Button>
              </Link>

              <button
                onClick={logout}
                className="text-slate-400 hover:text-danger p-2 rounded-lg hover:bg-slate-50 transition-all cursor-pointer"
                title="Log Out"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/auth/login">
                <Button variant="ghost" size="sm" className="cursor-pointer">Login</Button>
              </Link>
              <Link href="/auth/register">
                <Button variant="primary" size="sm" className="cursor-pointer">Become Organizer</Button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile menu trigger */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-50 cursor-pointer"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white px-6 py-4 flex flex-col gap-4 animate-fade-in absolute w-full left-0 top-16 shadow-xl">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              href={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm font-semibold text-slate-700 hover:text-slate-900 py-2 border-b border-slate-50"
            >
              {link.label}
            </Link>
          ))}
          {user ? (
            <div className="flex flex-col gap-2 pt-2 border-t border-slate-100">
              <Link href={getDashboardPath()} onClick={() => setMobileMenuOpen(false)}>
                <Button variant="outline" className="w-full justify-start cursor-pointer">
                  Dashboard
                </Button>
              </Link>
              <Button variant="primary" onClick={() => { logout(); setMobileMenuOpen(false); }} className="w-full cursor-pointer">
                Logout
              </Button>
            </div>
          ) : (
            <div className="flex flex-col gap-2 pt-2 border-t border-slate-100">
              <Link href="/auth/login" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="outline" className="w-full cursor-pointer">Login</Button>
              </Link>
              <Link href="/auth/register" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="primary" className="w-full cursor-pointer">Sign Up</Button>
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
