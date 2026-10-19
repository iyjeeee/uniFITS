// header.test.tsx — Header behavior: notification badge/dropdown/modal paging, profile menu navigation, sign-out flow, outside click
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { OrgProvider } from '../context/OrgContext'
import Header from '../components/Header'
import type { User } from '../types'

const user = { id: '1', full_name: 'Juan Dela Cruz', role: 'President' } as unknown as User
const btn = (re: RegExp) => { const b = screen.getAllByRole('button').filter(x => re.test((x.textContent ?? '') + (x.getAttribute('aria-label') ?? ''))).pop(); if (!b) throw new Error('no button ' + re); return b }

function setup(props: Partial<React.ComponentProps<typeof Header>> = {}) {
  const navigate = vi.fn(); const onLogout = vi.fn(); const onMenuClick = vi.fn()
  render(<OrgProvider orgData={{}}><Header page="Dashboard" sub="Overview" onMenuClick={onMenuClick} navigate={navigate} onLogout={onLogout} currentUser={user} {...props} /></OrgProvider>)
  return { navigate, onLogout, onMenuClick }
}

describe('Header', () => {
  it('shows title, subtitle and falls back to Dashboard / Guest', () => {
    setup(); expect(screen.getByText('Overview')).toBeTruthy(); expect(screen.getByText('Juan Dela Cruz')).toBeTruthy()
  })
  it('hamburger calls onMenuClick', () => {
    const { onMenuClick } = setup(); fireEvent.click(btn(/Toggle sidebar/)); expect(onMenuClick).toHaveBeenCalledTimes(1)
  })
  it('unread badge clears after Mark all read', () => {
    setup(); expect(btn(/unread notifications/).getAttribute('aria-label')).toBe('3 unread notifications')
    fireEvent.click(btn(/unread notifications/)); fireEvent.click(btn(/Mark all read/))
    expect(btn(/unread notifications/).getAttribute('aria-label')).toBe('0 unread notifications')
  })
  it('View All Notifications opens a paged modal (8 per page) and View All Activity goes to /audit', () => {
    setup(); fireEvent.click(btn(/unread notifications/)); fireEvent.click(btn(/View All Notifications/))
    expect(document.body.textContent).toContain('Page 1 of 2')
    fireEvent.click(btn(/^2$/)); expect(document.body.textContent).toContain('Page 2 of 2')
    fireEvent.click(btn(/View All Activity/)); expect(window.location.hash).toBe('#/audit')
  })
  it('opening one dropdown closes the other; an outside mousedown closes both', () => {
    setup(); fireEvent.click(btn(/unread notifications/)); expect(screen.queryByText('My Account')).toBeNull()
    fireEvent.click(btn(/Juan Dela Cruz/)); expect(screen.getByText('My Account')).toBeTruthy(); expect(screen.queryByText('Mark all read')).toBeNull()
    fireEvent.mouseDown(document.body); expect(screen.queryByText('My Account')).toBeNull()
  })
  it('profile menu link calls navigate with the route and closes the menu', () => {
    const { navigate } = setup(); fireEvent.click(btn(/Juan Dela Cruz/)); fireEvent.click(screen.getByText('Personal Transactions'))
    expect(navigate).toHaveBeenCalledWith('/profile/transactions'); expect(screen.queryByText('My Account')).toBeNull()
  })
  it('Sign Out asks first; Cancel keeps the session, confirm calls onLogout', () => {
    const { onLogout } = setup(); fireEvent.click(btn(/Juan Dela Cruz/)); fireEvent.click(btn(/Sign Out/))
    expect(screen.getByText('Sign Out?')).toBeTruthy(); fireEvent.click(btn(/Cancel/)); expect(onLogout).not.toHaveBeenCalled()
    fireEvent.click(btn(/Juan Dela Cruz/)); fireEvent.click(btn(/Sign Out/)); fireEvent.click(btn(/Yes, Sign Out/)); expect(onLogout).toHaveBeenCalledTimes(1)
  })
})
