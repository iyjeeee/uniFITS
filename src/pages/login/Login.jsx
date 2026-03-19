// Login.jsx — Main authentication entry point; split-panel layout
import { useState } from 'react'
import LoginBrand from './LoginBrand'   // Left decorative panel
import LoginForm  from './LoginForm'    // Right form panel
import './login.css'                    // Login-specific styles

export default function Login({ onLogin }) {
  const [authError, setAuthError] = useState('')   // Global error message
  const [loading,   setLoading]   = useState(false) // Spinner flag

  // handleLogin — validates credentials then fires onLogin callback
  function handleLogin(email, password) {
    setAuthError('')
    if (!email || !password) { setAuthError('Please enter your email and password.'); return }
    setLoading(true)
    // Simulate API call — replace with real POST /api/auth/login
    setTimeout(() => {
      setLoading(false)
      if (email === 'juan@example.com' && password === 'password123') {
        onLogin()
      } else {
        setAuthError('Invalid email or password. Please try again.')
      }
    }, 800)
  }

  return (
    // login-root — full-viewport two-column flex container
    <div className="login-root">
      <LoginBrand />
      <LoginForm onLogin={handleLogin} authError={authError} loading={loading} />
    </div>
  )
}
