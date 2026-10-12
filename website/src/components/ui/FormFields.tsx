// components/ui/FormFields.tsx — Input, Select, Textarea
import type { CSSProperties, InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes } from 'react'

// ── Input ─────────────────────────────────────────────────────────────────────
interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?:    string
  hint?:     string
  error?:    string
  required?: boolean
  style?:    CSSProperties
}
export function Input({ label, hint, error, required, style, ...props }: InputProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4, ...style }}>
      {label && (
        <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)' }}>
          {label}{required && <span style={{ color: 'var(--danger)', marginLeft: 2 }}>*</span>}
        </label>
      )}
      <input
        {...props}
        style={{
          padding: '8px 12px', borderRadius: 8, border: `1px solid ${error ? 'var(--danger)' : 'var(--border-card)'}`,
          fontSize: 13.5, fontFamily: 'var(--font-body)', color: 'var(--text-primary)',
          background: props.disabled ? 'var(--neutral-light)' : 'var(--white)',
          outline: 'none', transition: 'border-color .15s', width: '100%', boxSizing: 'border-box',
        }}
        onFocus={e => { if (!error) e.target.style.borderColor = 'var(--accent)' }}
        onBlur={e  => { if (!error) e.target.style.borderColor = 'var(--border-card)' }}
      />
      {hint  && !error && <div style={{ fontSize: 11.5, color: 'var(--text-muted)' }}>{hint}</div>}
      {error && <div style={{ fontSize: 11.5, color: 'var(--danger)' }}>{error}</div>}
    </div>
  )
}

// ── Select ────────────────────────────────────────────────────────────────────
interface SelectOption { value: string; label: string }
interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?:       string
  hint?:        string
  error?:       string
  required?:    boolean
  options?:     SelectOption[]
  placeholder?: string
  style?:       CSSProperties
}
export function Select({ label, hint, error, required, options = [], placeholder, style, ...props }: SelectProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4, ...style }}>
      {label && (
        <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)' }}>
          {label}{required && <span style={{ color: 'var(--danger)', marginLeft: 2 }}>*</span>}
        </label>
      )}
      <select
        {...props}
        style={{
          padding: '8px 12px', borderRadius: 8,
          border: `1px solid ${error ? 'var(--danger)' : 'var(--border-card)'}`,
          fontSize: 13.5, fontFamily: 'var(--font-body)',
          color: props.value ? 'var(--text-primary)' : 'var(--text-muted)',
          background: error ? '#fff8f8' : props.disabled ? 'var(--neutral-light)' : 'var(--white)',
          outline: 'none', cursor: props.disabled ? 'not-allowed' : 'pointer',
          width: '100%', boxSizing: 'border-box',
        }}>
        {placeholder && <option value="">{placeholder}</option>}
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
      {hint  && !error && <div style={{ fontSize: 11.5, color: 'var(--text-muted)' }}>{hint}</div>}
      {error && <div style={{ fontSize: 11.5, color: 'var(--danger)' }}>{error}</div>}
    </div>
  )
}

// ── Textarea ──────────────────────────────────────────────────────────────────
interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  hint?:  string
  rows?:  number
  style?: CSSProperties
}
export function Textarea({ label, hint, rows = 3, style, ...props }: TextareaProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4, ...style }}>
      {label && <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)' }}>{label}</label>}
      <textarea {...props} rows={rows}
        style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid var(--border-card)', fontSize: 13.5, fontFamily: 'var(--font-body)', color: 'var(--text-primary)', background: 'var(--white)', outline: 'none', resize: 'vertical', lineHeight: 1.5, width: '100%', boxSizing: 'border-box' }}
        onFocus={e => { e.target.style.borderColor = 'var(--accent)' }}
        onBlur={e  => { e.target.style.borderColor = 'var(--border-card)' }}
      />
      {hint && <div style={{ fontSize: 11.5, color: 'var(--text-muted)' }}>{hint}</div>}
    </div>
  )
}
