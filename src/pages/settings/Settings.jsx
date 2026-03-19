// Settings.jsx — System settings: org info, labels, security, wipe data
import { useState } from 'react'
import { Card, CardHeader, Button, Input, Select, SectionDivider } from '../../components/ui'
import { useOrg } from '../../context/OrgContext'

const BACKUP_FREQ_OPTIONS = [
  { value: 'daily',   label: 'Daily'   },
  { value: 'weekly',  label: 'Weekly'  },
  { value: 'monthly', label: 'Monthly' },
]

// Warning icon — no emoji
function IconWarn() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
      <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
    </svg>
  )
}

export default function Settings() {
  const org = useOrg()
  const [systemName, setSystemName] = useState(org.name || 'uniFITS Organization')
  const [labels, setLabels] = useState({
    people_label:      org.people_label,
    project_label:     org.project_label,
    event_label:       org.event_label,
    fund_label:        org.fund_label,
    transaction_label: org.transaction_label,
    utility_label:     org.utility_label,
    attendance_label:  org.attendance_label,
    report_label:      org.report_label,
  })
  const [security, setSecurity] = useState({
    max_login_attempts:       5,
    lockout_duration_minutes: 30,
    session_timeout_minutes:  60,
    backup_frequency:         'daily',
    backup_retention_days:    30,
  })
  const [showWipeConfirm, setShowWipeConfirm] = useState(false)

  const setLabel = k => e => setLabels(l => ({ ...l, [k]: e.target.value }))
  const setSec   = k => e => setSecurity(s => ({ ...s, [k]: e.target.value }))

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

      {/* Top row — system config + danger zone */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, alignItems: 'flex-start' }}>

        {/* System settings */}
        <Card style={{ padding: 22 }}>
          <SectionDivider label="System Settings" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <Input label="System Name" value={systemName} onChange={e => setSystemName(e.target.value)} />
            <div>
              <label style={{ fontSize: 12.5, fontWeight: 500, color: 'var(--text-secondary)', display: 'block', marginBottom: 5 }}>Logo</label>
              <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                <div style={{ width: 48, height: 48, borderRadius: 10, background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontSize: 18, color: '#fff', flexShrink: 0 }}>uF</div>
                <div>
                  <input type="file" accept="image/*" style={{ fontSize: 12.5 }} />
                  <div style={{ fontSize: 11.5, color: 'var(--text-muted)', marginTop: 3 }}>PNG or SVG recommended</div>
                </div>
              </div>
            </div>
            <Input label="Currency Symbol" value={org.currency_symbol} disabled hint="Contact support to change currency" />
            <Button onClick={() => alert('Settings saved!')}>Update Settings</Button>
          </div>
        </Card>

        {/* Danger zone — data wipe */}
        <Card style={{ padding: 20, border: '1px solid rgba(192,57,43,.3)', background: 'rgba(192,57,43,.03)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--danger)', fontWeight: 700, fontSize: 13.5, marginBottom: 10 }}>
            <IconWarn />
            What does "Wipe All Data" do?
          </div>
          <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.65, marginBottom: 14 }}>
            This action permanently deletes almost all data in the system, except core tables.<br /><br />
            <strong>All club data</strong> (attendances, events, projects, transactions, funds, logs) will be erased.<br /><br />
            <strong>Core tables</strong> (settings, permissions, roles, member records) will NOT be deleted.<br /><br />
            Useful for resetting for a new year, demo, or after testing.<br />
            <strong style={{ color: 'var(--danger)' }}>This cannot be undone!</strong>
          </div>
          {!showWipeConfirm
            ? <Button variant="danger" onClick={() => setShowWipeConfirm(true)}>Wipe All Data (Except Core Tables)</Button>
            : (
              <div style={{ background: 'var(--white)', padding: 14, borderRadius: 8, border: '1px solid var(--danger)' }}>
                <div style={{ fontSize: 13.5, fontWeight: 600, marginBottom: 10, color: 'var(--danger)' }}>Are you absolutely sure? This CANNOT be undone.</div>
                <div style={{ display: 'flex', gap: 10 }}>
                  <Button variant="secondary" onClick={() => setShowWipeConfirm(false)}>Cancel</Button>
                  <Button variant="danger" onClick={() => { alert('Data wiped! (Backend only)'); setShowWipeConfirm(false) }}>Yes, Wipe Everything</Button>
                </div>
              </div>
            )
          }
        </Card>
      </div>

      {/* Terminology labels */}
      <Card style={{ padding: 22 }}>
        <SectionDivider label="Terminology Labels" />
        <div style={{ marginBottom: 14, fontSize: 13, color: 'var(--text-muted)' }}>
          Customize what the system calls people, projects, events, and other entities.
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: 14, marginBottom: 18 }}>
          {[
            ['people_label',      'People / Members Label'],
            ['project_label',     'Project Label'],
            ['event_label',       'Event Label'],
            ['fund_label',        'Fund Label'],
            ['transaction_label', 'Transaction Label'],
            ['utility_label',     'Utility Label'],
            ['attendance_label',  'Attendance Label'],
            ['report_label',      'Report Label'],
          ].map(([k, label]) => (
            <Input key={k} label={label} value={labels[k]} onChange={setLabel(k)} />
          ))}
        </div>
        <Button onClick={() => alert('Labels updated!')}>Save Labels</Button>
      </Card>

      {/* Security settings */}
      <Card style={{ padding: 22 }}>
        <SectionDivider label="Security & Session Settings" />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: 14, marginBottom: 18 }}>
          <Input label="Max Login Attempts"    type="number" value={security.max_login_attempts}       onChange={setSec('max_login_attempts')}       hint="Failed attempts before lockout" />
          <Input label="Lockout Duration (min)" type="number" value={security.lockout_duration_minutes} onChange={setSec('lockout_duration_minutes')} hint="How long a lockout lasts" />
          <Input label="Session Timeout (min)"  type="number" value={security.session_timeout_minutes}  onChange={setSec('session_timeout_minutes')}  hint="Auto-logout after inactivity" />
          <Select label="Backup Frequency"       value={security.backup_frequency}                       onChange={setSec('backup_frequency')}         options={BACKUP_FREQ_OPTIONS} />
          <Input label="Backup Retention (days)" type="number" value={security.backup_retention_days}   onChange={setSec('backup_retention_days')} />
        </div>
        <Button onClick={() => alert('Security settings saved!')}>Save Security Settings</Button>
      </Card>
    </div>
  )
}
