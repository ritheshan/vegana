'use client';

import * as React from 'react';
import { useAuthStore } from '../../../store/useAuthStore';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { User, Mail, Phone, MapPin, Sparkles, CheckCircle2 } from 'lucide-react';

export default function CustomerSettingsPage() {
  const { user } = useAuthStore();

  const [name, setName] = React.useState(user?.name || '');
  const [email, setEmail] = React.useState(user?.email || '');
  const [phone, setPhone] = React.useState('+91 99999 88888');
  const [location, setLocation] = React.useState('Bangalore, Karnataka');
  const [isSaving, setIsSaving] = React.useState(false);
  const [savedSuccess, setSavedSuccess] = React.useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    }, 1000);
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in max-w-2xl">
      {/* Header */}
      <div className="flex flex-col gap-1.5 border-b border-slate-200 pb-4">
        <h1 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
          <User className="w-6 h-6 text-accent" />
          Explorer Profile Settings
        </h1>
        <p className="text-xs text-slate-400 font-medium">
          Update your public explorer credentials, contact options, or account setups
        </p>
      </div>

      {savedSuccess && (
        <div className="bg-teal-50 border border-teal-200 text-teal-900 rounded-xl p-4 flex gap-3 items-center text-xs">
          <CheckCircle2 className="w-5 h-5 text-accent shrink-0" />
          <span className="font-bold">Profile updates saved successfully!</span>
        </div>
      )}

      {/* Profile Form */}
      <form onSubmit={handleSave} className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col gap-5">
        
        {/* Profile Picture */}
        <div className="flex items-center gap-4 border-b border-slate-100 pb-5">
          <img
            src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
            alt={name}
            className="w-16 h-16 rounded-full object-cover border border-slate-200"
          />
          <div className="flex flex-col gap-1.5">
            <span className="text-xs font-bold text-slate-800">Explorer Avatar Image</span>
            <div className="flex gap-2">
              <Button type="button" variant="outline" size="sm" className="font-bold text-[10px] py-1 cursor-pointer">
                Upload New
              </Button>
              <Button type="button" variant="ghost" size="sm" className="font-bold text-[10px] text-danger hover:bg-red-50 py-1 cursor-pointer">
                Remove
              </Button>
            </div>
          </div>
        </div>

        {/* Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Display Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            leftIcon={<User className="w-4 h-4 text-slate-400" />}
            required
          />
          <Input
            label="Phone Contact"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            leftIcon={<Phone className="w-4 h-4 text-slate-400" />}
            required
          />
        </div>

        <Input
          label="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          leftIcon={<Mail className="w-4 h-4 text-slate-400" />}
          disabled
          helperText="Contact system support to change primary log email"
        />

        <Input
          label="Base Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          leftIcon={<MapPin className="w-4 h-4 text-slate-400" />}
          required
        />

        <div className="border-t border-slate-100 pt-4 mt-2 flex justify-end">
          <Button
            type="submit"
            variant="accent"
            isLoading={isSaving}
            className="font-bold cursor-pointer px-6"
          >
            Save Profile Updates
          </Button>
        </div>

      </form>
    </div>
  );
}
