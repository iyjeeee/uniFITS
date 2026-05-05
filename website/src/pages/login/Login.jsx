// Login.jsx — Main authentication entry point; split-panel layout
// DEV MODE: No backend yet — accepts any registered mock user email with any password
// Replace handleLogin body with real POST /api/auth/login when backend is ready
import { useState } from 'react'
import LoginBrand from './LoginBrand'   // Left decorative panel
import LoginForm  from './LoginForm'    // Right form panel
import './login.css'                    // Login-specific styles
import { MOCK_USERS } from '../../api/mockData'

export default function Login({ onLogin }) {
  const [authError, setAuthError] = useState('')   // Global error message
  const [loading,   setLoading]   = useState(false) // Spinner flag

  // handleLogin — DEV: accepts any mock user email + any non-empty password
  // PROD: replace with → fetch('/api/auth/login', { method:'POST', body: JSON.stringify({email,password}) })
  function handleLogin(email, password) {
    setAuthError('')
    if (!email || !password) { setAuthError('Please enter your email and password.'); return }
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      // ── DEV mock auth: match any registered email (case-insensitive), any password ──
      const user = MOCK_USERS.find(u => u.email.toLowerCase() === email.trim().toLowerCase())
      if (user) {
        onLogin(user)
      } else {
        setAuthError('No account found with that email. Try: juan@example.com')
      }
    }, 600)
  }

  return (
    // login-root — full-viewport two-column flex container
    <div className="login-root">
      <LoginBrand />
      <LoginForm onLogin={handleLogin} authError={authError} loading={loading} />
    </div>
  )
}
