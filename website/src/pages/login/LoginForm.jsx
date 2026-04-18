// LoginForm.jsx — Right form panel; sits inside a raised card on styled background
// Added: per-field inline validation with real-time feedback on blur
import { useState } from 'react'
import { Button }   from '../../components/ui'
import { isEmail, passwordStrength } from '../../utils/validation'  // shared validators

export default function LoginForm({ onLogin, authError, loading }) {
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [showPw,   setShowPw]   = useState(false)

  // fieldErrors — inline per-field validation messages shown on blur
  const [fieldErrors, setFieldErrors] = useState({ email: '', password: '' })

  // validateEmail — runs on blur; checks format
  const validateEmail = () => {
    if (!email.trim())          return setFieldErrors(p => ({ ...p, email: 'Email address is required.' }))
    const err = isEmail(email)
    setFieldErrors(p => ({ ...p, email: err }))
  }

  // validatePassword — runs on blur; checks minimum length
  const validatePassword = () => {
    const err = passwordStrength(password)
    setFieldErrors(p => ({ ...p, password: err }))
  }

  // clearError — clears the field error when the user starts typing again
  const clearError = (field) => setFieldErrors(p => ({ ...p, [field]: '' }))

  // handleSubmit — validates all fields before calling parent handler
  function handleSubmit(e) {
    e.preventDefault()
    const emailErr = !email.trim() ? 'Email address is required.' : isEmail(email)
    const pwErr    = passwordStrength(password)
    if (emailErr || pwErr) { setFieldErrors({ email: emailErr, password: pwErr }); return }
    onLogin(email, password)
  }

  return (
    // login-form-panel — styled off-white background with decorative elements
    <section className="login-form-panel">
      <div className="form-dots" aria-hidden="true" />
      <div className="form-shape form-shape--a" aria-hidden="true" />
      <div className="form-shape form-shape--b" aria-hidden="true" />
      <div className="form-shape form-shape--c" aria-hidden="true" />

      {/* form-card — raised white card that holds the actual form */}
      <div className="form-card">
        <p className="form-eyebrow"><span className="form-eyebrow__bar" aria-hidden="true" />WELCOME BACK</p>
        <h2 className="form-heading">Login to<br />your Account</h2>
        <p className="form-sub">Enter your credentials to access the uniFITS system</p>

        {/* Auth-level error (wrong credentials returned from server) */}
        {authError && (
          <div className="form-error" role="alert">
            <span className="form-error__icon" aria-hidden="true">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
            </span>
            {authError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form" noValidate>

          {/* Email field with inline validation */}
          <div className="field-group">
            <label htmlFor="lf-email" className="field-label">
              EMAIL ADDRESS <span style={{ color: 'var(--danger)' }}>*</span>
            </label>
            <div className={`field-input-wrap${fieldErrors.email ? ' field-input-wrap--error' : ''}`}>
              <span className="field-icon" aria-hidden="true">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                </svg>
              </span>
              <input
                id="lf-email" type="email" value={email}
                onChange={e => { setEmail(e.target.value); clearError('email') }}
                onBlur={validateEmail}
                placeholder="yourname@example.com"
                autoComplete="email"
                aria-describedby={fieldErrors.email ? 'lf-email-err' : undefined}
                aria-invalid={!!fieldErrors.email}
                className={`field-input${fieldErrors.email ? ' field-input--invalid' : ''}`}
              />
            </div>
            {/* Inline email error — shown after blur */}
            {fieldErrors.email && (
              <p id="lf-email-err" className="field-inline-error" role="alert">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                  <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                {fieldErrors.email}
              </p>
            )}
          </div>

          {/* Password field with inline validation */}
          <div className="field-group">
            <label htmlFor="lf-password" className="field-label">
              PASSWORD <span style={{ color: 'var(--danger)' }}>*</span>
            </label>
            <div className={`field-input-wrap${fieldErrors.password ? ' field-input-wrap--error' : ''}`}>
              <span className="field-icon" aria-hidden="true">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
              </span>
              <input
                id="lf-password"
                type={showPw ? 'text' : 'password'} value={password}
                onChange={e => { setPassword(e.target.value); clearError('password') }}
                onBlur={validatePassword}
                placeholder="Enter your Password"
                autoComplete="current-password"
                aria-describedby={fieldErrors.password ? 'lf-pw-err' : undefined}
                aria-invalid={!!fieldErrors.password}
                className={`field-input field-input--pw${fieldErrors.password ? ' field-input--invalid' : ''}`}
              />
              <button type="button" className="pw-toggle"
                onClick={() => setShowPw(s => !s)}
                aria-label={showPw ? 'Hide password' : 'Show password'}>
                {showPw
                  ? <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                  : <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                }
              </button>
            </div>
            {/* Inline password error — shown after blur */}
            {fieldErrors.password && (
              <p id="lf-pw-err" className="field-inline-error" role="alert">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                  <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                {fieldErrors.password}
              </p>
            )}
          </div>

          {/* Remember + Forgot */}
          <div className="form-meta">
            <label className="remember-label">
              <input type="checkbox" className="remember-check" />
              <span>Remember Me</span>
            </label>
            <a href="#/forgot-password" className="forgot-link">Forgot Password</a>
          </div>

          <Button type="submit" disabled={loading}
            style={{ width: '100%', justifyContent: 'center', padding: '15px', fontSize: 15, letterSpacing: '.5px', fontWeight: 700 }}>
            {loading ? 'Signing in…' : 'Login'}
          </Button>
        </form>

        <div className="form-divider"><span>or</span></div>
        <p className="form-help">Having Trouble Logging in?<br />Please contact your <strong>IT Support</strong></p>
        <p className="form-version">uniFITS v2.0</p>
      </div>
    </section>
  )
}
