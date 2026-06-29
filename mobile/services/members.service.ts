// services/members.service.ts — Member/profile data service
// DEV: reads from MOCK_USERS
// PROD swap: replace with supabase.from('members').select()

import { User } from '@/types';
import { MOCK_USERS } from '@/api/mockData';

export const membersService = {
  /** getMyProfile — fetch logged-in member's full profile */
  getMyProfile: async (userId: string): Promise<User> => {
    await new Promise((r) => setTimeout(r, 300));
    // PROD: const { data } = await supabase.from('members').select('*').eq('id', userId).single()
    const user = MOCK_USERS.find((u) => u.id === userId);
    if (!user) throw new Error('Member profile not found.');
    return user;
  },

  /** updateProfile — save profile edits for the current user */
  updateProfile: async (userId: string, data: Partial<User>): Promise<User> => {
    await new Promise((r) => setTimeout(r, 500));
    // PROD: const { data: updated } = await supabase.from('members').update(data).eq('id', userId).select().single()
    const user = MOCK_USERS.find((u) => u.id === userId);
    if (!user) throw new Error('Member not found.');
    return { ...user, ...data };
  },

  /** getMembers — fetch all active members (for reference counts) */
  getMembers: async (): Promise<User[]> => {
    await new Promise((r) => setTimeout(r, 300));
    // PROD: const { data } = await supabase.from('members').select('*').eq('status', 'active')
    return MOCK_USERS;
  },
};
