// test/App.routing.test.tsx — Auth guard + public-route redirect behavior
import { describe, it, expect } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import App from '../App'
import { MOCK_USERS } from '../api/mockData'

const signIn = () => {
  window.sessionStorage.setItem('unifits_authed', 'true')
  window.sessionStorage.setItem('unifits_user', JSON.stringify(MOCK_USERS[1]))
}

describe('App routing', () => {
  it('signed-out user on a protected route sees the login form', async () => {
    window.location.hash = '#/dashboard'
    render(<App />)
    expect(await screen.findByRole('button', { name: 'Login' })).toBeTruthy()
  })

  it('signed-in user on /login is redirected to the dashboard', async () => {
    signIn(); window.location.hash = '#/login'
    render(<App />)
    await waitFor(() => expect(window.location.hash).toBe('#/dashboard'))
    expect((await screen.findAllByText('Maria Santos')).length).toBeGreaterThan(0)   // header shows the logged-in user
  })

  it('signed-in user can open a lazy-loaded page', async () => {
    signIn(); window.location.hash = '#/employees/attendance'
    render(<App />)
    expect(await screen.findByText(/Medical Mission 2026/)).toBeTruthy()
    expect(window.location.hash).toBe('#/employees/attendance')
  })
})
