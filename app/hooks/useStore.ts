import { create } from 'zustand';
import { Event, User, Theme } from '../types';
import { auth } from '../services/firebase';

interface AppState {
  user: User | null;
  loading: boolean;
  events: Event[];
  selectedEvent: Event | null;
  theme: Theme;
  isAuthenticated: boolean;
  
  // Auth actions
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
  
  // Event actions
  setEvents: (events: Event[]) => void;
  addEvent: (event: Event) => void;
  updateEvent: (event: Event) => void;
  setSelectedEvent: (event: Event | null) => void;
  toggleEventInterest: (eventId: string) => void;
  
  // Theme actions
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

export const useStore = create<AppState>((set) => ({
  user: null,
  loading: true,
  events: [],
  selectedEvent: null,
  theme: 'light',
  isAuthenticated: false,
  
  // Auth actions
  setUser: (user) => set({ user }),
  setLoading: (loading) => set({ loading }),
  setIsAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
  
  // Event actions
  setEvents: (events) => set({ events }),
  addEvent: (event) => set((state) => ({ events: [...state.events, event] })),
  updateEvent: (event) => set((state) => ({
    events: state.events.map((e) => (e.id === event.id ? event : e)),
  })),
  setSelectedEvent: (event) => set({ selectedEvent: event }),
  toggleEventInterest: (eventId) => set((state) => {
    if (!state.user) return state;
    
    const events = state.events.map((event) => {
      if (event.id === eventId) {
        const isInterested = event.interestedUsers.includes(state.user!.id);
        return {
          ...event,
          interestedUsers: isInterested
            ? event.interestedUsers.filter((id) => id !== state.user!.id)
            : [...event.interestedUsers, state.user!.id],
        };
      }
      return event;
    });
    
    return { events };
  }),
  
  // Theme actions
  toggleTheme: () => set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),
  setTheme: (theme) => set({ theme }),
}));

export default useStore; 