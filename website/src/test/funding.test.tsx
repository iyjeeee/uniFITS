// funding.test.tsx -- project/event funding is DERIVED from approved transactions (opening entry + movements)
import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { OrgProvider } from '../context/OrgContext'
import Projects from '../pages/projects/Projects'
import Events from '../pages/events/Events'
import { MOCK_PROJECTS, MOCK_EVENTS, MOCK_TRANSACTIONS, getProjectsWithFunding, getEventsWithFunding, getFundsWithBalance, formatCurrency } from '../api/mockData'

const mount = (ui: React.ReactElement) => render(<OrgProvider orgData={{}}>{ui}</OrgProvider>)
// "Current funding" shown before it became derived (stored values). Pending items cannot hold money (DB rule) -> 0.
const OLD_PROJECTS: Record<string, number> = { '1': 32500, '2': 78000, '3': 10000, '4': 200000, '5': 0 }
const OLD_EVENTS:   Record<string, number> = { '1': 125000, '2': 0, '3': 3000, '4': 40000 }

describe('derived project / event funding', () => {
  it('reproduces the previous numbers for approved items; pending items hold nothing', () => {
    for (const p of getProjectsWithFunding()) expect(p.current_funding).toBe(OLD_PROJECTS[p.id])
    for (const e of getEventsWithFunding())   expect(e.current_funding).toBe(OLD_EVENTS[e.id])
  })
  it('the stored items have no current_funding field any more', () => {
    for (const x of [...MOCK_PROJECTS, ...MOCK_EVENTS]) expect('current_funding' in x).toBe(false)
  })
  it('every opening entry belongs to ONE approved project/event, has no member and touches no fund', () => {
    const openings = MOCK_TRANSACTIONS.filter((t) => t.entry_type === 'opening_balance' && t.category !== 'fund')
    expect(openings).toHaveLength(7)
    for (const t of openings) {
      expect(t.status).toBe('approved'); expect(t.user_id).toBeNull(); expect(t.fund_id).toBeNull(); expect(t.payment_method_id).toBeNull()
      const owner = t.category === 'project' ? MOCK_PROJECTS.find((p) => p.id === t.project_id) : MOCK_EVENTS.find((e) => e.id === t.event_id)
      expect(owner?.approval_status).toBe('approved')
    }
  })
  it('fund balances are untouched by the funding entries', () => {
    expect(getFundsWithBalance().reduce((s, f) => s + f.balance, 0)).toBe(425500)
  })
  it('Projects and Events tables show the derived amounts', () => {
    mount(<Projects />); expect(document.body.textContent).toContain(formatCurrency(32500)); expect(document.body.textContent).toContain(formatCurrency(200000))
  })
  it('Events table shows the derived amounts', () => {
    mount(<Events />); expect(document.body.textContent).toContain(formatCurrency(125000)); expect(document.body.textContent).toContain(formatCurrency(40000))
  })
})
