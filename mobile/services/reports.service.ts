// services/reports.service.ts — Summary/report data service
// DEV: computed from MOCK_FUNDS + MOCK_TRANSACTIONS
// PROD swap: replace with supabase aggregation queries or /api/reports endpoint

import { FundSummary, FinancialOverview } from '@/types';
import { MOCK_FUNDS, MOCK_TRANSACTIONS } from '@/api/mockData';

export const reportsService = {
  /** getFundSummary — KPI stats for home dashboard */
  getFundSummary: async (): Promise<FundSummary> => {
    await new Promise((r) => setTimeout(r, 300));
    // PROD: const { data } = await supabase.rpc('get_fund_summary')
    const totalBalance = MOCK_FUNDS.reduce((s, f) => s + f.balance, 0);
    return {
      totalBalance,
      fundCount:   MOCK_FUNDS.length,
      activeCount: MOCK_FUNDS.filter((f) => f.status === 'active').length,
    };
  },

  /** getFinancialOverview — income/expense breakdown for home dashboard */
  getFinancialOverview: async (): Promise<FinancialOverview> => {
    await new Promise((r) => setTimeout(r, 300));
    // PROD: const { data } = await supabase.rpc('get_financial_overview')
    const completed = MOCK_TRANSACTIONS.filter((t) => t.status === 'completed');
    const totalIncome        = completed.filter((t) => t.entry_type === 'income').reduce((s, t) => s + t.amount, 0);
    const totalExpense       = completed.filter((t) => t.entry_type === 'expense').reduce((s, t) => s + t.amount, 0);
    const totalContributions = completed.filter((t) => t.entry_type === 'contribution').reduce((s, t) => s + t.amount, 0);
    return {
      totalIncome,
      totalExpense,
      totalContributions,
      netBalance:       totalIncome + totalContributions - totalExpense,
      transactionCount: MOCK_TRANSACTIONS.length,
    };
  },
};
