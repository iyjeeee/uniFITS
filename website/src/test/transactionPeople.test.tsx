// transactionPeople.test.tsx -- a transaction points at its member by user_id; the name is looked up (no stored user_name)
import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { OrgProvider } from '../context/OrgContext'
import Transactions from '../pages/transactions/Transactions'
import PersonalTransactions from '../pages/profile/PersonalTransactions'
import { getDashboardStats } from '../pages/dashboard/parts/dashboardStats'
import { MOCK_TRANSACTIONS, MOCK_USERS, getPartyName } from '../api/mockData'
import { isReceipt } from '../utils/ledger'

const mount = (ui: React.ReactElement) => render(<OrgProvider orgData={{}}>{ui}</OrgProvider>)
const search = (value: string) => fireEvent.change(screen.getByPlaceholderText(/^Search/), { target: { value } })
const rowsText = () => Array.from(document.querySelectorAll('tbody tr')).map((r) => r.textContent ?? '').join('|')
const tx1 = MOCK_TRANSACTIONS.find((t) => t.id === '1')!   // Juan's contribution

describe('transaction people', () => {
  it('no transaction stores a person\'s name; member transactions point at a real user', () => {
    for (const t of MOCK_TRANSACTIONS) {
      expect('user_name' in t).toBe(false)
      if (t.user_id !== null) expect(MOCK_USERS.some((u) => u.id === t.user_id)).toBe(true)
    }
  })
  it('getPartyName: the member\'s name, or the given fallback when there is no member', () => {
    expect(getPartyName('1', 'External')).toBe('Juan Dela Cruz')
    expect(getPartyName(null, 'External')).toBe('External')
  })
})

describe('Transactions page', () => {
  it('shows the member name from the user id, and External for org-level entries', () => {
    mount(<Transactions />)
    expect(rowsText()).toContain('Juan Dela Cruz')
    expect(rowsText()).toContain('External')
  })
  it('renaming a person changes the name on their transactions; search finds the NEW name', () => {
    const person = MOCK_USERS.find((u) => u.id === tx1.user_id)!; const was = person.full_name
    person.full_name = 'Renamed Person'
    try {
      mount(<Transactions />)
      expect(rowsText()).toContain('Renamed Person'); expect(rowsText()).not.toContain('Juan Dela Cruz')
      search('Renamed Person'); expect(rowsText()).toContain(tx1.reference_number)
      search('Maria'); expect(rowsText()).not.toContain(tx1.reference_number)
    } finally { person.full_name = was }
  })
  it('search by the member\'s NAME finds their rows (not their id)', () => {
    mount(<Transactions />)
    search('Juan Dela Cruz'); expect(rowsText()).toContain(tx1.reference_number)
    for (const t of MOCK_TRANSACTIONS.filter((x) => x.user_id !== tx1.user_id)) expect(rowsText()).not.toContain(t.reference_number)
  })
})

describe('My Transaction History (profile table)', () => {
  it('search finds rows by the person\'s name', () => {
    mount(<PersonalTransactions userId="1" />)
    search('Juan Dela Cruz'); expect(rowsText()).toContain(tx1.reference_number)
    search('Nobody Here');    expect(rowsText()).not.toContain(tx1.reference_number)
  })
})

describe('dashboard top contributors', () => {
  it('are grouped by user id, with names looked up and totals unchanged', () => {
    const d = getDashboardStats()
    const expected = new Map<string, number>()
    for (const t of MOCK_TRANSACTIONS.filter((x) => x.user_id && isReceipt(x))) expected.set(t.user_id!, (expected.get(t.user_id!) ?? 0) + t.amount)
    expect(d.topContributors.length).toBe(expected.size)
    for (const c of d.topContributors) {
      const u = MOCK_USERS.find((x) => x.full_name === c.name)!
      expect(c.total).toBe(expected.get(u.id))
    }
  })
})
