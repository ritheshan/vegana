'use client';

import * as React from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { useRouter } from 'next/navigation';
import { Layers, Shield, User, Landmark, Compass, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const RoleSwitcher: React.FC = () => {
  const { role, setRole } = useAuthStore();
  const router = useRouter();
  const [isOpen, setIsOpen] = React.useState(false);

  const roles = [
    { name: 'Visitor', value: 'visitor', desc: 'Browse Trips & Profiles', icon: Compass, path: '/' },
    { name: 'Customer', value: 'customer', desc: 'Bookings & Custom Itinerary', icon: User, path: '/customer' },
    { name: 'Organizer', value: 'organizer', desc: 'Publish Trips & Manage Bids', icon: Landmark, path: '/organizer' },
    { name: 'Admin Portal', value: 'admin', desc: 'Verification & User Audits', icon: Shield, path: '/admin' }
  ] as const;

  const handleRoleSelect = (selectedRole: typeof roles[number]) => {
    setRole(selectedRole.value);
    setIsOpen(false);
    router.push(selectedRole.path);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className="absolute bottom-16 right-0 w-72 bg-slate-900 text-white rounded-xl shadow-2xl overflow-hidden border border-slate-800 p-2 flex flex-col gap-1"
          >
            <div className="px-3 py-2 border-b border-slate-800">
              <span className="text-[10px] font-bold text-teal-400 uppercase tracking-widest">
                Developer Preview Mode
              </span>
              <h4 className="text-xs font-semibold text-slate-300 mt-0.5">
                Switch Portal Personas
              </h4>
            </div>

            {roles.map((r) => {
              const Icon = r.icon;
              const isActive = role === r.value;
              return (
                <button
                  key={r.value}
                  onClick={() => handleRoleSelect(r)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-left ${
                    isActive
                      ? 'bg-teal-500 text-slate-950 font-medium'
                      : 'hover:bg-slate-800 text-slate-300 hover:text-white'
                  } cursor-pointer`}
                >
                  <div className={`p-1.5 rounded-md ${isActive ? 'bg-slate-950/20' : 'bg-slate-800'}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold flex items-center justify-between">
                      {r.name}
                      {isActive && <Check className="w-3.5 h-3.5 text-slate-950" />}
                    </div>
                    <div className={`text-[10px] truncate ${isActive ? 'text-slate-900/80' : 'text-slate-500'}`}>
                      {r.desc}
                    </div>
                  </div>
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-slate-950 text-white border border-slate-800 rounded-full px-4 py-3 shadow-xl hover:bg-slate-900 transition-all cursor-pointer group"
      >
        <Layers className={`w-5 h-5 ${isOpen ? 'text-teal-400 rotate-90' : 'text-slate-400'} transition-transform duration-300`} />
        <span className="text-xs font-bold tracking-tight">
          Role: <span className="text-teal-400 capitalize">{role}</span>
        </span>
      </motion.button>
    </div>
  );
};
