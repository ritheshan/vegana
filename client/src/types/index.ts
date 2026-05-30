export type UserRole = 'customer' | 'organizer' | 'admin' | 'visitor';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  companyName?: string;
  description?: string;
  phone?: string;
  website?: string;
  address?: string;
  banner?: string;
  verified?: boolean;
  tripsConducted?: number;
  customersServed?: number;
  rating?: number;
  yearsActive?: number;
}

export interface ItineraryItem {
  day: number;
  title: string;
  description: string;
  activities?: string[];
}

export interface Trip {
  id: string;
  title: string;
  category: 'Trekking' | 'Beach' | 'Adventure' | 'Camping' | 'Spiritual' | 'Nature' | 'Historical' | 'Wildlife';
  destination: string;
  description: string;
  durationDays: number;
  rating: number;
  reviewsCount: number;
  organizerId: string;
  organizerName: string;
  organizerLogo: string;
  price: number;
  image: string;
  maxSeats: number;
  availableSeats: number;
  dates: string[];
  itinerary: ItineraryItem[];
  included: string[];
  excluded: string[];
  meetingPoint: string;
  featured?: boolean;
  status: 'published' | 'draft';
}

export interface Booking {
  id: string;
  tripId: string;
  tripTitle: string;
  tripImage: string;
  customerId: string;
  customerName: string;
  organizerId: string;
  date: string;
  seats: number;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  createdAt: string;
}

export interface Review {
  id: string;
  tripId: string;
  authorName: string;
  authorAvatar: string;
  rating: number;
  comment: string;
  date: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  receiverId: string;
  message: string;
  timestamp: string;
  status: 'sent' | 'read';
}

export interface ChatConversation {
  id: string;
  participantId: string;
  participantName: string;
  participantLogo: string;
  participantRole: UserRole;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
}

export interface CustomProposal {
  id: string;
  organizerId: string;
  organizerName: string;
  organizerLogo: string;
  price: number;
  itineraryDescription: string;
  travelDates: string;
  status: 'pending' | 'accepted' | 'rejected';
}

export interface CustomTripRequest {
  id: string;
  customerId: string;
  customerName: string;
  destination: string;
  budget: number;
  groupSize: number;
  tripType: string;
  travelDates: string;
  requirements: string;
  status: 'open' | 'responded' | 'accepted' | 'rejected';
  proposals: CustomProposal[];
  createdAt: string;
}
