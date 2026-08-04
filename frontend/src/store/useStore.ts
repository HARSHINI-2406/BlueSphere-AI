import { create } from 'zustand';
import { Region } from '../types';

interface User {
  id: number;
  email: string;
  full_name: string;
  organization: string;
  role: string;
}

interface AppState {
  // Auth State
  user: any | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (user: any, token: string) => void;
  logout: () => void;
  updateUser: (updatedUser: any) => void;

  // UI / Map State
  selectedRegion: Region | null;
  setSelectedRegion: (region: Region | null) => void;
  regions: Region[];
  setRegions: (regions: Region[]) => void;
  activeLayers: string[]; // "SST" | "Chlorophyll" | "Salinity" | "Currents"
  toggleLayer: (layer: string) => void;
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  daysFilter: number;
  setDaysFilter: (days: number) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

// Read initial auth states from localStorage if they exist
const storedUser = localStorage.getItem('bluesphere_user');
const storedToken = localStorage.getItem('bluesphere_token');

export const useStore = create<AppState>((set) => ({
  // Auth Initial Values
  user: storedUser ? JSON.parse(storedUser) : null,
  token: storedToken || null,
  isAuthenticated: !!storedToken,
  
  login: (user, token) => {
    localStorage.setItem('bluesphere_user', JSON.stringify(user));
    localStorage.setItem('bluesphere_token', token);
    set({ user, token, isAuthenticated: true });
  },
  
  logout: () => {
    localStorage.removeItem('bluesphere_user');
    localStorage.removeItem('bluesphere_token');
    set({ user: null, token: null, isAuthenticated: false, selectedRegion: null });
  },

  updateUser: (updatedUser) => {
    localStorage.setItem('bluesphere_user', JSON.stringify(updatedUser));
    set({ user: updatedUser });
  },

  // UI / Map Initial Values
  selectedRegion: null,
  setSelectedRegion: (region) => set({ selectedRegion: region }),
  regions: [],
  setRegions: (regions) => set({ regions }),
  activeLayers: ['SST', 'Chlorophyll'],
  toggleLayer: (layer) => set((state) => ({
    activeLayers: state.activeLayers.includes(layer)
      ? state.activeLayers.filter((l) => l !== layer)
      : [...state.activeLayers, layer]
  })),
  theme: 'dark',
  toggleTheme: () => set((state) => ({ theme: state.theme === 'dark' ? 'light' : 'dark' })),
  daysFilter: 30,
  setDaysFilter: (days) => set({ daysFilter: days }),
  loading: false,
  setLoading: (loading) => set({ loading })
}));
