import * as React from 'react';
import Link from 'next/link';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-slate-950 text-white border-t border-slate-900 mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-12 md:py-16 grid grid-cols-1 md:grid-cols-4 gap-10">
        
        {/* Brand Info */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-white text-slate-950 flex items-center justify-center font-black text-lg">
              V
            </div>
            <span className="text-xl font-bold tracking-tight">Vagana</span>
          </div>
          <p className="text-sm text-slate-400 leading-relaxed">
            Premium eco-adventure travel marketplace matching wanderlust explorers with professional, verified local organizers.
          </p>
        </div>

        {/* Explore Links */}
        <div className="flex flex-col gap-3">
          <h4 className="text-xs font-extrabold uppercase tracking-widest text-teal-400">
            Explore
          </h4>
          <ul className="flex flex-col gap-2.5 text-sm text-slate-300">
            <li><Link href="/trips?category=Trekking" className="hover:text-white transition-colors">Mountain Treks</Link></li>
            <li><Link href="/trips?category=Beach" className="hover:text-white transition-colors">Beach Escapes</Link></li>
            <li><Link href="/trips?category=Adventure" className="hover:text-white transition-colors">Extreme Sports</Link></li>
            <li><Link href="/trips?category=Camping" className="hover:text-white transition-colors">Wild Camping</Link></li>
          </ul>
        </div>

        {/* Business Links */}
        <div className="flex flex-col gap-3">
          <h4 className="text-xs font-extrabold uppercase tracking-widest text-teal-400">
            For Organizers
          </h4>
          <ul className="flex flex-col gap-2.5 text-sm text-slate-300">
            <li><Link href="/auth/register" className="hover:text-white transition-colors">Become an Organizer</Link></li>
            <li><Link href="/auth/login" className="hover:text-white transition-colors">Organizer Login</Link></li>
            <li><Link href="/#faq" className="hover:text-white transition-colors">Hosting Guidelines</Link></li>
            <li><Link href="/#fees" className="hover:text-white transition-colors">Pricing & Payouts</Link></li>
          </ul>
        </div>

        {/* Newsletter / Contact */}
        <div className="flex flex-col gap-3">
          <h4 className="text-xs font-extrabold uppercase tracking-widest text-teal-400">
            Subscribe
          </h4>
          <p className="text-sm text-slate-400">
            Get travel deals and seasonal trip alerts sent straight to your inbox.
          </p>
          <div className="flex gap-2 mt-1">
            <input
              type="email"
              placeholder="Email address"
              className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs outline-none focus:border-accent text-white flex-1 min-w-0"
            />
            <button className="bg-teal-500 text-slate-950 font-bold px-3 py-2 rounded-lg text-xs hover:bg-teal-400 transition-colors cursor-pointer">
              Join
            </button>
          </div>
        </div>

      </div>

      <div className="border-t border-slate-900 py-6 text-center text-xs text-slate-500 max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <span>© {new Date().getFullYear()} Vagana Marketplace. All rights reserved.</span>
        <div className="flex gap-6">
          <Link href="/privacy" className="hover:text-slate-300">Privacy Policy</Link>
          <Link href="/terms" className="hover:text-slate-300">Terms of Use</Link>
        </div>
      </div>
    </footer>
  );
};
