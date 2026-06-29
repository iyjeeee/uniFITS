// services/auth.service.ts — Authentication service
// DEV: matches against MOCK_USERS
// PROD swap: replace login() with supabase.auth.signInWithPassword()

import { User } from '@/types';
import { MOCK_USERS } from '@/api/mockData';

export const authService = {
  /** login — DEV: accepts any MOCK_USERS email + any non-empty password */
  login: async (email: string, password: string): Promise<User> => {
    if (!email || !password) throw new Error('Please enter your email and password.');

    // Simulate network delay
    await new Promise((r) => setTimeout(r, 600));

    // DEV: match any registered email (case-insensitive), any password
    // PROD: const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    const user = MOCK_USERS.find(
      (u) => u.email.toLowerCase() === email.trim().toLowerCase()
    );

    if (!user) throw new Error('No account found with that email. Try: juan@example.com');
    if (user.status === 'inactive') throw new Error('Your account is currently inactive. Contact your administrator.');

    return user;
  },

  /** logout — DEV: no-op. PROD: supabase.auth.signOut() */
  logout: async (): Promise<void> => {
    await new Promise((r) => setTimeout(r, 200));
    // PROD: await supabase.auth.signOut()
  },

  /** getSession — DEV: returns null (session managed by authStore). PROD: supabase.auth.getSession() */
  getSession: async (): Promise<User | null> => {
    // PROD: const { data } = await supabase.auth.getSession()
    return null;
  },
};
