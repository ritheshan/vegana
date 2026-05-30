'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../../../store/useAuthStore';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';
import { Mail, Lock, User, Landmark, Compass, Sparkles } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const { login } = useAuthStore();

  const [roleSelection, setRoleSelection] = React.useState<'customer' | 'organizer'>('customer');
  const [name, setName] = React.useState('');
  const [companyName, setCompanyName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setError('Please fill in all standard fields');
      return;
    }
    if (roleSelection === 'organizer' && !companyName) {
      setError('Please provide your travel agency or host name');
      return;
    }
    setError('');
    setLoading(true);

    setTimeout(() => {
      // Simulate registering & instant login
      login(email, password);
      setLoading(false);
      if (roleSelection === 'organizer') {
        router.push('/organizer');
      } else {
        router.push('/customer');
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-teal-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-slate-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30" />

      <div className="relative z-10 w-full max-w-lg bg-white rounded-2xl border border-slate-200 shadow-2xl p-8 flex flex-col gap-6">
        
        {/* Brand Header */}
        <div className="text-center flex flex-col items-center gap-1">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-xl bg-slate-950 text-white flex items-center justify-center font-black text-xl">
              V
            </div>
            <span className="text-2xl font-black tracking-tight text-slate-950">Vagana</span>
          </Link>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
            Create Your Marketplace Account
          </span>
        </div>

        {/* Dynamic Selector between Explorer or Host */}
        <div className="grid grid-cols-2 gap-3 bg-slate-50 border border-slate-200 rounded-xl p-1.5">
          <button
            type="button"
            onClick={() => setRoleSelection('customer')}
            className={`flex items-center justify-center gap-2 py-3.5 px-3 rounded-lg text-xs font-bold transition-all ${
              roleSelection === 'customer'
                ? 'bg-white text-slate-950 shadow-md border border-slate-200'
                : 'text-slate-400 hover:text-slate-700'
            } cursor-pointer`}
          >
            <Compass className="w-4.5 h-4.5" />
            Explorer Account
          </button>
          <button
            type="button"
            onClick={() => setRoleSelection('organizer')}
            className={`flex items-center justify-center gap-2 py-3.5 px-3 rounded-lg text-xs font-bold transition-all ${
              roleSelection === 'organizer'
                ? 'bg-white text-slate-950 shadow-md border border-slate-200'
                : 'text-slate-400 hover:text-slate-700'
            } cursor-pointer`}
          >
            <Landmark className="w-4.5 h-4.5" />
            Become Host / Org
          </button>
        </div>

        {error && <span className="text-xs text-danger font-semibold text-center">{error}</span>}

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              type="text"
              label="Full Name"
              placeholder="e.g. John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              leftIcon={<User className="w-4 h-4 text-slate-400" />}
            />
            {roleSelection === 'organizer' ? (
              <Input
                type="text"
                label="Company/Host Name"
                placeholder="e.g. Western Ghats Trails"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                leftIcon={<Landmark className="w-4 h-4 text-slate-400" />}
              />
            ) : (
              <Input
                type="text"
                label="Explore Vibe Profile"
                placeholder="e.g. Solo Hiker, Trekker"
              />
            )}
          </div>

          <Input
            type="email"
            label="Email Address"
            placeholder="name@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            leftIcon={<Mail className="w-4 h-4 text-slate-400" />}
          />

          <Input
            type="password"
            label="Create Secure Password"
            placeholder="Min 8 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            leftIcon={<Lock className="w-4 h-4 text-slate-400" />}
          />

          {roleSelection === 'organizer' && (
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 flex gap-3 text-xs leading-relaxed text-slate-500 font-medium">
              <Sparkles className="w-5 h-5 text-accent shrink-0 mt-0.5" />
              <div className="flex flex-col">
                <span className="font-bold text-slate-700">Verification Steps Notice:</span>
                <span>As a trip organizer, your account starts under review. To publish listings, submit documents (e.g. GSTIN, Trek guides) in the Admin verification tab!</span>
              </div>
            </div>
          )}

          <Button
            type="submit"
            variant="primary"
            isLoading={loading}
            className="w-full font-bold py-3 mt-2 cursor-pointer"
          >
            Create Free Account
          </Button>
        </form>

        <span className="text-xs text-center text-slate-500 font-medium">
          Already have an account?{' '}
          <Link href="/auth/login" className="text-accent hover:underline font-bold">
            Sign In
          </Link>
        </span>

      </div>
    </div>
  );
}
