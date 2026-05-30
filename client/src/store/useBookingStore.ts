import { create } from 'zustand';
import { Booking } from '../types';
import { INITIAL_BOOKINGS } from '../constants';

interface BookingState {
  bookings: Booking[];
  wishlistIds: string[];
  createBooking: (booking: Booking) => void;
  updateBookingStatus: (id: string, status: Booking['status']) => void;
  toggleWishlist: (tripId: string) => void;
  isInWishlist: (tripId: string) => boolean;
}

export const useBookingStore = create<BookingState>((set, get) => ({
  bookings: INITIAL_BOOKINGS,
  wishlistIds: ['trip-1', 'trip-3'], // Initial wishlist items for demonstration

  createBooking: (booking) => {
    set((state) => ({ bookings: [booking, ...state.bookings] }));
  },

  updateBookingStatus: (id, status) => {
    set((state) => ({
      bookings: state.bookings.map((b) => (b.id === id ? { ...b, status } : b))
    }));
  },

  toggleWishlist: (tripId) => {
    set((state) => {
      const exists = state.wishlistIds.includes(tripId);
      if (exists) {
        return { wishlistIds: state.wishlistIds.filter(id => id !== tripId) };
      } else {
        return { wishlistIds: [...state.wishlistIds, tripId] };
      }
    });
  },

  isInWishlist: (tripId) => {
    return get().wishlistIds.includes(tripId);
  }
}));
