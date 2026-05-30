import { create } from 'zustand';
import { User, UserRole } from '../types';
import { MOCK_USERS } from '../constants';

interface AuthState {
  user: User | null;
  role: UserRole;
  isAuthenticated: boolean;
  setRole: (role: UserRole) => void;
  login: (email: string, password?: string) => boolean;
  logout: () => void;
  updateOrganizerProfile: (profile: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: MOCK_USERS.customer, // default log in as Customer
  role: 'customer',
  isAuthenticated: true,

  setRole: (role) => {
    if (role === 'visitor') {
      set({ user: null, role: 'visitor', isAuthenticated: false });
    } else if (role === 'customer') {
      set({ user: MOCK_USERS.customer, role: 'customer', isAuthenticated: true });
    } else if (role === 'organizer') {
      set({ user: MOCK_USERS.organizer1, role: 'organizer', isAuthenticated: true });
    } else if (role === 'admin') {
      set({ user: MOCK_USERS.admin, role: 'admin', isAuthenticated: true });
    }
  },

  login: (email, _password) => {
    // Basic mock login routing based on email
    const trimmedEmail = email.toLowerCase().trim();
    if (trimmedEmail.includes('admin')) {
      set({ user: MOCK_USERS.admin, role: 'admin', isAuthenticated: true });
      return true;
    }
    if (trimmedEmail.includes('org')) {
      set({ user: MOCK_USERS.organizer1, role: 'organizer', isAuthenticated: true });
      return true;
    }
    // Default to customer
    set({
      user: {
        id: 'user-customer-new',
        name: email.split('@')[0],
        email: email,
        role: 'customer',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        verified: true,
      },
      role: 'customer',
      isAuthenticated: true
    });
    return true;
  },

  logout: () => {
    set({ user: null, role: 'visitor', isAuthenticated: false });
  },

  updateOrganizerProfile: (profile) => {
    set((state) => {
      if (state.user && state.role === 'organizer') {
        const updated = { ...state.user, ...profile };
        // Sync back MOCK_USERS
        MOCK_USERS.organizer1 = updated;
        return { user: updated };
      }
      return {};
    });
  }
}));
