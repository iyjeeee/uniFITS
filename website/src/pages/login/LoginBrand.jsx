// LoginBrand.jsx — Left branding panel with geometric decorations, stat pills, and feature list
export default function LoginBrand() {
  // features — bullet list rendered on the left panel; NO emoji, SVG icons only
  const features = [
    {
      text: 'Real-time Fund & Transaction Tracking',
      icon: (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
        </svg>
      ),
    },
    {
      text: 'Project and Club Financial Management',
      icon: (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>
        </svg>
      ),
    },
    {
      text: 'Audit Logs and Detailed Reports',
      icon: (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
        </svg>
      ),
    },
    {
      text: 'Multi-role Access & Member Directory',
      icon: (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
        </svg>
      ),
    },
  ]

  // stats — summary counter pills displayed beneath headline
  const stats = [
    { value: '₱140K+', label: 'Managed Funds' },
    { value: '12+',    label: 'Active Projects' },
    { value: '6',      label: 'Members' },
  ]

  return (
    // login-brand — dark left half, relative for decorative absolute children
    <aside className="login-brand">

      {/* brand-dots — dot-grid pattern overlay */}
      <div className="brand-dots" aria-hidden="true" />

      {/* brand-glow — radial glow accent in top-right corner */}
      <div className="brand-glow brand-glow--tr" aria-hidden="true" />
      <div className="brand-glow brand-glow--bl" aria-hidden="true" />

      {/* brand-ring — large overlapping circle decorations */}
      <div className="brand-ring brand-ring--lg" aria-hidden="true" />
      <div className="brand-ring brand-ring--sm" aria-hidden="true" />

      {/* brand-diagonal — subtle diagonal stripe accent */}
      <div className="brand-diagonal" aria-hidden="true" />

      {/* brand-noise — subtle grain overlay for texture */}
      <div className="brand-noise" aria-hidden="true" />

      {/* Brand content — sits above all decorative layers */}
      <div className="brand-content">

        {/* Logo row */}
        <div className="brand-logo">
          <div className="brand-logo__icon">uF</div>
          <div className="brand-logo__meta">
            <span className="brand-logo__system">FINANCIAL SYSTEM</span>
            <span className="brand-logo__name">uniFITS</span>
          </div>
        </div>

        {/* Main headline */}
        <div className="brand-headline">
          <h1 className="brand-headline__main">
            Manage your<br />Finances
          </h1>
          <span className="brand-headline__accent">with confidence.</span>
        </div>

        {/* Stat pills — quick summary numbers */}
        <div className="brand-stats">
          {stats.map((s, i) => (
            <div key={i} className="brand-stat" style={{ '--delay': `${i * 0.07}s` }}>
              <span className="brand-stat__value">{s.value}</span>
              <span className="brand-stat__label">{s.label}</span>
            </div>
          ))}
        </div>

        {/* Supporting description */}
        <p className="brand-sub">
          A unified platform for fund management, project tracking, transactions,
          and organization-wide financial visibility — built for every member.
        </p>

        {/* Feature list */}
        <ul className="brand-features" aria-label="Platform features">
          {features.map((f, i) => (
            <li key={i} className="brand-features__item" style={{ '--delay': `${i * 0.07 + 0.25}s` }}>
              <span className="brand-features__icon">{f.icon}</span>
              <span className="brand-features__text">{f.text}</span>
            </li>
          ))}
        </ul>

        {/* Footer */}
        <footer className="brand-footer">
          uniFITS &nbsp;·&nbsp; <strong>All Rights Reserved</strong>
        </footer>
      </div>
    </aside>
  )
}
