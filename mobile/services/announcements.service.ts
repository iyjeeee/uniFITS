// services/announcements.service.ts — Announcements data service
// DEV: returns MOCK_ANNOUNCEMENTS
// PROD swap: replace with supabase.from('announcements').select()

import { Announcement } from '@/types';
import { MOCK_ANNOUNCEMENTS } from '@/api/mockData';

export const announcementsService = {
  /** getAnnouncements — all announcements, pinned first */
  getAnnouncements: async (): Promise<Announcement[]> => {
    await new Promise((r) => setTimeout(r, 300));
    // PROD: const { data } = await supabase.from('announcements').select('*').order('is_pinned', { ascending: false }).order('created_at', { ascending: false })
    return [...MOCK_ANNOUNCEMENTS].sort((a, b) => {
      if (a.is_pinned !== b.is_pinned) return a.is_pinned ? -1 : 1;
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });
  },

  /** getAnnouncementById — single announcement by id */
  getAnnouncementById: async (id: string): Promise<Announcement> => {
    await new Promise((r) => setTimeout(r, 200));
    // PROD: const { data } = await supabase.from('announcements').select('*').eq('id', id).single()
    const item = MOCK_ANNOUNCEMENTS.find((a) => a.id === id);
    if (!item) throw new Error('Announcement not found.');
    return item;
  },
};
