// parts/AttendanceMemberCard.tsx — One member with a status dropdown
import { useState } from 'react'
import { IcoCheck, IcoX } from './AttendanceIcons'
import type { MarkStatus, MemberRow, StatusChangeHandler } from './attendanceShared'
import { STATUS_COLOR, STATUS_BG } from './attendanceShared'

/* ── MemberCard — individual member with dropdown + status ──────── */
interface MemberCardProps { member: MemberRow; num: number; onStatusChange: StatusChangeHandler }
export default function MemberCard({ member, num, onStatusChange }: MemberCardProps) {
  const [open, setOpen] = useState(false)  // dropdown open state
  const status   = member.status          // 'present' | 'absent' | null (no record)
  const sKey     = status || 'no-record'
  const color    = STATUS_COLOR[sKey]
  const bg       = STATUS_BG[sKey]
  const label    = status ? (status.charAt(0).toUpperCase() + status.slice(1)) : 'No Record'

  return (
    <div style={{
      padding: '10px 12px', borderRadius: 10, position: 'relative' as const,
      background: bg, border: `1.5px solid ${color}40`,
      display: 'flex' as const, flexDirection: 'column' as const, gap: 7,
    }}>
      {/* Number + name */}
      <div style={{ display: 'flex' as const, alignItems: 'flex-start', gap: 8 }}>
        <div style={{ width: 22, height: 22, borderRadius: '50%', flexShrink: 0, background: color, color: '#fff', display: 'flex' as const, alignItems: 'center', justifyContent: 'center', fontSize: 10.5, fontWeight: 800 }}>
          {num}
        </div>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 12.5, fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const, color: 'var(--text-primary)' }}>
            {member.name}
          </div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 1 }}>{member.role}</div>
        </div>
      </div>

      {/* Status dropdown trigger */}
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: '100%', padding: '4px 8px', borderRadius: 7, cursor: 'pointer' as const,
          border: `1.5px solid ${color}60`, background: '#fff',
          display: 'flex' as const, alignItems: 'center', justifyContent: 'space-between',
          fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 600, color,
        }}>
        <span>{label}</span>
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform .15s' }}>
          <polyline points="6 9 12 15 18 9"/>
        </svg>
      </button>

      {/* Dropdown options */}
      {open && (
        <div style={{
          position: 'absolute' as const, top: '100%', left: 0, right: 0, zIndex: 50,
          background: '#fff', border: '1.5px solid var(--border-card)',
          borderRadius: 8, boxShadow: '0 4px 12px rgba(0,0,0,.12)',
          overflow: 'hidden', marginTop: 2,
        }}>
          {([
            { value: 'present', label: 'Present', color: '#2E7D52', bg: '#f0faf4' },
            { value: 'absent',  label: 'Absent',  color: '#C0392B', bg: '#fdf3f2' },
          ] as { value: MarkStatus; label: string; color: string; bg: string }[]).map(opt => (
            <button
              key={opt.value}
              onClick={() => { onStatusChange(member.userId, opt.value); setOpen(false) }}
              style={{
                width: '100%', padding: '8px 12px', cursor: 'pointer' as const,
                border: 'none', background: opt.value === status ? opt.bg : '#fff',
                display: 'flex' as const, alignItems: 'center', gap: 8,
                fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 600, color: opt.color,
                transition: 'background .1s',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = opt.bg }}
              onMouseLeave={e => { e.currentTarget.style.background = opt.value === status ? opt.bg : '#fff' }}>
              {opt.value === 'present' ? <IcoCheck /> : <IcoX />}
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
