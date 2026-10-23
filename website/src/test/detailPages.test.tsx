// detailPages.test.tsx — ProjectDetail / EventDetail show only the financials linked to the opened item (B-47)
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { OrgProvider } from '../context/OrgContext'
import ProjectDetail from '../pages/projects/ProjectDetail'
import EventDetail from '../pages/events/EventDetail'

const wrap = (ui: React.ReactElement) => render(<OrgProvider orgData={{}}>{ui}</OrgProvider>)

describe('ProjectDetail financials', () => {
  it('project 1 shows its own contribution and expense, and external income is not the contribution total', () => {
    wrap(<ProjectDetail projectId="1" />)
    expect(screen.getByText('Pedro Reyes')).toBeTruthy()
    expect(screen.getByText('No external income recorded.')).toBeTruthy()
    expect(screen.queryAllByText('₱5,000.00').length).toBe(1)   // only the Employee Contributions header total (rows carry a +/− prefix)
  })
  it('project 2 has no transactions, so every financial panel is empty', () => {
    wrap(<ProjectDetail projectId="2" />)
    expect(screen.getByText('No contributions yet.')).toBeTruthy()
    expect(screen.getByText('No external income recorded.')).toBeTruthy()
    expect(screen.getByText('No expenses recorded.')).toBeTruthy()
  })
})

describe('EventDetail financials', () => {
  it('event 1 shows its own contribution; event 2 shows none', () => {
    const { unmount } = wrap(<EventDetail eventId="1" />)
    expect(screen.getByText('Ana Lim')).toBeTruthy()
    unmount()
    wrap(<EventDetail eventId="2" />)
    expect(screen.getByText('No contributions yet.')).toBeTruthy()
    expect(screen.getByText('No expenses recorded.')).toBeTruthy()
  })
})
