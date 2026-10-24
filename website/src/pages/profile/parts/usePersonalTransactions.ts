// parts/usePersonalTransactions.ts — A member's transactions, contribution totals and modal/paging state (mock data now; swap for API calls later)
import { useState } from 'react'
import { MOCK_TRANSACTIONS, getFundsWithBalance } from '../../../api/mockData'
import { isReceipt } from '../../../utils/ledger'
import type { Transaction, FundWithBalance } from '../../../types'
import { PANEL_LIMIT } from './dueShared'

export function usePersonalTransactions(userId: string) {
  /* Data */
  const myTx          = MOCK_TRANSACTIONS.filter((t) => t.user_id === userId)
  const allFunds      = getFundsWithBalance()   // balances derived from approved transactions
  const requiredFunds = allFunds.filter((f) => f.is_required)

  /* Contribution totals */
  const totals = { total: 0, project: 0, event: 0, fund: 0, other: 0 }
  myTx.filter(isReceipt).forEach((t) => {
    totals.total += t.amount
    if ((totals as Record<string,number>)[t.category] !== undefined) (totals as Record<string,number>)[t.category] += t.amount
    else totals.other += t.amount
  })
  const [viewTx, setViewTx] = useState<Transaction | null>(null)   // transaction detail modal
  /* Due tile states */
  const [selectedDue, setSelectedDue]     = useState<FundWithBalance | null>(null)  // InfoModal target
  const [showAllDues, setShowAllDues]      = useState(false) // View All modal
  const [duesPage,    setDuesPage]         = useState(1)

  const panelDues = requiredFunds.slice(0, PANEL_LIMIT)

  return { myTx, totals, panelDues, allFunds, viewTx, setViewTx, selectedDue, setSelectedDue, showAllDues, setShowAllDues, duesPage, setDuesPage }
}
