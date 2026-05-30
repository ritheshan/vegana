'use client';

import * as React from 'react';
import { MOCK_USERS } from '@/constants';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Users, Landmark, Search, ShieldAlert, Sparkles } from 'lucide-react';

export default function AdminUsersPage() {
  const [usersList, setUsersList] = React.useState([
    { id: 'u1', name: 'Rithish N', email: 'rithish@example.com', role: 'customer', status: 'active', joined: '2026-05-10' },
    { id: 'u2', name: 'Adventure Nest', email: 'contact@adventurenest.com', role: 'organizer', status: 'active', joined: '2026-05-12' },
    { id: 'u3', name: 'Himalayan Trails', email: 'trek@himalayantrails.com', role: 'organizer', status: 'active', joined: '2026-05-15' },
    { id: 'u4', name: 'Coastal Escapes', email: 'coastal@escapes.in', role: 'organizer', status: 'suspended', joined: '2026-05-01' }
  ]);

  const toggleUserStatus = (id: string) => {
    setUsersList(usersList.map(u => {
      if (u.id === id) {
        return { ...u, status: u.status === 'active' ? 'suspended' : 'active' };
      }
      return u;
    }));
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      
      {/* Header */}
      <div className="flex flex-col gap-1.5 border-b border-slate-200 pb-4">
        <h1 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
          <Users className="w-6 h-6 text-accent" />
          Global User Directory
        </h1>
        <p className="text-xs text-slate-400 font-medium">
          Audit customer profiles, freeze suspended agency accounts, or view registrations history
        </p>
      </div>

      {/* Directory Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Platform Accounts Register</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50/50 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-100">
                <th className="p-4">Name / ID</th>
                <th className="p-4">Contact Email</th>
                <th className="p-4">Role Tag</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {usersList.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="p-4">
                    <div className="flex flex-col gap-0.5">
                      <span className="font-bold text-slate-900">{user.name}</span>
                      <span className="text-[9px] text-slate-400">ID: {user.id} • Joined: {user.joined}</span>
                    </div>
                  </td>
                  <td className="p-4">{user.email}</td>
                  <td className="p-4">
                    <Badge variant={user.role === 'organizer' ? 'accent' : 'secondary'} className="font-bold uppercase text-[9px]">
                      {user.role}
                    </Badge>
                  </td>
                  <td className="p-4">
                    <Badge variant={user.status === 'active' ? 'success' : 'danger'} className="font-bold uppercase text-[9px]">
                      {user.status}
                    </Badge>
                  </td>
                  <td className="p-4 text-right">
                    <Button
                      variant={user.status === 'active' ? 'outline' : 'accent'}
                      size="sm"
                      onClick={() => toggleUserStatus(user.id)}
                      className="font-bold text-[9px] py-1 cursor-pointer"
                    >
                      {user.status === 'active' ? 'Suspend Account' : 'Reactivate'}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
