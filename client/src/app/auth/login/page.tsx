'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from '../../../store/useAuthStore';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';
import { ShieldCheck, Mail, Lock, Sparkles, Compass } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, isAuthenticated, role } = useAuthStore();

  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const redirectUrl = searchParams.get('redirect') || '';

  React.useEffect(() => {
    // If already logged in, send to dashboard
    if (isAuthenticated) {
      router.push(redirectUrl || `/${role}`);
    }
  }, [isAuthenticated, role, router, redirectUrl]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Please provide a valid email');
      return;
    }
    setError('');
    setLoading(true);

    setTimeout(() => {
      login(email, password);
      setLoading(false);
      router.push(redirectUrl || (email.includes('org') ? '/organizer' : '/customer'));
    }, 1000);
  };

  const handleQuickLogin = (type: 'customer' | 'organizer') => {
    setLoading(true);
    setTimeout(() => {
      if (type === 'organizer') {
        login('contact@adventurenest.com');
        router.push('/organizer');
      } else {
        login('rithish@example.com');
        router.push(redirectUrl || '/customer');
      }
      setLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background patterns */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-teal-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-slate-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30" />

      <div className="relative z-10 w-full max-w-md bg-white rounded-2xl border border-slate-200 shadow-2xl p-8 flex flex-col gap-6">
        
        {/* Brand Header */}
        <div className="text-center flex flex-col items-center gap-2">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-xl bg-slate-950 text-white flex items-center justify-center font-black text-xl">
              V
            </div>
            <span className="text-2xl font-black tracking-tight text-slate-950">Vagana</span>
          </Link>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
            Access Your Portal Account
          </span>
        </div>

        {/* Regular Login Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            type="email"
            label="Email Address"
            placeholder="name@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            leftIcon={<Mail className="w-4 h-4 text-slate-400" />}
            error={error}
          />
          
          <Input
            type="password"
            label="Password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            leftIcon={<Lock className="w-4 h-4 text-slate-400" />}
          />

          <div className="flex items-center justify-between text-xs font-semibold mt-1">
            <label className="flex items-center gap-1.5 text-slate-500 cursor-pointer">
              <input type="checkbox" className="rounded text-accent focus:ring-accent border-slate-300" />
              Remember me
            </label>
            <Link href="#" className="text-accent hover:underline">
              Forgot Password?
            </Link>
          </div>

          <Button
            type="submit"
            variant="primary"
            isLoading={loading}
            className="w-full font-bold py-3 mt-2 cursor-pointer"
          >
            Sign In
          </Button>
        </form>

        {/* Google OAuth Simulation */}
        <div className="relative flex py-2 items-center">
          <div className="flex-grow border-t border-slate-200" />
          <span className="flex-shrink mx-4 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Or Continue With
          </span>
          <div className="flex-grow border-t border-slate-200" />
        </div>

        <button
          onClick={() => handleQuickLogin('customer')}
          className="w-full bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg py-2.5 px-4 text-xs font-bold text-slate-700 flex items-center justify-center gap-2 shadow-sm transition-all active:scale-98 cursor-pointer"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#EA4335"
              d="M12 5.04c1.62 0 3.08.56 4.22 1.66l3.15-3.15C17.45 1.74 14.93 1 12 1 7.35 1 3.4 3.65 1.5 7.5l3.9 3C6.35 7.54 8.95 5.04 12 5.04z"
            />
            <path
              fill="#4285F4"
              d="M23.5 12.25c0-.82-.07-1.6-.2-2.35H12v4.5h6.48c-.28 1.48-1.12 2.73-2.38 3.58l3.7 2.88c2.16-2 3.7-4.95 3.7-8.61z"
            />
            <path
              fill="#FBBC05"
              d="M5.4 14.5c-.25-.75-.4-1.55-.4-2.5s.15-1.75.4-2.5L1.5 6.5C.55 8.2 0 10.05 0 12s.55 3.8 1.5 5.5l3.9-3z"
            />
            <path
              fill="#34A853"
              d="M12 23c3.24 0 5.97-1.07 7.96-2.91l-3.7-2.88c-1.03.69-2.35 1.1-4.26 1.1-3.05 0-5.65-2.5-6.6-5.46l-3.9 3C3.4 20.35 7.35 23 12 23z"
            />
          </svg>
          Google Login (Mock)
        </button>

        {/* Demo Fast Login Shortcuts */}
        <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 flex flex-col gap-2.5">
          <span className="text-[9px] font-extrabold uppercase tracking-widest text-slate-500 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-accent" />
            MVP Quick Demo Bypass
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleQuickLogin('customer')}
              className="bg-white border border-slate-200 hover:border-accent text-slate-700 hover:text-accent rounded-lg py-2 text-[10px] font-bold shadow-sm transition-all active:scale-95 cursor-pointer"
            >
              Log Customer
            </button>
            <button
              onClick={() => handleQuickLogin('organizer')}
              className="bg-white border border-slate-200 hover:border-accent text-slate-700 hover:text-accent rounded-lg py-2 text-[10px] font-bold shadow-sm transition-all active:scale-95 cursor-pointer"
            >
              Log Organizer
            </button>
          </div>
        </div>

        {/* Register Guide */}
        <span className="text-xs text-center text-slate-500 font-medium">
          Don't have an account?{' '}
          <Link href="/auth/register" className="text-accent hover:underline font-bold">
            Create Account
          </Link>
        </span>

      </div>
    </div>
  );
}
