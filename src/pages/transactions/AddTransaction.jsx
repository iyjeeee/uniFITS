// AddTransaction.jsx — 3-col layout: StepSidebar | Form | Live Preview
// Steps 1 (Payment), 2 (Entry Type), 3 (Category) now use the same
// card-style toggle button layout as Step 0 (Source) for UI consistency.
import { useState } from 'react'
import { Card, Button, Input, Select, Textarea, SectionDivider } from '../../components/ui'
import { MOCK_USERS, MOCK_FUNDS, MOCK_PROJECTS, MOCK_EVENTS, MOCK_PAYMENT_METHODS } from '../../api/mockData'
import { useOrg } from '../../context/OrgContext'
import useBreakpoint from '../../hooks/useBreakpoint'

/* ── SVG icons for ToggleCards — no emojis ──────────────────────── */
const IcoMember   = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
const IcoOfficer  = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
const IcoGlobe    = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
const IcoCash     = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
const IcoPhone    = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>
const IcoBank     = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="22" x2="21" y2="22"/><line x1="6" y1="18" x2="6" y2="11"/><line x1="10" y1="18" x2="10" y2="11"/><line x1="14" y1="18" x2="14" y2="11"/><line x1="18" y1="18" x2="18" y2="11"/><polygon points="12 2 20 7 4 7"/></svg>
const IcoCard     = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
const IcoCheque   = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
const IcoContrib  = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg>
const IcoIncome   = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
const IcoExpense  = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 18 13.5 8.5 8.5 13.5 1 6"/><polyline points="17 18 23 18 23 12"/></svg>
const IcoFund     = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
const IcoProject  = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>
const IcoEvent    = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
const IcoUtility  = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14"/></svg>


const STEPS = ['Source', 'Payment', 'Entry Type', 'Category', 'Amount', 'Review']

/* ── StepSidebar — vertical step indicator ──────────────────────── */
function StepSidebar({ steps, current }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      {steps.map((label, i) => {
        const done = i < current, active = i === current
        return (
          <div key={i} style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '10px 14px', borderRadius: 9,
            background: active ? 'var(--accent-light)' : done ? 'var(--success-light)' : 'transparent',
            border: '1.5px solid ' + (active ? 'rgba(75,94,170,.3)' : done ? 'rgba(46,125,82,.2)' : 'var(--border-card)'),
          }}>
            <div style={{ width: 26, height: 26, borderRadius: '50%', background: done ? '#2E7D52' : active ? 'var(--accent)' : 'var(--border-card)', color: done || active ? '#fff' : 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11.5, fontWeight: 700, flexShrink: 0 }}>
              {done ? '✓' : i + 1}
            </div>
            <span style={{ fontSize: 13, fontWeight: active ? 700 : done ? 600 : 400, color: active ? 'var(--accent)' : done ? 'var(--success)' : 'var(--text-muted)' }}>
              {label}
            </span>
          </div>
        )
      })}
    </div>
  )
}

/* ── ToggleCard — reusable card-style toggle button (used for ALL choice steps) ──
   Same visual language as the Source step: bordered card, highlight on selection.   */
function ToggleCard({ label, sublabel, icon, value, current, onClick }) {
  const active = current === value
  return (
    <button
      onClick={() => onClick(value)}
      style={{
        flex: 1, minWidth: 0, padding: '14px 12px', borderRadius: 12, cursor: 'pointer',
        fontFamily: 'var(--font-body)', textAlign: 'left',
        border: `2px solid ${active ? 'var(--accent)' : 'var(--border-card)'}`,
        background: active ? 'var(--accent-light)' : 'var(--white)',
        transition: 'all .15s', display: 'flex', flexDirection: 'column', gap: 4,
      }}>
      <div style={{ fontSize: 18, lineHeight: 1 }}>{icon}</div>
      <div style={{ fontSize: 13.5, fontWeight: 700, color: active ? 'var(--accent)' : 'var(--text-primary)', marginTop: 2 }}>
        {label}
      </div>
      {sublabel && (
        <div style={{ fontSize: 12, color: active ? 'var(--accent)' : 'var(--text-muted)', lineHeight: 1.4 }}>
          {sublabel}
        </div>
      )}
    </button>
  )
}

