'use client';

import * as React from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useCustomTripStore } from '../../../store/useCustomTripStore';
import { useAuthStore } from '../../../store/useAuthStore';
import { useChatStore } from '../../../store/useChatStore';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { Dialog } from '../../../components/ui/Dialog';
import {
  Sparkles, Compass, Users, Calendar, IndianRupee, Send,
  MessageCircle, FileText, CheckCircle2, ChevronRight, XCircle
} from 'lucide-react';

export default function OrganizerCustomRequestsPage() {
  return (
    <React.Suspense fallback={
      <div className="py-20 text-center flex flex-col items-center justify-center gap-3">
        <div className="w-10 h-10 border-4 border-t-accent border-slate-200 rounded-full animate-spin" />
        <p className="text-xs text-slate-400 font-bold">Loading Itinerary Proposals Center...</p>
      </div>
    }>
      <OrganizerCustomRequestsContent />
    </React.Suspense>
  );
}

function OrganizerCustomRequestsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const { requests, addProposal } = useCustomTripStore();
  const { user } = useAuthStore();

  // Chat Store integration
  const {
    conversations, activeConversationId, messages, isTyping,
    setActiveConversationId, sendMessage, createConversation
  } = useChatStore();

  const [activeTab, setActiveTab] = React.useState<'requests' | 'chat'>('requests');
  const [chatMessageText, setChatMessageText] = React.useState('');

  // Bid form state
  const [activeRequestId, setActiveRequestId] = React.useState<string | null>(null);
  const [bidPrice, setBidPrice] = React.useState(12000);
  const [bidItinerary, setBidItinerary] = React.useState('');
  const [bidDates, setBidDates] = React.useState('');
  const [isSendingBid, setIsSendingBid] = React.useState(false);

  React.useEffect(() => {
    const chatParam = searchParams.get('active_chat');
    if (chatParam) {
      setActiveConversationId(chatParam);
      setActiveTab('chat');
    }
  }, [searchParams]);

  const handleSubmitBid = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeRequestId || !bidItinerary || !bidDates) return;
    setIsSendingBid(true);

    setTimeout(() => {
      addProposal(activeRequestId, {
        id: `prop-${Date.now()}`,
        organizerId: 'user-org-1',
        organizerName: 'Adventure Nest',
        organizerLogo: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150',
        price: bidPrice,
        itineraryDescription: bidItinerary,
        travelDates: bidDates,
        status: 'pending'
      });

      // Clear Form
      setIsSendingBid(false);
      setActiveRequestId(null);
      setBidItinerary('');
      setBidDates('');
    }, 1200);
  };

  const handleStartChatWithClient = (clientId: string, clientName: string) => {
    const conversationId = createConversation(
      clientId,
      clientName,
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100',
      'customer'
    );
    router.push(`/organizer/custom-requests?active_chat=${conversationId}`);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessageText.trim() || !activeConversationId) return;

    const conv = conversations.find(c => c.id === activeConversationId);
    if (!conv) return;

    sendMessage(
      activeConversationId,
      chatMessageText,
      'user-org-1', // Organizer ID
      conv.participantId
    );
    setChatMessageText('');
  };

  const activeMessages = activeConversationId ? messages[activeConversationId] || [] : [];
  const activeConversation = conversations.find(c => c.id === activeConversationId);

  const getRequestStatusBadge = (status: typeof requests[number]['status']) => {
    switch (status) {
      case 'open': return <Badge variant="outline" className="font-bold text-[9px]">Explorer Awaiting Bids</Badge>;
      case 'responded': return <Badge variant="primary" className="font-bold text-[9px]">Proposals Submitted</Badge>;
      case 'accepted': return <Badge variant="success" className="font-bold text-[9px]">Accepted / Booked</Badge>;
      case 'rejected': return <Badge variant="danger" className="font-bold text-[9px]">Declined</Badge>;
    }
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-accent" />
            Explorer Itinerary Requests & Chat Hub
          </h1>
          <p className="text-xs text-slate-400 font-medium">
            Review customized group requests, submit customized quote proposals, and chat live
          </p>
        </div>

        {/* View Switcher */}
        <div className="flex bg-slate-100 p-1 border border-slate-200 rounded-xl shrink-0 self-stretch md:self-auto">
          <button
            onClick={() => setActiveTab('requests')}
            className={`flex-1 md:flex-none px-4 py-2 text-xs font-bold rounded-lg transition-all ${
              activeTab === 'requests' ? 'bg-white text-slate-950 shadow-sm' : 'text-slate-500'
            } cursor-pointer`}
          >
            Custom Client Bids ({requests.length})
          </button>
          <button
            onClick={() => setActiveTab('chat')}
            className={`flex-1 md:flex-none px-4 py-2 text-xs font-bold rounded-lg transition-all ${
              activeTab === 'chat' ? 'bg-white text-slate-950 shadow-sm' : 'text-slate-500'
            } cursor-pointer`}
          >
            Live Client Chat
          </button>
        </div>
      </div>

      {/* Main Splits Panel */}
      {activeTab === 'requests' ? (
        <div className="flex flex-col gap-6">
          
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            Available Customer Itinerary Requests
          </h3>

          <div className="grid grid-cols-1 gap-6">
            {requests.map((req) => {
              const myProposal = req.proposals.find(p => p.organizerId === 'user-org-1');
              return (
                <div key={req.id} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col gap-4">
                  
                  {/* Title & Status */}
                  <div className="flex justify-between items-start border-b border-slate-100 pb-3">
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 leading-tight">
                        Custom {req.tripType} to {req.destination}
                      </h4>
                      <span className="text-[10px] text-slate-400">Explorer: {req.customerName}</span>
                    </div>
                    {getRequestStatusBadge(req.status)}
                  </div>

                  {/* Requirements Specs Table */}
                  <div className="grid grid-cols-3 gap-2 bg-slate-50 border border-slate-200 rounded-lg p-3 text-[10px] text-slate-600 font-bold">
                    <div className="flex flex-col">
                      <span className="text-[8px] text-slate-400 uppercase tracking-widest leading-none">Dates Requested</span>
                      <span className="text-slate-800 mt-1">{req.travelDates}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[8px] text-slate-400 uppercase tracking-widest leading-none">Max Budget</span>
                      <span className="text-slate-800 mt-1">₹{req.budget.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[8px] text-slate-400 uppercase tracking-widest leading-none">Explorer count</span>
                      <span className="text-slate-800 mt-1">{req.groupSize} Guests</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-500 leading-relaxed font-normal bg-white p-3 border border-slate-100 rounded-lg">
                    <span className="font-bold text-slate-800 text-[10px] block mb-1">Custom Request Details:</span>
                    "{req.requirements}"
                  </p>

                  {/* Proposal status banner if already sent */}
                  {myProposal ? (
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col gap-2 mt-1">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                        <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Your proposal bid:</span>
                        <Badge variant={myProposal.status === 'accepted' ? 'success' : myProposal.status === 'rejected' ? 'danger' : 'outline'} className="font-bold">
                          {myProposal.status.toUpperCase()}
                        </Badge>
                      </div>
                      <p className="text-xs text-slate-600 font-normal leading-relaxed italic">
                        "{myProposal.itineraryDescription}"
                      </p>
                      <div className="flex justify-between text-[10px] font-bold text-slate-500 mt-1 pt-1.5 border-t border-slate-100">
                        <span>Bid Price: ₹{myProposal.price.toLocaleString('en-IN')}</span>
                        <span>Dates: {myProposal.travelDates}</span>
                      </div>
                    </div>
                  ) : (
                    /* Action Bids Buttons */
                    <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 mt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleStartChatWithClient(req.customerId, req.customerName)}
                        className="font-bold text-[10px] py-1.5 cursor-pointer flex items-center gap-1"
                      >
                        <MessageCircle className="w-3.5 h-3.5 text-accent" />
                        Chat with Client
                      </Button>
                      
                      {req.status === 'open' && (
                        <Button
                          variant="accent"
                          size="sm"
                          onClick={() => {
                            setActiveRequestId(req.id);
                            setBidDates(req.travelDates);
                          }}
                          className="font-bold text-[10px] py-1.5 cursor-pointer flex items-center gap-1"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          Send Proposal Bid
                        </Button>
                      )}
                    </div>
                  )}

                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* Organizer live chat panel */
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-white border border-slate-200 rounded-2xl overflow-hidden h-[500px] shadow-md items-stretch">
          
          {/* Conversation List */}
          <div className="col-span-1 border-r border-slate-200 flex flex-col items-stretch max-h-full overflow-y-auto">
            <div className="p-4 border-b border-slate-100 bg-slate-50">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Active Conversations</span>
            </div>

            <div className="flex flex-col">
              {conversations.map((conv) => {
                const isActive = activeConversationId === conv.id;
                return (
                  <button
                    key={conv.id}
                    onClick={() => setActiveConversationId(conv.id)}
                    className={`w-full text-left p-4 border-b border-slate-100 flex gap-3 hover:bg-slate-50 transition-colors ${
                      isActive ? 'bg-slate-50 border-l-4 border-l-accent' : ''
                    } cursor-pointer`}
                  >
                    <img src={conv.participantLogo} alt={conv.participantName} className="w-10 h-10 rounded-full object-cover shrink-0 border border-slate-200" />
                    <div className="flex-1 min-w-0 flex flex-col justify-center">
                      <div className="flex justify-between items-baseline mb-0.5">
                        <h4 className="text-xs font-bold text-slate-900 truncate leading-none">{conv.participantName}</h4>
                        <span className="text-[8px] text-slate-400 leading-none">{conv.lastMessageTime}</span>
                      </div>
                      <p className="text-[10px] text-slate-400 truncate leading-snug font-normal">{conv.lastMessage}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Chat Messages Panel */}
          <div className="col-span-2 flex flex-col justify-between max-h-full items-stretch relative">
            
            {activeConversation ? (
              <React.Fragment>
                {/* Panel Header */}
                <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between shrink-0">
                  <div className="flex items-center gap-3">
                    <img src={activeConversation.participantLogo} alt={activeConversation.participantName} className="w-9 h-9 rounded-full object-cover border border-slate-200" />
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 leading-tight">{activeConversation.participantName}</h4>
                      <span className="text-[8px] text-green-500 font-bold flex items-center gap-1">
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-ping" />
                        Client Online
                      </span>
                    </div>
                  </div>
                </div>

                {/* Messages ledger */}
                <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 bg-slate-50/50">
                  {activeMessages.map((msg) => {
                    const isMe = msg.senderId === 'user-org-1';
                    return (
                      <div
                        key={msg.id}
                        className={`flex flex-col max-w-[70%] gap-1 ${isMe ? 'ml-auto items-end' : 'mr-auto items-start'}`}
                      >
                        <div
                          className={`rounded-2xl px-4 py-2.5 text-xs font-medium ${
                            isMe
                              ? 'bg-primary text-white rounded-br-none'
                              : 'bg-white border border-slate-200 text-slate-800 rounded-bl-none shadow-sm'
                          }`}
                        >
                          {msg.message}
                        </div>
                        <span className="text-[8px] text-slate-400 font-bold px-1 mt-0.5">
                          {msg.timestamp} {isMe && (msg.status === 'read' ? '• Seen' : '• Sent')}
                        </span>
                      </div>
                    );
                  })}

                  {/* Typing Indicator */}
                  {isTyping && (
                    <div className="mr-auto items-start flex flex-col gap-1 max-w-[70%] animate-pulse">
                      <div className="bg-white border border-slate-200 rounded-2xl rounded-bl-none px-4 py-2.5 flex items-center gap-1 shadow-sm shrink-0">
                        <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" />
                        <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-75" />
                        <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-150" />
                      </div>
                    </div>
                  )}
                </div>

                {/* Input Panel */}
                <form onSubmit={handleSendMessage} className="p-4 border-t border-slate-100 bg-white flex gap-3 shrink-0 items-center">
                  <input
                    type="text"
                    placeholder="Type message to client..."
                    value={chatMessageText}
                    onChange={(e) => setChatMessageText(e.target.value)}
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs outline-none focus:border-accent text-slate-900 placeholder:text-slate-400"
                  />
                  <Button type="submit" variant="accent" size="sm" className="font-bold cursor-pointer shrink-0">
                    <Send className="w-4 h-4" />
                  </Button>
                </form>
              </React.Fragment>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center gap-3 text-slate-400 text-center p-6">
                <MessageCircle className="w-10 h-10 text-slate-300" />
                <h4 className="text-xs font-bold text-slate-700">Select a client chat</h4>
                <p className="text-[10px] text-slate-400 max-w-xs leading-normal">Pick one of your clients from the left conversation list to message them.</p>
              </div>
            )}

          </div>

        </div>
      )}

      {/* Send Proposal Dialog Modal */}
      <Dialog
        isOpen={!!activeRequestId}
        onClose={() => setActiveRequestId(null)}
        title="Submit Custom Quote Proposal"
        size="md"
      >
        <form onSubmit={handleSubmitBid} className="flex flex-col gap-4 text-slate-800 animate-fade-in">
          
          <div className="grid grid-cols-2 gap-4">
            <Input
              type="number"
              label="Bid Pricing Quote (₹)"
              value={bidPrice}
              onChange={(e) => setBidPrice(Number(e.target.value))}
              leftIcon={<IndianRupee className="w-4 h-4 text-slate-400" />}
              required
            />
            <Input
              label="Itinerary Dates Offered"
              placeholder="e.g. July 10 to 14"
              value={bidDates}
              onChange={(e) => setBidDates(e.target.value)}
              leftIcon={<Calendar className="w-4 h-4 text-slate-400" />}
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Proposal Details & Itinerary Draft
            </label>
            <textarea
              placeholder="Outline your wooden villa stays, backwater houseboats, private vehicle schedules and veg meal specs..."
              value={bidItinerary}
              onChange={(e) => setBidItinerary(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-xs outline-none focus:border-accent text-slate-905 placeholder:text-slate-400 min-h-24"
              required
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setActiveRequestId(null)}
              className="font-bold cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="accent"
              size="sm"
              isLoading={isSendingBid}
              className="font-extrabold cursor-pointer"
            >
              Submit Proposal Bid
            </Button>
          </div>

        </form>
      </Dialog>

    </div>
  );
}
