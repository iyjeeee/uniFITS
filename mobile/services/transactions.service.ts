// services/transactions.service.ts — Transactions data service
// DEV: filters MOCK_TRANSACTIONS by userId
// PROD swap: replace with supabase.from('transactions').select()

import { Transaction } from '@/types';
import { MOCK_TRANSACTIONS } from '@/api/mockData';

export const transactionsService = {
  /** getMyTransactions — all transactions for the current user */
  getMyTransactions: async (userId: string): Promise<Transaction[]> => {
    await new Promise((r) => setTimeout(r, 300));
    // PROD: const { data } = await supabase.from('transactions').select('*').eq('user_id', userId).order('transaction_date', { ascending: false })
    return MOCK_TRANSACTIONS.filter((t) => t.user_id === userId);
  },

  /** getAllTransactions — all transactions (for fund transparency view) */
  getAllTransactions: async (): Promise<Transaction[]> => {
    await new Promise((r) => setTimeout(r, 300));
    // PROD: const { data } = await supabase.from('transactions').select('*').order('transaction_date', { ascending: false })
    return MOCK_TRANSACTIONS;
  },

  /** getTransactionById — single transaction by id */
  getTransactionById: async (id: string): Promise<Transaction> => {
    await new Promise((r) => setTimeout(r, 200));
    // PROD: const { data } = await supabase.from('transactions').select('*').eq('id', id).single()
    const item = MOCK_TRANSACTIONS.find((t) => t.id === id);
    if (!item) throw new Error('Transaction not found.');
    return item;
  },
};