/* ── LivePreview — right panel showing current form values ─────── */
function LivePreview({ form, org }) {
  const cap            = s => s ? s.charAt(0).toUpperCase() + s.slice(1) : '—'
  const selectedUser   = MOCK_USERS.find(u => u.id === form.user_id)
  const selectedMethod = MOCK_PAYMENT_METHODS.find(m => m.id === form.payment_method_id)
  const selectedFund   = MOCK_FUNDS.find(f => f.id === form.fund_id)
  return (
    <div>
      <div style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '.07em', marginBottom: 14 }}>Live Preview</div>
      {[
        ['Source',          cap(form.source)],
        ['Member / Person', selectedUser?.full_name    || '—'],
        ['Payment Method',  selectedMethod?.name       || '—'],
        ['Entry Type',      cap(form.entry_type)],
        ['Category',        cap(form.category)],
        ['Fund',            selectedFund?.name         || '—'],
        ['Amount',          form.amount ? `${org.currency_symbol}${form.amount}` : '—'],
        ['Notes',           form.notes || '—'],
      ].map(([k, v]) => (
        <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 0', borderBottom: '1px solid var(--border-inner)', fontSize: 12.5, gap: 8 }}>
          <span style={{ color: 'var(--text-muted)', flexShrink: 0 }}>{k}</span>
          <span style={{ color: v && v !== '—' ? 'var(--text-primary)' : 'var(--border-card)', fontWeight: v && v !== '—' ? 500 : 400, textAlign: 'right' }}>{v}</span>
        </div>
      ))}
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════════════════════════ */
export default function AddTransaction() {
  const org = useOrg()
  const { isMobile } = useBreakpoint()

  const [step, setStep] = useState(0)
  const [form, setForm] = useState({
    source: '', user_id: '', payment_method_id: '',
    entry_type: '', category: '', activity_id: '',
    fund_id: '', amount: '', notes: '',
  })
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }))

  const userOptions    = MOCK_USERS.map(u => ({ value: u.id, label: u.full_name }))
  const fundOptions    = MOCK_FUNDS.map(f => ({ value: f.id, label: f.name }))
  const projectOptions = MOCK_PROJECTS.map(p => ({ value: p.id, label: p.title }))
  const eventOptions   = MOCK_EVENTS.map(e => ({ value: e.id, label: e.title }))
  const activityOptions = form.category === 'project' ? projectOptions
                        : form.category === 'event'   ? eventOptions : []

  return (
    <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '200px 1fr 240px', gap: 14, alignItems: 'stretch' }}>

      {/* LEFT — Step sidebar */}
      <Card style={{ padding: '18px 14px' }}>
        <div style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '.07em', marginBottom: 12 }}>Steps</div>
        <StepSidebar steps={STEPS} current={step} />
      </Card>

      {/* MIDDLE — Form */}
      <Card style={{ padding: 24 }}>

        {/* ── Step 0: Source — who is this from? ──────────────── */}
        {step === 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <SectionDivider label="Transaction Source" />
            <p style={{ margin: 0, fontSize: 13.5, color: 'var(--text-muted)' }}>Who is this transaction from?</p>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <ToggleCard icon={<IcoMember />} label={org.people_label}   sublabel="Regular member contribution"  value="member"   current={form.source} onClick={v => setForm(f => ({ ...f, source: v, user_id: '' }))} />
              <ToggleCard icon={<IcoOfficer />} label="Officer"             sublabel="Officer or admin transaction" value="officer"  current={form.source} onClick={v => setForm(f => ({ ...f, source: v, user_id: '' }))} />
              <ToggleCard icon={<IcoGlobe />} label="External / Sponsor"  sublabel="Outside donor or sponsor"     value="external" current={form.source} onClick={v => setForm(f => ({ ...f, source: v, user_id: '' }))} />
            </div>
            {(form.source === 'member' || form.source === 'officer') && (
              <Select label={`Select ${org.people_label}`} value={form.user_id} onChange={set('user_id')} options={userOptions} placeholder="-- Choose member --" />
            )}
          </div>
        )}

        {/* ── Step 1: Payment Method — card toggle layout ─────── */}
        {step === 1 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <SectionDivider label="Payment Method" />
            <p style={{ margin: 0, fontSize: 13.5, color: 'var(--text-muted)' }}>How was this payment made?</p>
            {/* 2-col grid for payment method cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 10 }}>
              {MOCK_PAYMENT_METHODS.map(m => {
                const icons = { 'Cash': <IcoCash />, 'GCash': <IcoPhone />, 'Bank Transfer': <IcoBank />, 'PayMaya': <IcoCard />, 'Cheque': <IcoCheque /> }
                const subs  = { 'Cash': 'Physical cash handover', 'GCash': 'GCash mobile wallet', 'Bank Transfer': 'Direct bank deposit', 'PayMaya': 'PayMaya e-wallet', 'Cheque': 'Cheque payment' }
                return (
                  <ToggleCard
                    key={m.id}
                    icon={icons[m.name] || <IcoCard />}
                    label={m.name}
                    sublabel={subs[m.name] || ''}
                    value={m.id}
                    current={form.payment_method_id}
                    onClick={v => setForm(f => ({ ...f, payment_method_id: v }))}
                  />
                )
              })}
            </div>
          </div>
        )}

        {/* ── Step 2: Entry Type — card toggle layout ──────────── */}
        {step === 2 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <SectionDivider label="Entry Type" />
            <p style={{ margin: 0, fontSize: 13.5, color: 'var(--text-muted)' }}>What type of financial entry is this?</p>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <ToggleCard icon={<IcoContrib />} label="Contribution" sublabel="Member paying into a fund"     value="contribution" current={form.entry_type} onClick={v => setForm(f => ({ ...f, entry_type: v }))} />
              <ToggleCard icon={<IcoIncome  />} label="Income"       sublabel="External money received"       value="income"       current={form.entry_type} onClick={v => setForm(f => ({ ...f, entry_type: v }))} />
              <ToggleCard icon={<IcoExpense />} label="Expense"      sublabel="Money paid out or spent"       value="expense"      current={form.entry_type} onClick={v => setForm(f => ({ ...f, entry_type: v }))} />
            </div>
          </div>
        )}

        {/* ── Step 3: Category — card toggle layout ────────────── */}
        {step === 3 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <SectionDivider label="Category & Activity" />
            <p style={{ margin: 0, fontSize: 13.5, color: 'var(--text-muted)' }}>What does this transaction belong to?</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 10 }}>
              <ToggleCard icon={<IcoFund />}    label={`${org.fund_label}`}              sublabel="Fund or wallet transaction"     value="fund"    current={form.category} onClick={v => setForm(f => ({ ...f, category: v, activity_id: '', fund_id: '' }))} />
              <ToggleCard icon={<IcoProject />} label={`${org.project_label}`}           sublabel="Project-related transaction"    value="project" current={form.category} onClick={v => setForm(f => ({ ...f, category: v, activity_id: '', fund_id: '' }))} />
              <ToggleCard icon={<IcoEvent />}   label={`${org.event_label}`}             sublabel="Event-related transaction"      value="event"   current={form.category} onClick={v => setForm(f => ({ ...f, category: v, activity_id: '', fund_id: '' }))} />
              <ToggleCard icon={<IcoUtility />} label={`${org.utility_label || 'Utility'}`} sublabel="Operational expense"         value="utility" current={form.category} onClick={v => setForm(f => ({ ...f, category: v, activity_id: '', fund_id: '' }))} />
            </div>
            {/* Secondary selectors when a sub-item is needed */}
            {form.category === 'fund' && (
              <Select label={`Select ${org.fund_label}`} value={form.fund_id} onChange={set('fund_id')} options={fundOptions} placeholder="-- Select fund --" />
            )}
            {['project', 'event'].includes(form.category) && (
              <Select label="Select Activity" value={form.activity_id} onChange={set('activity_id')} options={activityOptions} placeholder="-- Select activity --" />
            )}
          </div>
        )}

        {/* ── Step 4: Amount & Notes ────────────────────────────── */}
        {step === 4 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <SectionDivider label="Amount & Notes" />
            <Input label={`Amount (${org.currency_symbol})`} type="number" value={form.amount} onChange={set('amount')} placeholder="0.00" required />
            <Textarea label="Additional Notes" value={form.notes} onChange={set('notes')} placeholder="Optional notes or remarks" rows={3} />
          </div>
        )}

        {/* ── Step 5: Review ───────────────────────────────────── */}
        {step === 5 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <SectionDivider label="Review Transaction" />
            {(() => {
              const selectedMethod = MOCK_PAYMENT_METHODS.find(m => m.id === form.payment_method_id)
              const selectedUser   = MOCK_USERS.find(u => u.id === form.user_id)
              const selectedFund   = MOCK_FUNDS.find(f => f.id === form.fund_id)
              const cap = s => s ? s.charAt(0).toUpperCase() + s.slice(1) : '—'
              return [
                ['Source',         cap(form.source)],
                ['Member / Person',selectedUser?.full_name || (form.source === 'external' ? 'External' : '—')],
                ['Payment Method', selectedMethod?.name   || '—'],
                ['Entry Type',     cap(form.entry_type)],
                ['Category',       cap(form.category)],
                ['Fund',           selectedFund?.name     || '—'],
                ['Amount',         form.amount ? `${org.currency_symbol}${form.amount}` : '—'],
                ['Notes',          form.notes || '—'],
              ].map(([k, v]) => (
                <div key={k} style={{ display: 'flex', gap: 16, padding: '9px 0', borderBottom: '1px solid var(--border-inner)', fontSize: 13.5 }}>
                  <div style={{ width: 160, color: 'var(--text-muted)', flexShrink: 0 }}>{k}</div>
                  <div style={{ fontWeight: 500, textTransform: 'capitalize' }}>{v}</div>
                </div>
              ))
            })()}
          </div>
        )}

        {/* Navigation */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 28 }}>
          <Button variant="secondary" onClick={() => setStep(s => Math.max(0, s - 1))} disabled={step === 0}>← Back</Button>
          {step < STEPS.length - 1
            ? <Button onClick={() => setStep(s => s + 1)}>Continue →</Button>
            : <Button variant="success" onClick={() => alert('Transaction recorded!')}>✓ Record {org.transaction_label}</Button>
          }
        </div>
      </Card>

      {/* RIGHT — Live Preview (hidden on mobile) */}
      {!isMobile && (
        <Card style={{ padding: 20 }}>
          <LivePreview form={form} org={org} />
        </Card>
      )}
    </div>
  )
}
