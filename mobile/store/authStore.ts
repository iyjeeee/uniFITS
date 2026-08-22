// store/authStore.ts — Zustand global auth store
// sessionRestored flag prevents premature redirects before secure store is read

import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';
import { User, AuthState } from '@/types';

const TOKEN_KEY = 'unifits_token';
const USER_KEY  = 'unifits_user';

interface AuthActions {
  login:           (user: User, token?: string) => Promise<void>;
  logout:          () => Promise<void>;
  setCurrentUser:  (user: User) => void;
  restoreSession:  () => Promise<void>;
}

// sessionRestored: true once restoreSession() has finished — prevents flickering redirects
type AuthStore = AuthState & { sessionRestored: boolean } & AuthActions;

export const useAuthStore = create<AuthStore>((set) => ({
  isAuthenticated: false,
  sessionRestored: false,    // starts false — nothing renders routes until this is true
  currentUser:     null,
  token:           null,

  login: async (user: User, token = 'mock-token') => {
    try {
      await SecureStore.setItemAsync(TOKEN_KEY, token);
      await SecureStore.setItemAsync(USER_KEY, JSON.stringify(user));
    } catch { /* secure store unavailable — continue */ }
    set({ isAuthenticated: true, currentUser: user, token });
  },

  logout: async () => {
    try {
      await SecureStore.deleteItemAsync(TOKEN_KEY);
      await SecureStore.deleteItemAsync(USER_KEY);
    } catch { /* ignore */ }
    set({ isAuthenticated: false, currentUser: null, token: null });
  },

  setCurrentUser: (user: User) => {
    set({ currentUser: user });
    SecureStore.setItemAsync(USER_KEY, JSON.stringify(user)).catch(() => {});
  },

  restoreSession: async () => {
    try {
      const token = await SecureStore.getItemAsync(TOKEN_KEY);
      const raw   = await SecureStore.getItemAsync(USER_KEY);
      if (token && raw) {
        const user = JSON.parse(raw) as User;
        // Set auth + mark restored in one atomic update
        set({ isAuthenticated: true, currentUser: user, token, sessionRestored: true });
        return;
      }
    } catch { /* no session — stay logged out */ }
    // Always mark restored even if no session found
    set({ sessionRestored: true });
  },
}));
