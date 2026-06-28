// AuditLogs.jsx — Clickable rows open detail modal; no separate Details column
// Responsive detail grid via useBreakpoint
import { useState } from 'react'
import { Card, InfoModal } from '../../components/ui'
import { MOCK_AUDIT_LOGS, formatDate, relativeTime } from '../../api/mockData'
import useBreakpoint from '../../hooks/useBreakpoint'
import type { AuditLog } from '../../types'

const ACTION_BG = {
  login:   '#2E7D52', logout:  '#5A6474', insert:  '#4B5EAA',
  update:  '#D4860A', delete:  '#C0392B', backup:  '#2471A3',
  restore: '#2471A3', export:  '#2471A3',
}
const ACTION_ACCENT = {
  login:   'var(--success)', logout:  'var(--text-secondary)', insert:  'var(--accent)',
  update:  'var(--warning)', delete:  'var(--danger)',         backup:  'var(--info)',
  restore: 'var(--info)',    export:  'var(--info)',
}
const ACTION_LIGHT = {
  login:   'var(--success-light)', insert:  'var(--accent-light)',
  update:  'var(--warning-light)', delete:  'var(--danger-light)',
  backup:  'var(--info-light)',    restore: 'var(--info-light)', export: 'var(--info-light)',
}

function ActionBadge({ action }: Record<string, any>) {
  return (
    <span style={{
      display: 'inline-flex' as const, alignItems: 'center',
      padding: '3px 10px', borderRadius: 20,
      background: (ACTION_BG as Record<string,string>)[action] || '#5A6474',
      color: '#fff', fontSize: 11.5, fontWeight: 700, letterSpacing: '.04em',
    }}>
      {action.charAt(0).toUpperCase() + action.slice(1)}
    </span>
  )
}

