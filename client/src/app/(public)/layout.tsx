'use client';

import * as React from 'react';
import { Navbar } from '../../components/layouts/Navbar';
import { Footer } from '../../components/layouts/Footer';
import { MobileBottomNav } from '../../components/layouts/MobileBottomNav';
import { RoleSwitcher } from '../../components/common/RoleSwitcher';

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Platform Navigation */}
      <Navbar />

      {/* Main Screen Content */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-6 py-6 pb-24 md:pb-12">
        {children}
      </main>

      {/* Responsive Bottom Mobile Menu */}
      <MobileBottomNav />

      {/* Shared Platform Footer */}
      <Footer />

      {/* Floating Developer Persona Switcher */}
      <RoleSwitcher />
    </div>
  );
}
