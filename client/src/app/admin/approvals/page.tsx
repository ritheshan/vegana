'use client';

import * as React from 'react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Dialog } from '@/components/ui/Dialog';
import {
  ShieldCheck, FileText, CheckCircle2, XCircle, AlertCircle,
  Eye, Landmark, Mail, Clock, ShieldAlert, Sparkles
} from 'lucide-react';

export default function AdminApprovalsPage() {
  // Mock data of pending organizers awaiting verification approval
  const [pendingHosts, setPendingHosts] = React.useState([
    {
      id: 'org-pending-1',
      name: 'Wanderlust Explorers',
      email: 'verify@wanderlustexplorers.in',
      phone: '+91 99887 76655',
      address: 'Indiranagar, Bangalore, Karnataka',
      documents: ['GSTIN Certificate', 'IMF Mountaineering Guide Certificate'],
      status: 'pending',
      submittedAt: '2026-05-29'
    },
    {
      id: 'org-pending-2',
      name: 'Malnad Adventures',
      email: 'host@malnadadventures.com',
      phone: '+91 88776 65544',
      address: 'Chikmagalur, Karnataka',
      documents: ['GSTIN Certificate', 'Resort Lease Agreement'],
      status: 'pending',
      submittedAt: '2026-05-28'
    }
  ]);

  const [activeHostId, setActiveHostId] = React.useState<string | null>(null);
  const [alertText, setAlertText] = React.useState('');

  const activeHost = pendingHosts.find(h => h.id === activeHostId);

  const handleApproval = (id: string, action: 'approve' | 'reject') => {
    const host = pendingHosts.find(h => h.id === id);
    if (!host) return;

    if (action === 'approve') {
      setAlertText(`Host "${host.name}" has been fully APPROVED! Verification badges are live.`);
    } else {
      setAlertText(`Host "${host.name}" application was rejected. Re-upload directions sent.`);
    }

    setPendingHosts(pendingHosts.filter(h => h.id !== id));
    setActiveHostId(null);
    setTimeout(() => setAlertText(''), 4000);
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      
      {/* Dynamic Success/Fail Notification */}
      {alertText && (
        <div className="bg-teal-50 border border-teal-200 text-teal-900 rounded-xl p-4 flex items-center justify-between gap-3 text-xs">
          <div className="flex gap-2.5 items-center">
            <Sparkles className="w-5 h-5 text-accent shrink-0 animate-spin" />
            <span className="font-bold">{alertText}</span>
          </div>
          <button onClick={() => setAlertText('')} className="text-slate-400 hover:text-slate-600 font-bold shrink-0 cursor-pointer">
            Dismiss
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col gap-1.5 border-b border-slate-200 pb-4">
        <h1 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
          <ShieldCheck className="w-6 h-6 text-accent" />
          Pending Host Approvals
        </h1>
        <p className="text-xs text-slate-400 font-medium">
          Audit agency legal documents, verify mountaineering permits, and grant platform hosting licenses
        </p>
      </div>

      {/* Listings */}
      <div className="flex flex-col gap-4">
        {pendingHosts.length > 0 ? (
          pendingHosts.map((host) => (
            <div
              key={host.id}
              className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-5 hover:border-slate-300 transition-colors animate-fade-in"
            >
              
              {/* Profile indicators */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-200 text-slate-500 flex items-center justify-center shrink-0">
                  <Landmark className="w-6 h-6" />
                </div>
                <div className="flex flex-col gap-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant="warning" className="font-bold text-[9px] uppercase">Awaiting Verification</Badge>
                    <span className="text-[10px] text-slate-400 font-bold">Sub: {host.submittedAt}</span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 leading-snug truncate">{host.name}</h4>
                  <div className="flex flex-wrap items-center gap-3 text-[10px] text-slate-500 font-medium">
                    <span>Contact: {host.phone}</span>
                    <span>•</span>
                    <span>Docs: {host.documents.length} Uploaded</span>
                  </div>
                </div>
              </div>

              {/* Action triggers */}
              <div className="flex items-center gap-2 self-stretch md:self-auto justify-end border-t md:border-t-0 pt-4 md:pt-0 border-slate-100">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setActiveHostId(host.id)}
                  className="font-bold text-[9px] py-1.5 cursor-pointer flex items-center gap-1"
                >
                  <Eye className="w-3.5 h-3.5 text-slate-400" />
                  Review Docs
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleApproval(host.id, 'reject')}
                  className="font-bold text-[9px] text-danger hover:bg-red-50 py-1.5 cursor-pointer"
                >
                  Reject
                </Button>
                <Button
                  variant="accent"
                  size="sm"
                  onClick={() => handleApproval(host.id, 'approve')}
                  className="font-bold text-[9px] py-1.5 cursor-pointer"
                >
                  Approve Host
                </Button>
              </div>

            </div>
          ))
        ) : (
          /* Empty indicator */
          <div className="bg-white border border-slate-200 border-dashed rounded-xl p-12 text-center flex flex-col items-center justify-center gap-3">
            <CheckCircle2 className="w-10 h-10 text-slate-300" />
            <div className="flex flex-col gap-0.5">
              <h3 className="text-xs font-bold text-slate-800">Verification Queue Clear</h3>
              <p className="text-[10px] text-slate-400 max-w-xs leading-normal">
                Excellent! There are no travel organizer registration requests pending approval at this time.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Review Documents Modal Dialog */}
      <Dialog
        isOpen={!!activeHostId}
        onClose={() => setActiveHostId(null)}
        title="Host Credentials Audit"
        size="md"
      >
        {activeHost && (
          <div className="flex flex-col gap-5 text-slate-800 animate-fade-in">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="text-xs font-bold text-slate-400">Host reference ID: {activeHost.id}</span>
              <Badge variant="warning" className="font-bold text-[9px]">DOCUMENTS AUDIT</Badge>
            </div>

            {/* Profile fields */}
            <div className="grid grid-cols-2 gap-4 text-xs font-medium text-slate-600 bg-slate-50 border border-slate-200 rounded-xl p-4">
              <div className="flex flex-col">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none">Agency Name</span>
                <span className="text-slate-900 mt-1 font-bold">{activeHost.name}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none">Support Contact</span>
                <span className="text-slate-900 mt-1 font-bold">{activeHost.email}</span>
              </div>
              <div className="flex flex-col col-span-2">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none">Business Address</span>
                <span className="text-slate-900 mt-1 font-bold">{activeHost.address}</span>
              </div>
            </div>

            {/* Uploaded Documents checklist */}
            <div className="flex flex-col gap-3">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                Uploaded Verified PDFs:
              </span>
              
              <div className="flex flex-col gap-2">
                {activeHost.documents.map((doc, idx) => (
                  <div key={idx} className="bg-white border border-slate-200 rounded-lg p-3.5 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4.5 h-4.5 text-slate-400 shrink-0" />
                      <span className="font-bold text-slate-800">{doc}</span>
                    </div>
                    <Badge variant="accent" className="font-bold text-[9px] flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 fill-teal-50" />
                      Valid PDF Signature
                    </Badge>
                  </div>
                ))}
              </div>
            </div>

            {/* Decision operations */}
            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 mt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleApproval(activeHost.id, 'reject')}
                className="font-bold text-[10px] text-danger hover:bg-red-50 py-1.5 cursor-pointer"
              >
                Reject Credentials
              </Button>
              <Button
                variant="accent"
                size="sm"
                onClick={() => handleApproval(activeHost.id, 'approve')}
                className="font-bold text-[10px] py-1.5 cursor-pointer flex items-center gap-1"
              >
                Approve Host License
              </Button>
            </div>

          </div>
        )}
      </Dialog>

    </div>
  );
}