export default function AuditLogs() {
  const { isMobile } = useBreakpoint()
  const [data]    = useState(MOCK_AUDIT_LOGS)
  const [viewLog, setViewLog] = useState<AuditLog | null>(null)

  const summaryCounts = ['login', 'insert', 'update', 'delete', 'backup'].map(action => ({
    action, count: data.filter((l: any) => l.action === action).length,
  }))

  return (
    <div style={{ display: 'flex' as const, flexDirection: 'column' as const, gap: 14 }}>

      {/* Action summary chips */}
      <Card style={{ padding: '10px 18px' }}>
        <div style={{ display: 'flex' as const, alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' as const, letterSpacing: '.06em', marginRight: 6 }}>
            Action Summary
          </span>
          {summaryCounts.map(({ action, count }) => (
            <div key={action} style={{ display: 'flex' as const, alignItems: 'center', gap: 6, padding: '5px 12px', borderRadius: 20, background: 'var(--white)', border: '1.5px solid var(--border-card)', fontSize: 13 }}>
              <ActionBadge action={action} />
              <span style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: 14 }}>{count}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Table — entire row is clickable */}
      <Card>
        {/* Table header */}
        <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--border-inner)', display: 'flex' as const, alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>Audit Log Records</div>
            <div style={{ fontSize: 12.5, color: 'var(--text-muted)', marginTop: 2 }}>Click any row to view full details</div>
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{data.length} records</div>
        </div>

        <div style={{ overflowX: 'auto' as const }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ background: 'var(--table-head-bg)' }}>
                {['#', 'User', 'Action', 'Summary', 'Table', 'IP Address', 'Timestamp'].map((h: any) => (
                  <th key={h} style={{ padding: '10px 16px', textAlign: 'left' as const, fontSize: 11, fontWeight: 600, color: 'var(--table-head-fg)', textTransform: 'uppercase' as const, letterSpacing: '.06em', borderBottom: '2px solid var(--border-table)', whiteSpace: 'nowrap' as const }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((row, i) => (
                <tr
                  key={row.id}
                  onClick={() => setViewLog(row)}
                  style={{ borderBottom: '1px solid var(--border-inner)', cursor: 'pointer' as const, transition: 'background .1s' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--neutral-light)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                  <td style={{ padding: '11px 16px', color: 'var(--text-muted)', fontSize: 12 }}>{data.length - i}</td>
                  <td style={{ padding: '11px 16px', fontWeight: 600 }}>{row.user}</td>
                  <td style={{ padding: '11px 16px' }}><ActionBadge action={row.action} /></td>
                  <td style={{ padding: '11px 16px', color: 'var(--text-secondary)', maxWidth: 260, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const }}>{row.summary}</td>
                  <td style={{ padding: '11px 16px' }}><code style={{ fontSize: 11, background: 'var(--table-head-bg)', padding: '2px 7px', borderRadius: 4, color: 'var(--table-head-fg)' }}>{row.table_name}</code></td>
                  <td style={{ padding: '11px 16px', color: 'var(--text-muted)', fontSize: 12 }}>{row.ip_address}</td>
                  <td style={{ padding: '11px 16px' }}>
                    <div style={{ fontSize: 12.5 }}>{formatDate(row.created_at)}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 1 }}>{relativeTime(row.created_at)}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Log Detail InfoModal */}
      {viewLog && (
        <InfoModal
          open={!!viewLog}
          onClose={() => setViewLog(null)}
          title="Audit Log Detail"
          subtitle={`${viewLog.user} · ${relativeTime(viewLog.created_at)}`}
          accentColor={(ACTION_ACCENT as Record<string,string>)[viewLog.action] || 'var(--accent)'}
          footer={
            <button onClick={() => setViewLog(null)} style={{ padding: '10px 28px', borderRadius: 9, border: '1.5px solid var(--border-card)', background: 'var(--neutral-light)', color: 'var(--text-primary)', fontSize: 14, fontWeight: 600, cursor: 'pointer' as const, fontFamily: 'var(--font-body)' }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" style={{marginRight:4}}><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg> Close
            </button>
          }>
          <div style={{ display: 'flex' as const, flexDirection: 'column' as const, gap: 16 }}>
            <div style={{ padding: '16px 20px', borderRadius: 12, background: (ACTION_LIGHT as Record<string,string>)[viewLog.action] || 'var(--neutral-light)', border: '1.5px solid ' + ((ACTION_ACCENT as Record<string,string>)[viewLog.action] || 'var(--border-card)') + '40' }}>
              <div style={{ display: 'flex' as const, alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <ActionBadge action={viewLog.action} />
              </div>
              <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.5 }}>{viewLog.summary}</div>
            </div>
            {/* Detail grid — 2-col desktop, 1-col mobile */}
            <div style={{ display: 'grid' as const, gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 12 }}>
              {[
                ['Performed By',   viewLog.user],
                ['Action Type',    viewLog.action.charAt(0).toUpperCase() + viewLog.action.slice(1)],
                ['Affected Table', viewLog.table_name],
                ['IP Address',     viewLog.ip_address],
                ['Date',           formatDate(viewLog.created_at)],
                ['Relative Time',  relativeTime(viewLog.created_at)],
              ].map(([k, v]) => (
                <div key={k} style={{ padding: '12px 14px', borderRadius: 10, background: 'var(--neutral-light)', border: '1px solid var(--border-card)' }}>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase' as const, letterSpacing: '.07em', marginBottom: 4 }}>{k}</div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>{v}</div>
                </div>
              ))}
            </div>
            <div style={{ padding: '12px 14px', borderRadius: 10, background: 'var(--neutral-light)', border: '1px solid var(--border-card)' }}>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase' as const, letterSpacing: '.07em', marginBottom: 4 }}>Full Timestamp</div>
              <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>
                {new Date(viewLog.created_at).toLocaleString('en-PH', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </div>
            </div>
          </div>
        </InfoModal>
      )}
    </div>
  )
}
