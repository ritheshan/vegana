'use client';

import * as React from 'react';
import { useAuthStore } from '../../../store/useAuthStore';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { Landmark, Mail, Phone, Globe, MapPin, CheckCircle2 } from 'lucide-react';

export default function OrganizerSettingsPage() {
  const { user, updateOrganizerProfile } = useAuthStore();

  const [companyName, setCompanyName] = React.useState(user?.companyName || '');
  const [description, setDescription] = React.useState(user?.description || '');
  const [phone, setPhone] = React.useState(user?.phone || '');
  const [website, setWebsite] = React.useState(user?.website || '');
  const [address, setAddress] = React.useState(user?.address || '');
  const [logo, setLogo] = React.useState(user?.avatar || '');
  const [banner, setBanner] = React.useState(user?.banner || '');
  const [isSaving, setIsSaving] = React.useState(false);
  const [success, setSuccess] = React.useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    setTimeout(() => {
      updateOrganizerProfile({
        companyName,
        description,
        phone,
        website,
        address,
        avatar: logo,
        banner
      });

      setIsSaving(false);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    }, 1000);
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in max-w-2xl">
      {/* Header */}
      <div className="flex flex-col gap-1.5 border-b border-slate-200 pb-4">
        <h1 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
          <Landmark className="w-6 h-6 text-accent" />
          Company Profile Settings
        </h1>
        <p className="text-xs text-slate-400 font-medium">
          Edit your travel agency details, company description, contact details, and visual brand assets
        </p>
      </div>

      {success && (
        <div className="bg-teal-50 border border-teal-200 text-teal-900 rounded-xl p-4 flex gap-3 items-center text-xs">
          <CheckCircle2 className="w-5 h-5 text-accent shrink-0" />
          <span className="font-bold">Host profile settings synced successfully!</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSave} className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col gap-5">
        
        {/* Brand Images Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-b border-slate-100 pb-5">
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Company Logo URL</label>
            <Input value={logo} onChange={(e) => setLogo(e.target.value)} required />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Cover Banner URL</label>
            <Input value={banner} onChange={(e) => setBanner(e.target.value)} required />
          </div>
        </div>

        {/* Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Company Legal Name"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            leftIcon={<Landmark className="w-4 h-4 text-slate-400" />}
            required
          />
          <Input
            label="Primary Hotline"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            leftIcon={<Phone className="w-4 h-4 text-slate-400" />}
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Email Address"
            value={user?.email || ''}
            leftIcon={<Mail className="w-4 h-4 text-slate-400" />}
            disabled
          />
          <Input
            label="Official Website"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            leftIcon={<Globe className="w-4 h-4 text-slate-400" />}
            required
          />
        </div>

        <Input
          label="Agency Office Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          leftIcon={<MapPin className="w-4 h-4 text-slate-400" />}
          required
        />

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Company Bio Description
          </label>
          <textarea
            placeholder="Tell explorers who you are, how many years you have been conducting wilderness treks..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-xs outline-none focus:border-accent text-slate-900 placeholder:text-slate-400 min-h-20"
            required
          />
        </div>

        <div className="border-t border-slate-100 pt-4 mt-2 flex justify-end">
          <Button
            type="submit"
            variant="accent"
            isLoading={isSaving}
            className="font-bold px-6 cursor-pointer"
          >
            Save Host Settings
          </Button>
        </div>

      </form>
    </div>
  );
}
