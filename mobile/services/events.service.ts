// services/events.service.ts — Events data service
// DEV: returns MOCK_EVENTS
// PROD swap: replace with supabase.from('events').select()

import { Event } from '@/types';
import { MOCK_EVENTS } from '@/api/mockData';

export const eventsService = {
  /** getEvents — all events, soonest first */
  getEvents: async (): Promise<Event[]> => {
    await new Promise((r) => setTimeout(r, 300));
    // PROD: const { data } = await supabase.from('events').select('*').order('event_date', { ascending: true })
    return MOCK_EVENTS;
  },

  /** getEventById — single event by id */
  getEventById: async (id: string): Promise<Event> => {
    await new Promise((r) => setTimeout(r, 200));
    // PROD: const { data } = await supabase.from('events').select('*').eq('id', id).single()
    const item = MOCK_EVENTS.find((e) => e.id === id);
    if (!item) throw new Error('Event not found.');
    return item;
  },
};
