// parts/dashboardData.ts — HARD-CODED chart data (not derived from mock records — see bug log B-03)
export const MONTHLY_DATA = [
  { month: 'Jan', income: 45000, expense: 22000 },
  { month: 'Feb', income: 38000, expense: 18000 },
  { month: 'Mar', income: 62000, expense: 31000 },
  { month: 'Apr', income: 50000, expense: 28000 },
  { month: 'May', income: 71000, expense: 35000 },
  { month: 'Jun', income: 55000, expense: 24000 },
]

export const FUND_DATA = [
  { name: 'Membership', balance: 85000 },
  { name: 'Project',    balance: 45500 },
  { name: 'Event',      balance: 125000 },
  { name: 'Emergency',  balance: 20000 },
  { name: 'Building',   balance: 150000 },
]

export const STATUS_BREAKDOWN = [
  { label: 'Completed', count: 2, color: '#2E7D52' },
  { label: 'Ongoing',   count: 2, color: '#4B5EAA' },
  { label: 'Upcoming',  count: 5, color: '#D4860A' },
  { label: 'Cancelled', count: 0, color: '#C0392B' },
]

export type MonthlyPoint = (typeof MONTHLY_DATA)[number]
export type FundPoint    = (typeof FUND_DATA)[number]
export type StatusPoint  = (typeof STATUS_BREAKDOWN)[number]
