// test/ErrorBoundary.test.tsx — A crashing page must not take down the app shell
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import ErrorBoundary from '../components/ErrorBoundary'
import AppLayout from '../layouts/AppLayout'
import { OrgProvider } from '../context/OrgContext'
import { MOCK_USERS } from '../api/mockData'

let shouldCrash = true
function Bomb() {
  if (shouldCrash) throw new Error('boom')
  return <p>recovered</p>
}

describe('ErrorBoundary', () => {
  it('shows a friendly panel, keeps the sidebar, and recovers on "Try again"', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
    shouldCrash = true
    render(
      <OrgProvider orgData={{}}>
        <AppLayout page="Test" navigate={() => {}} onLogout={() => {}} currentUser={MOCK_USERS[0]}>
          <ErrorBoundary><Bomb /></ErrorBoundary>
        </AppLayout>
      </OrgProvider>,
    )
    expect(screen.getByRole('alert').textContent).toContain('Something went wrong')
    expect(screen.getByRole('alert').textContent).toContain('boom')
    expect(screen.getAllByText('Dashboard').length).toBeGreaterThan(0)   // sidebar still rendered

    shouldCrash = false
    fireEvent.click(screen.getByText('Try again'))
    expect(screen.getByText('recovered')).toBeTruthy()
  })
})
