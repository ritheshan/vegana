import { create } from 'zustand';
import { ChatConversation, ChatMessage } from '../types';
import { INITIAL_CONVERSATIONS } from '../constants';

interface ChatState {
  conversations: ChatConversation[];
  activeConversationId: string | null;
  messages: Record<string, ChatMessage[]>;
  isTyping: boolean;
  setActiveConversationId: (id: string | null) => void;
  sendMessage: (conversationId: string, messageText: string, senderId: string, receiverId: string) => void;
  markAsRead: (conversationId: string) => void;
  createConversation: (participantId: string, participantName: string, participantLogo: string, role: 'customer' | 'organizer') => string;
}

// Initial chat history between user-customer-1 (Rithish) and user-org-1 (Adventure Nest)
const INITIAL_MESSAGES: Record<string, ChatMessage[]> = {
  'conv-1': [
    {
      id: 'm1',
      senderId: 'user-org-1',
      receiverId: 'user-customer-1',
      message: 'Hi Rithish, welcome to Adventure Nest! We specialize in premium trekking and camping tours.',
      timestamp: '10:05 AM',
      status: 'read'
    },
    {
      id: 'm2',
      senderId: 'user-customer-1',
      receiverId: 'user-org-1',
      message: 'Hello! I am looking for a custom itinerary request for Coorg. We are a group of 4.',
      timestamp: '10:15 AM',
      status: 'read'
    },
    {
      id: 'm3',
      senderId: 'user-org-1',
      receiverId: 'user-customer-1',
      message: 'Hi Rithish, we have updated your custom proposal details. Let us know if you have any questions!',
      timestamp: '13:02 PM',
      status: 'read'
    }
  ],
  'conv-2': [
    {
      id: 'm4',
      senderId: 'user-customer-1',
      receiverId: 'user-org-2',
      message: 'Hello Himalayan Trails, is warm clothing provided for the Manali snow camp?',
      timestamp: 'Yesterday',
      status: 'read'
    },
    {
      id: 'm5',
      senderId: 'user-org-2',
      receiverId: 'user-customer-1',
      message: 'No worries! Warm gears are included in the winter package.',
      timestamp: 'Yesterday',
      status: 'read'
    }
  ]
};

export const useChatStore = create<ChatState>((set, get) => ({
  conversations: INITIAL_CONVERSATIONS,
  activeConversationId: null,
  messages: INITIAL_MESSAGES,
  isTyping: false,

  setActiveConversationId: (id) => {
    set({ activeConversationId: id });
    if (id) {
      get().markAsRead(id);
    }
  },

  sendMessage: (conversationId, messageText, senderId, receiverId) => {
    const newMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      senderId,
      receiverId,
      message: messageText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'sent'
    };

    // Update messages
    set((state) => {
      const convMessages = state.messages[conversationId] || [];
      const updatedMessages = {
        ...state.messages,
        [conversationId]: [...convMessages, newMessage]
      };

      // Update last message in conversation
      const updatedConversations = state.conversations.map((conv) => {
        if (conv.id === conversationId) {
          return {
            ...conv,
            lastMessage: messageText,
            lastMessageTime: newMessage.timestamp,
            unreadCount: 0
          };
        }
        return conv;
      });

      return {
        messages: updatedMessages,
        conversations: updatedConversations
      };
    });

    // Simulate Organizer automatic typing and reply if sender is customer
    if (senderId === 'user-customer-1') {
      const conv = get().conversations.find((c) => c.id === conversationId);
      const participantName = conv ? conv.participantName : 'Host';

      // 1. Trigger Typing after 1s
      setTimeout(() => {
        set({ isTyping: true });
      }, 1000);

      // 2. Add reply after 3s
      setTimeout(() => {
        const replyText = getMockReply(messageText, participantName);
        const replyMessage: ChatMessage = {
          id: `msg-reply-${Date.now()}`,
          senderId: receiverId,
          receiverId: senderId,
          message: replyText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          status: 'sent'
        };

        set((state) => {
          const convMessages = state.messages[conversationId] || [];
          const updatedMessages = {
            ...state.messages,
            [conversationId]: [...convMessages, replyMessage]
          };

          const updatedConversations = state.conversations.map((c) => {
            if (c.id === conversationId) {
              return {
                ...c,
                lastMessage: replyText,
                lastMessageTime: replyMessage.timestamp,
                unreadCount: state.activeConversationId === conversationId ? 0 : c.unreadCount + 1
              };
            }
            return c;
          });

          return {
            messages: updatedMessages,
            conversations: updatedConversations,
            isTyping: false
          };
        });

        // Trigger auto read marker if active
        if (get().activeConversationId === conversationId) {
          setTimeout(() => {
            get().markAsRead(conversationId);
          }, 500);
        }
      }, 3000);
    }
  },

  markAsRead: (conversationId) => {
    set((state) => {
      // Mark messages as read
      const convMessages = state.messages[conversationId] || [];
      const updatedMessages = {
        ...state.messages,
        [conversationId]: convMessages.map(m => ({ ...m, status: 'read' as const }))
      };

      // Reset unread count
      const updatedConversations = state.conversations.map((conv) => {
        if (conv.id === conversationId) {
          return { ...conv, unreadCount: 0 };
        }
        return conv;
      });

      return {
        messages: updatedMessages,
        conversations: updatedConversations
      };
    });
  },

  createConversation: (participantId, participantName, participantLogo, role) => {
    const existing = get().conversations.find(c => c.participantId === participantId);
    if (existing) {
      set({ activeConversationId: existing.id });
      return existing.id;
    }

    const newId = `conv-${Date.now()}`;
    const newConv: ChatConversation = {
      id: newId,
      participantId,
      participantName,
      participantLogo,
      participantRole: role,
      lastMessage: 'Conversation started.',
      lastMessageTime: 'Now',
      unreadCount: 0
    };

    set((state) => ({
      conversations: [newConv, ...state.conversations],
      messages: {
        ...state.messages,
        [newId]: []
      },
      activeConversationId: newId
    }));

    return newId;
  }
}));

// Dynamic reply selector based on keywords
function getMockReply(msg: string, hostName: string): string {
  const query = msg.toLowerCase();
  const cleanName = hostName.split(' ')[0];
  
  if (query.includes('price') || query.includes('cost') || query.includes('discount')) {
    return `Absolutely! For groups of 4 or more, we offer a 10% group discount. I can customize a quote in your Custom Trip Request tab right now!`;
  }
  if (query.includes('date') || query.includes('available') || query.includes('when')) {
    return `Yes, the listed dates are fully active! If you prefer a specific weekday departure instead, we can host a private batch just for your group.`;
  }
  if (query.includes('food') || query.includes('veg') || query.includes('meal')) {
    return `We provide fresh, nutritious buffet meals (both Veg and Non-Veg). Let me know if there are specific dietary allergies, and our kitchen team will accommodate them!`;
  }
  if (query.includes('cancel') || query.includes('refund')) {
    return `We have a highly flexible cancellation policy: free cancellation up to 72 hours before the departure date with full refund.`;
  }

  return `Thanks for the details! This is ${cleanName} Support. I've noted down your preferences and will get back to you shortly with booking steps. Let me know if you'd like to adjust anything else!`;
}
