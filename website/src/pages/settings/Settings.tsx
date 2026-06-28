// Settings.jsx — All 3 sections in one row: System | Labels | Security
// Responsive: 3-col desktop → 1-col mobile via useBreakpoint
import { useState } from 'react'
import { Card, Button, InfoModal, ResponseModal, SectionDivider } from '../../components/ui'
import { useOrg } from '../../context/OrgContext'
import useBreakpoint from '../../hooks/useBreakpoint'

const BACKUP_FREQ_OPTIONS = [
  { value: 'daily',   label: 'Daily'   },
  { value: 'weekly',  label: 'Weekly'  },
  { value: 'monthly', label: 'Monthly' },
]

function IcoWarn() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
      <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
    </svg>
  )
}

/* Compact inline input — consistent height, no unnecessary width stretch */
function CompactInput({ label, hint, ...props }: Record<string, any>) {
  return (
    <div style={{ display: 'flex' as const, flexDirection: 'column' as const, gap: 3 }}>
      {label && <label style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase' as const, letterSpacing: '.04em' }}>{label}</label>}
      <input
        {...props}
        style={{
          padding: '7px 10px', borderRadius: 7,
          border: '1.5px solid var(--border-card)',
          fontSize: 13, fontFamily: 'var(--font-body)',
          color: 'var(--text-primary)', background: props.disabled ? 'var(--neutral-light)' : '#fff',
          outline: 'none', boxSizing: 'border-box' as const, width: '100%',
        }}
        onFocus={e => { if (!props.disabled) e.target.style.borderColor = 'var(--accent)' }}
        onBlur={e  => { if (!props.disabled) e.target.style.borderColor = 'var(--border-card)' }}
      />
      {hint && <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{hint}</div>}
    </div>
  )
}

/* Compact select */
function CompactSelect({ label, options = [], ...props }: Record<string, any>) {
  return (
    <div style={{ display: 'flex' as const, flexDirection: 'column' as const, gap: 3 }}>
      {label && <label style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase' as const, letterSpacing: '.04em' }}>{label}</label>}
      <select
        {...props}
        style={{
          padding: '7px 10px', borderRadius: 7,
          border: '1.5px solid var(--border-card)',
          fontSize: 13, fontFamily: 'var(--font-body)',
          color: 'var(--text-primary)', background: '#fff',
          outline: 'none', cursor: 'pointer' as const, width: '100%', boxSizing: 'border-box' as const,
        }}>
        {options.map((o: any) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  )
}

/* Action button — compact width, centered text, solid color */
function ActionBtn({ children, variant = 'primary', onClick, icon, danger }: Record<string, any>) {
  const bg     = danger ? 'var(--danger)'  : variant === 'secondary' ? '#5A6474' : 'var(--accent)'
  const border = danger ? 'var(--danger)'  : variant === 'secondary' ? '#4A5264' : 'var(--accent)'
  return (
    <button onClick={onClick} style={{
      display: 'inline-flex' as const, alignItems: 'center', justifyContent: 'center', gap: 6,
      padding: '8px 16px', borderRadius: 8, border: '1.5px solid ' + border,
      background: bg, color: '#fff', fontSize: 12.5, fontWeight: 600,
      fontFamily: 'var(--font-body)', cursor: 'pointer' as const, whiteSpace: 'nowrap' as const,
      transition: 'opacity .15s', width: '100%', maxWidth: 200,
    }}>
      {icon && icon}{children}
    </button>
  )
}

export default function Settings() {
  const org = useOrg()
  const { isMobile, isTablet } = useBreakpoint()
  const settingsCols = isMobile || isTablet ? '1fr' : '1fr 1fr 1fr' // 3-col desktop, 1-col mobile

  const [systemName, setSystemName] = useState(org.name || 'uniFITS Organization')
  const [labels, setLabels] = useState<Record<string,any>>({
    people_label:      org.people_label,
    project_label:     org.project_label,
    event_label:       org.event_label,
    fund_label:        org.fund_label,
    transaction_label: org.transaction_label,
    utility_label:     org.utility_label,
    attendance_label:  org.attendance_label,
    report_label:      org.report_label,
  })
  const [security, setSecurity] = useState<Record<string,any>>({
    max_login_attempts:       5,
    lockout_duration_minutes: 30,
    session_timeout_minutes:  60,
    backup_frequency:         'daily',
    backup_retention_days:    30,
  })
  const [showWipeModal, setShowWipeModal] = useState(false)
  const [response,      setResponse]      = useState<{variant:string;title:string;message:string} | null>(null)

  const setLabel = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => setLabels((l: any) => ({ ...l, [k]: e.target.value }))
  const setSec = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => setSecurity((s: any) => ({ ...s, [k]: e.target.value }))

  const showOK = (title: string, message: string) => setResponse({ variant: 'success', title, message })
  const showWarn = (title: string, message: string) => setResponse({ variant: 'warning', title, message })
  const showErr = (title: string, message: string) => setResponse({ variant: 'danger',  title, message })

  function handleWipeAll() {
    setShowWipeModal(false)
    showErr('All Data Wiped', 'All club data has been permanently deleted. Core tables (settings, roles, members) remain intact.')
  }
  function handleWipeExceptCore() {
    setShowWipeModal(false)
    showWarn('Data Wiped (Core Kept)', 'All club activity data has been removed. Settings, roles, and member records are preserved.')
  }

  return (
    <div style={{ display: 'flex' as const, flexDirection: 'column' as const, gap: 14 }}>

      {/* ── ONE ROW: System Settings | Terminology Labels | Security Settings ── */}
      <div style={{ display: 'grid' as const, gridTemplateColumns: settingsCols, gap: 14, alignItems: 'stretch' }}>

        {/* ── COLUMN 1: System Settings ─────────────────────────────── */}
        <Card style={{ padding: '18px 20px', display: 'flex' as const, flexDirection: 'column' as const, gap: 0 }}>
          <SectionDivider label="System Settings" />
          <div style={{ display: 'flex' as const, flexDirection: 'column' as const, gap: 13, marginBottom: 18 }}>

            <CompactInput
              label="System Name"
              value={systemName}
              onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => setSystemName(e.target.value)}
            />
            <CompactInput
              label="Currency Symbol"
              value={org.currency_symbol}
              disabled
              hint="Contact support to change"
            />

            {/* Logo upload */}
            <div>
              <div style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase' as const, letterSpacing: '.04em', marginBottom: 6 }}>Logo</div>
              <div style={{ display: 'flex' as const, gap: 10, alignItems: 'center' }}>
                <div style={{ width: 36, height: 36, borderRadius: 8, background: 'var(--accent)', display: 'flex' as const, alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontSize: 14, color: '#fff', flexShrink: 0 }}>uF</div>
                <div style={{ flex: 1 }}>
                  <input type="file" accept="image/*" style={{ fontSize: 11.5, width: '100%' }} />
                  <div style={{ fontSize: 10.5, color: 'var(--text-muted)', marginTop: 2 }}>PNG or SVG</div>
                </div>
              </div>
            </div>
          </div>

          {/* Buttons — centered, reasonable width */}
          <div style={{ display: 'flex' as const, flexDirection: 'column' as const, gap: 8 }}>
            <ActionBtn onClick={() => showOK('Settings Saved', 'System settings have been updated successfully.')} icon={null}>
              Update Settings
            </ActionBtn>
            <ActionBtn danger onClick={() => setShowWipeModal(true)} icon={<IcoWarn />}>
              Wipe All Data
            </ActionBtn>
          </div>
        </Card>

        {/* ── COLUMN 2: Terminology Labels ──────────────────────────── */}
        <Card style={{ padding: '18px 20px', display: 'flex' as const, flexDirection: 'column' as const, gap: 0 }}>
          <SectionDivider label="Terminology Labels" />
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 12 }}>
            Customize labels for your organization.
          </div>
          <div style={{ display: 'flex' as const, flexDirection: 'column' as const, gap: 9, marginBottom: 18 }}>
            {[
              ['people_label',      'People / Members'],
              ['project_label',     'Project'],
              ['event_label',       'Event'],
              ['fund_label',        'Fund'],
              ['transaction_label', 'Transaction'],
              ['utility_label',     'Utility'],
              ['attendance_label',  'Attendance'],
              ['report_label',      'Report'],
            ].map(([k, label]) => (
              <div key={k} style={{ display: 'grid' as const, gridTemplateColumns: '110px 1fr', gap: 8, alignItems: 'center' }}>
                <label style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-secondary)' }}>{label}</label>
                <input
                  value={labels[k]}
                  onChange={setLabel(k)}
                  style={{
                    padding: '6px 9px', borderRadius: 6,
                    border: '1.5px solid var(--border-card)',
                    fontSize: 12.5, fontFamily: 'var(--font-body)',
                    color: 'var(--text-primary)', background: '#fff',
                    outline: 'none', boxSizing: 'border-box' as const,
                  }}
                  onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                  onBlur={e  => e.target.style.borderColor = 'var(--border-card)'}
                />
              </div>
            ))}
          </div>
          <ActionBtn onClick={() => showOK('Labels Saved', 'Terminology labels have been updated throughout the system.')}>
            Save Labels
          </ActionBtn>
        </Card>

        {/* ── COLUMN 3: Security Settings ────────────────────────────── */}
        <Card style={{ padding: '18px 20px', display: 'flex' as const, flexDirection: 'column' as const, gap: 0 }}>
          <SectionDivider label="Security Settings" />
          <div style={{ display: 'flex' as const, flexDirection: 'column' as const, gap: 13, marginBottom: 18 }}>
            <CompactInput
              label="Max Login Attempts"
              type="number"
              value={security.max_login_attempts}
              onChange={setSec('max_login_attempts')}
              hint="Failed attempts before lockout"
            />
            <CompactInput
              label="Lockout Duration (min)"
              type="number"
              value={security.lockout_duration_minutes}
              onChange={setSec('lockout_duration_minutes')}
              hint="How long a lockout lasts"
            />
            <CompactInput
              label="Session Timeout (min)"
              type="number"
              value={security.session_timeout_minutes}
              onChange={setSec('session_timeout_minutes')}
              hint="Auto-logout after inactivity"
            />
            <CompactSelect
              label="Backup Frequency"
              value={security.backup_frequency}
              onChange={setSec('backup_frequency')}
              options={BACKUP_FREQ_OPTIONS}
            />
            <CompactInput
              label="Backup Retention (days)"
              type="number"
              value={security.backup_retention_days}
              onChange={setSec('backup_retention_days')}
            />
          </div>
          <ActionBtn onClick={() => showOK('Security Settings Saved', 'Security and session settings have been updated successfully.')}>
            Save Security Settings
          </ActionBtn>
        </Card>
      </div>

      {/* ── Wipe All Data InfoModal ─────────────────────────────────── */}
      <InfoModal
        open={showWipeModal}
        onClose={() => setShowWipeModal(false)}
        title="Wipe All Data"
        subtitle="Choose what to wipe — this action cannot be undone"
        accentColor="var(--danger)"
        footer={<Button variant="secondary" onClick={() => setShowWipeModal(false)}>Close</Button>}>
        <div style={{ display: 'flex' as const, flexDirection: 'column' as const, gap: 16 }}>
          <div style={{ padding: '12px 16px', borderRadius: 10, background: '#fdecea', border: '1.5px solid rgba(192,57,43,.3)', display: 'flex' as const, gap: 10, alignItems: 'flex-start' }}>
            <span style={{ color: 'var(--danger)', flexShrink: 0, marginTop: 1 }}><IcoWarn /></span>
            <div style={{ fontSize: 13.5, color: 'var(--danger)', fontWeight: 600, lineHeight: 1.55 }}>
              This action is permanent and cannot be reversed. Please choose carefully.
            </div>
          </div>
          <div style={{ padding: '18px 20px', borderRadius: 12, border: '2px solid rgba(192,57,43,.35)', background: 'rgba(192,57,43,.03)' }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--danger)', marginBottom: 8 }}>Wipe ALL Data</div>
            <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.65, marginBottom: 14 }}>
              Permanently deletes <strong>everything</strong> — attendances, events, projects, transactions, funds, audit logs, settings, roles, and member records.<br />
              <strong style={{ color: 'var(--danger)' }}>Nothing is preserved. This is a full system reset.</strong>
            </div>
            <Button variant="danger" onClick={handleWipeAll}>Wipe ALL Data (Full Reset)</Button>
          </div>
          <div style={{ padding: '18px 20px', borderRadius: 12, border: '2px solid rgba(212,134,10,.35)', background: 'rgba(212,134,10,.03)' }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--warning)', marginBottom: 8 }}>Wipe All Data — Except Core Tables</div>
            <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.65, marginBottom: 14 }}>
              Deletes all club activity data but <strong>preserves</strong> core tables: settings, roles, permissions, and member records.<br />
              <strong style={{ color: 'var(--warning)' }}>Recommended for year-end reset or demo refresh.</strong>
            </div>
            <Button onClick={handleWipeExceptCore} style={{ background: 'var(--warning)', color: '#fff', border: 'none' }}>
              Wipe Data (Keep Core Tables)
            </Button>
          </div>
        </div>
      </InfoModal>

      {/* ── Response modal ──────────────────────────────────────────── */}
      <ResponseModal
        open={!!response}
        onClose={() => setResponse(null)}
        variant={(response?.variant || 'success') as import('../../types').ModalVariant || 'success'}
        title={response?.title   || ''}
        message={response?.message || ''}
        confirmLabel="Got it"
      />
    </div>
  )
}
