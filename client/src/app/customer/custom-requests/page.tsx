'use client';

import * as React from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useCustomTripStore } from '../../../store/useCustomTripStore';
import { useAuthStore } from '../../../store/useAuthStore';
import { useChatStore } from '../../../store/useChatStore';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import {
  Sparkles, Send, Compass, Users, Calendar, IndianRupee,
  MessageCircle, ShieldCheck, CheckCircle2, ChevronRight, XCircle
} from 'lucide-react';

export default function CustomRequestsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const { requests, createRequest, updateProposalStatus } = useCustomTripStore();
  const { user } = useAuthStore();

  // Chat Store integration
  const {
    conversations, activeConversationId, messages, isTyping,
    setActiveConversationId, sendMessage
  } = useChatStore();

  // Active view tabs
  const [activeTab, setActiveTab] = React.useState<'requests' | 'chat'>('requests');
  const [chatMessageText, setChatMessageText] = React.useState('');

  // Form State
  const [destination, setDestination] = React.useState('');
  const [dates, setDates] = React.useState('');
  const [size, setSize] = React.useState(2);
  const [budget, setBudget] = React.useState(10000);
  const [requirements, setRequirements] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // Monitor quick chat redirects
  React.useEffect(() => {
    const chatParam = searchParams.get('active_chat');
    if (chatParam) {
      setActiveConversationId(chatParam);
      setActiveTab('chat');
    }
  }, [searchParams]);

  const handleCreateRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!destination || !dates || !requirements) return;
    setIsSubmitting(true);

    setTimeout(() => {
      createRequest({
        id: `custom-${Date.now()}`,
        customerId: user?.id || 'user-customer-1',
        customerName: user?.name || 'Rithish N',
        destination,
        budget,
        groupSize: size,
        tripType: 'Custom Guided Tour',
        travelDates: dates,
        requirements,
        status: 'open',
        proposals: [],
        createdAt: new Date().toISOString()
      });

      // Clear Form
      setDestination('');
      setDates('');
      setSize(2);
      setBudget(10000);
      setRequirements('');
      setIsSubmitting(false);
    }, 1200);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessageText.trim() || !activeConversationId) return;

    const conv = conversations.find(c => c.id === activeConversationId);
    if (!conv) return;

    sendMessage(
      activeConversationId,
      chatMessageText,
      user?.id || 'user-customer-1',
      conv.participantId
    );
    setChatMessageText('');
  };

  const activeMessages = activeConversationId ? messages[activeConversationId] || [] : [];
  const activeConversation = conversations.find(c => c.id === activeConversationId);

  const getProposalStatusBadge = (status: 'pending' | 'accepted' | 'rejected') => {
    switch (status) {
      case 'pending': return <Badge variant="warning" className="font-bold text-[9px] uppercase">Bid Pending</Badge>;
      case 'accepted': return <Badge variant="success" className="font-bold text-[9px] uppercase">Accepted</Badge>;
      case 'rejected': return <Badge variant="danger" className="font-bold text-[9px] uppercase">Rejected</Badge>;
    }
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      
      {/* 1. Header with dynamic switcher tabs */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-accent" />
            Custom Itinerary & Messaging Center
          </h1>
          <p className="text-xs text-slate-400 font-medium">
            Plan personalized group tours, review organizer pricing bids, and chat live
          </p>
        </div>

        {/* View Toggle */}
        <div className="flex bg-slate-100 p-1 border border-slate-200 rounded-xl shrink-0 self-stretch md:self-auto">
          <button
            onClick={() => setActiveTab('requests')}
            className={`flex-1 md:flex-none px-4 py-2 text-xs font-bold rounded-lg transition-all ${
              activeTab === 'requests' ? 'bg-white text-slate-950 shadow-sm' : 'text-slate-500'
            } cursor-pointer`}
          >
            Custom Proposals ({requests.length})
          </button>
          <button
            onClick={() => setActiveTab('chat')}
            className={`flex-1 md:flex-none px-4 py-2 text-xs font-bold rounded-lg transition-all ${
              activeTab === 'chat' ? 'bg-white text-slate-950 shadow-sm' : 'text-slate-500'
            } cursor-pointer`}
          >
            Live Host Chat
          </button>
        </div>
      </div>

      {/* 2. Main Tab content */}
      {activeTab === 'requests' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Submit Custom Request Form */}
          <div className="col-span-1 bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col gap-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 pb-3">
              Request Custom Itinerary
            </h3>
            <form onSubmit={handleCreateRequest} className="flex flex-col gap-4">
              <Input
                label="Destination"
                placeholder="e.g. Kerala, Andaman"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                leftIcon={<Compass className="w-4 h-4 text-slate-400" />}
                required
              />
              <Input
                label="Travel Dates"
                placeholder="e.g. July 10 to 14"
                value={dates}
                onChange={(e) => setDates(e.target.value)}
                leftIcon={<Calendar className="w-4 h-4 text-slate-400" />}
                required
              />
              
              <div className="grid grid-cols-2 gap-3">
                <Input
                  type="number"
                  label="Explorers count"
                  value={size}
                  onChange={(e) => setSize(Number(e.target.value))}
                  leftIcon={<Users className="w-4 h-4 text-slate-400" />}
                />
                <Input
                  type="number"
                  label="Budget (₹)"
                  value={budget}
                  onChange={(e) => setBudget(Number(e.target.value))}
                  leftIcon={<IndianRupee className="w-4 h-4 text-slate-400" />}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Custom Requirements
                </label>
                <textarea
                  placeholder="Need vegetarian food, homestays or houseboat bookings..."
                  value={requirements}
                  onChange={(e) => setRequirements(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-sm outline-none focus:border-accent text-slate-900 placeholder:text-slate-400 min-h-24"
                  required
                />
              </div>

              <Button
                type="submit"
                variant="accent"
                isLoading={isSubmitting}
                className="w-full font-bold py-3 mt-1 cursor-pointer"
              >
                Send Request
              </Button>
            </form>
          </div>

          {/* List of Custom requests & incoming bids */}
          <div className="col-span-1 lg:col-span-2 flex flex-col gap-6">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Active Custom Requests & Organizer Bids
            </h3>

            {requests.length > 0 ? (
              <div className="flex flex-col gap-6">
                {requests.map((req) => (
                  <div key={req.id} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col gap-4">
                    
                    {/* Header */}
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                      <div>
                        <h4 className="text-sm font-bold text-slate-900 leading-tight">
                          Custom Trip to {req.destination}
                        </h4>
                        <span className="text-[10px] text-slate-400">Created: {new Date(req.createdAt).toLocaleDateString('en-US')}</span>
                      </div>
                      <Badge variant={req.status === 'open' ? 'outline' : req.status === 'accepted' ? 'success' : 'primary'} className="font-bold">
                        {req.status === 'open' ? 'Awaiting Bids' : req.status === 'responded' ? 'Proposals Received' : req.status.toUpperCase()}
                      </Badge>
                    </div>

                    {/* Requirement details */}
                    <div className="grid grid-cols-3 gap-2 bg-slate-50 rounded-lg p-3 text-[10px] text-slate-600 font-bold border border-slate-100">
                      <div className="flex flex-col">
                        <span className="text-[8px] text-slate-400 uppercase tracking-widest">Travel Dates</span>
                        <span className="text-slate-800 mt-0.5">{req.travelDates}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[8px] text-slate-400 uppercase tracking-widest">Budget</span>
                        <span className="text-slate-800 mt-0.5">₹{req.budget.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[8px] text-slate-400 uppercase tracking-widest">Explorers</span>
                        <span className="text-slate-800 mt-0.5">{req.groupSize} Guests</span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-500 leading-relaxed font-normal bg-white rounded-lg p-2.5 border border-slate-100">
                      <span className="font-bold text-slate-800 text-[10px] block mb-1">Explorer Details:</span>
                      {req.requirements}
                    </p>

                    {/* Proposals list */}
                    {req.proposals.length > 0 && (
                      <div className="flex flex-col gap-3 pt-3 border-t border-slate-100 mt-2">
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                          Bids from Local Hosts:
                        </span>
                        
                        {req.proposals.map((prop) => (
                          <div
                            key={prop.id}
                            className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col gap-3"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <img src={prop.organizerLogo} alt={prop.organizerName} className="w-8 h-8 rounded-full border border-slate-200" />
                                <div>
                                  <h5 className="text-xs font-bold text-slate-900">{prop.organizerName}</h5>
                                  <span className="text-[9px] text-slate-400">Verified Partner</span>
                                </div>
                              </div>
                              {getProposalStatusBadge(prop.status)}
                            </div>

                            <p className="text-xs text-slate-600 leading-relaxed font-normal bg-white p-2.5 border border-slate-100 rounded-lg">
                              <span className="font-bold text-slate-800 text-[9px] block mb-1">Proposal details:</span>
                              {prop.itineraryDescription}
                            </p>

                            <div className="flex items-center justify-between border-t border-slate-100 pt-3">
                              <div className="flex flex-col">
                                <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest leading-none">Bid Quote</span>
                                <span className="text-sm font-black text-slate-900 mt-1">₹{prop.price.toLocaleString('en-IN')}</span>
                              </div>

                              {prop.status === 'pending' && (
                                <div className="flex gap-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => updateProposalStatus(req.id, prop.id, 'rejected')}
                                    className="font-bold text-[9px] py-1 cursor-pointer"
                                  >
                                    Decline
                                  </Button>
                                  <Button
                                    variant="accent"
                                    size="sm"
                                    onClick={() => updateProposalStatus(req.id, prop.id, 'accepted')}
                                    className="font-bold text-[9px] py-1 cursor-pointer"
                                  >
                                    Accept Bid
                                  </Button>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white border border-slate-200 border-dashed rounded-xl p-10 text-center flex flex-col items-center justify-center gap-3">
                <Compass className="w-10 h-10 text-slate-300" />
                <h4 className="text-xs font-bold text-slate-800">No custom requests posted</h4>
                <p className="text-[10px] text-slate-400 max-w-xs">Use the side form to submit your custom specifications and matching local hosts will bid with price proposals!</p>
              </div>
            )}
          </div>

        </div>
      ) : (
        /* Dynamic Live Chat Window split */
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
                        Host Online
                      </span>
                    </div>
                  </div>
                </div>

                {/* Messages ledger */}
                <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 bg-slate-50/50">
                  {activeMessages.map((msg) => {
                    const isMe = msg.senderId === (user?.id || 'user-customer-1');
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
                    placeholder="Type message..."
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
                <h4 className="text-xs font-bold text-slate-700">Select a conversation</h4>
                <p className="text-[10px] text-slate-400 max-w-xs leading-normal">Pick one of your hosts from the left list to view messaging history and chat live.</p>
              </div>
            )}

          </div>

        </div>
      )}

    </div>
  );
}
