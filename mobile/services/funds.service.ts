// services/funds.service.ts — Funds data service
// DEV: returns MOCK_FUNDS
// PROD swap: replace with supabase.from('funds').select()

import { Fund } from '@/types';
import { MOCK_FUNDS } from '@/api/mockData';

export const fundsService = {
  /** getFunds — all funds */
  getFunds: async (): Promise<Fund[]> => {
    await new Promise((r) => setTimeout(r, 300));
    // PROD: const { data } = await supabase.from('funds').select('*').order('name')
    return MOCK_FUNDS;
  },

  /** getFundById — single fund by id */
  getFundById: async (id: string): Promise<Fund> => {
    await new Promise((r) => setTimeout(r, 200));
    // PROD: const { data } = await supabase.from('funds').select('*').eq('id', id).single()
    const item = MOCK_FUNDS.find((f) => f.id === id);
    if (!item) throw new Error('Fund not found.');
    return item;
  },
};
