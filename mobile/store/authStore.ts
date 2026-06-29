// store/authStore.ts — Zustand global auth store for uniFITS Mobile
// Manages: isAuthenticated, currentUser, token
// Persists token to expo-secure-store; restores session on app launch

import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';
import { User, AuthState } from '@/types';

const TOKEN_KEY = 'unifits_token';
const USER_KEY  = 'unifits_user';

interface AuthActions {
  login:          (user: User, token?: string) => Promise<void>;
  logout:         () => Promise<void>;
  setCurrentUser: (user: User) => void;
  restoreSession: () => Promise<void>;
}

type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>((set) => ({
  // Initial state
  isAuthenticated: false,
  currentUser:     null,
  token:           null,

  /** login — called after successful auth; persists user + token */
  login: async (user: User, token = 'mock-token') => {
    try {
      await SecureStore.setItemAsync(TOKEN_KEY, token);
      await SecureStore.setItemAsync(USER_KEY, JSON.stringify(user));
    } catch { /* secure store unavailable in web/sim — continue anyway */ }
    set({ isAuthenticated: true, currentUser: user, token });
  },

  /** logout — clears all auth state and secure storage */
  logout: async () => {
    try {
      await SecureStore.deleteItemAsync(TOKEN_KEY);
      await SecureStore.deleteItemAsync(USER_KEY);
    } catch { /* ignore */ }
    set({ isAuthenticated: false, currentUser: null, token: null });
  },

  /** setCurrentUser — update user without re-authenticating (e.g. after profile edit) */
  setCurrentUser: (user: User) => {
    set({ currentUser: user });
    // Persist updated user data
    SecureStore.setItemAsync(USER_KEY, JSON.stringify(user)).catch(() => {});
  },

  /** restoreSession — called on app launch to restore persisted auth */
  restoreSession: async () => {
    try {
      const token = await SecureStore.getItemAsync(TOKEN_KEY);
      const raw   = await SecureStore.getItemAsync(USER_KEY);
      if (token && raw) {
        const user = JSON.parse(raw) as User;
        set({ isAuthenticated: true, currentUser: user, token });
      }
    } catch { /* no persisted session — stay logged out */ }
  },
}));
