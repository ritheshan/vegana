import { create } from 'zustand';
import { Trip } from '../types';
import { INITIAL_TRIPS } from '../constants';

interface TripState {
  trips: Trip[];
  getTripById: (id: string) => Trip | undefined;
  addTrip: (trip: Trip) => void;
  updateTrip: (id: string, tripUpdates: Partial<Trip>) => void;
  deleteTrip: (id: string) => void;
  togglePublish: (id: string) => void;
}

export const useTripStore = create<TripState>((set, get) => ({
  trips: INITIAL_TRIPS,

  getTripById: (id) => {
    return get().trips.find(t => t.id === id);
  },

  addTrip: (trip) => {
    set((state) => ({ trips: [trip, ...state.trips] }));
  },

  updateTrip: (id, tripUpdates) => {
    set((state) => ({
      trips: state.trips.map((t) => (t.id === id ? { ...t, ...tripUpdates } : t))
    }));
  },

  deleteTrip: (id) => {
    set((state) => ({
      trips: state.trips.filter((t) => t.id !== id)
    }));
  },

  togglePublish: (id) => {
    set((state) => ({
      trips: state.trips.map((t) => {
        if (t.id === id) {
          const newStatus = t.status === 'published' ? 'draft' : 'published';
          return { ...t, status: newStatus };
        }
        return t;
      })
    }));
  }
}));
