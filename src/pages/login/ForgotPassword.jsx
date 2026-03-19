// ForgotPassword.jsx — Password reset request page; matches new split-panel login style
import { useState } from 'react'
import { Button }   from '../../components/ui'
import './login.css'

export default function ForgotPassword() {
  const [email,   setEmail]   = useState('')
  const [sent,    setSent]    = useState(false)
  const [loading, setLoading] = useState(false)

  function handleSubmit(e) {
    e.preventDefault()
    if (!email) return
    setLoading(true)
    // Simulate POST /api/auth/forgot-password — replace with real API call
    setTimeout(() => { setLoading(false); setSent(true) }, 1000)
  }

  return (
    <div className="login-root">

      {/* Left brand side — reused from login aesthetic */}
      <aside className="login-brand">
        <div className="brand-dots"         aria-hidden="true" />
        <div className="brand-glow brand-glow--tr" aria-hidden="true" />
        <div className="brand-glow brand-glow--bl" aria-hidden="true" />
        <div className="brand-ring brand-ring--lg" aria-hidden="true" />
        <div className="brand-ring brand-ring--sm" aria-hidden="true" />
        <div className="brand-diagonal"     aria-hidden="true" />
        <div className="brand-noise"        aria-hidden="true" />

        <div className="brand-content">
          {/* Logo */}
          <div className="brand-logo">
            <div className="brand-logo__icon">uF</div>
            <div className="brand-logo__meta">
              <span className="brand-logo__system">FINANCIAL SYSTEM</span>
              <span className="brand-logo__name">uniFITS</span>
            </div>
          </div>

          {/* Headline */}
          <div className="brand-headline">
            <h1 className="brand-headline__main">Secure<br />Account</h1>
            <span className="brand-headline__accent">recovery.</span>
          </div>

          <p className="brand-sub">
            Enter your registered email address and we'll send you
            a secure link to reset your password.
          </p>

          <footer className="brand-footer">
            uniFITS &nbsp;·&nbsp; <strong>All Rights Reserved</strong>
          </footer>
        </div>
      </aside>

      {/* Right form side */}
      <section className="login-form-panel">
        <div className="form-inner">

          {/* Eyebrow */}
          <p className="form-eyebrow">
            <span className="form-eyebrow__bar" aria-hidden="true" />
            {sent ? 'EMAIL SENT' : 'RESET PASSWORD'}
          </p>

          {/* Heading */}
          <h2 className="form-heading">
            {sent ? 'Check your\nInbox' : 'Forgot your\nPassword?'}
          </h2>

          {/* Subtitle */}
          <p className="form-sub">
            {sent
              ? `We sent a reset link to ${email}. Check your inbox and follow the instructions.`
              : 'Enter your email address to receive a password reset link.'}
          </p>

          {/* Reset form */}
          {!sent && (
            <form onSubmit={handleSubmit} className="auth-form" noValidate>
              <div className="field-group">
                <label htmlFor="fp-email" className="field-label">EMAIL ADDRESS</label>
                <div className="field-input-wrap">
                  {/* Envelope icon */}
                  <span className="field-icon" aria-hidden="true">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="4" width="20" height="16" rx="2"/>
                      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                    </svg>
                  </span>
                  <input
                    id="fp-email"
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="yourname@example.com"
                    required
                    autoComplete="email"
                    className="field-input"
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                style={{ width: '100%', justifyContent: 'center', padding: '13px', fontSize: 15, letterSpacing: '.5px', fontWeight: 700 }}
              >
                {loading ? 'Sending…' : 'Send Reset Link'}
              </Button>
            </form>
          )}

          <div className="form-divider"><span>or</span></div>

          <p style={{ textAlign: 'center', fontSize: 13.5 }}>
            <a href="#/login" className="forgot-link">&#8592; Back to Sign In</a>
          </p>

          <p className="form-version">uniFITS v2.0</p>
        </div>
      </section>
    </div>
  )
}
