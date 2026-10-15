// components/ui/FilterSelect.tsx — FilterSelect (shared filter dropdown)

// ── FilterSelect ──────────────────────────────────────────────────────────────
// Shared filter dropdown — single source of truth used by all data table pages.
// White bg, accent border + lift + ring-shadow on hover, custom dark chevron SVG (matches the dropdowns on list pages).
interface FilterSelectOption { value: string; label: string }
interface FilterSelectProps { value: string; onChange: (v: string) => void; options: (FilterSelectOption | string)[] }
export function FilterSelect({ value, onChange, options }: FilterSelectProps) {
  return (
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      style={{
        padding: '7px 28px 7px 10px', borderRadius: 7, border: '1.5px solid var(--border-card)', fontSize: 13, fontFamily: 'var(--font-body)',
        color: 'var(--text-primary)', background: '#fff', cursor: 'pointer' as const, outline: 'none',
        transition: 'border-color .18s ease, transform .18s ease, box-shadow .18s ease',
        appearance: 'none', WebkitAppearance: 'none',
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%231E2128' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E")`,
        backgroundRepeat: 'no-repeat', backgroundPosition: 'right 8px center', backgroundSize: '10px',
      }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 0 0 1.5px rgba(0,0,0,.70), 0 4px 12px rgba(0,0,0,.14)'; e.currentTarget.style.borderColor = 'var(--accent)' }}
      onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; e.currentTarget.style.borderColor = 'var(--border-card)' }}>
      {options.map(o => {
        const val = typeof o === 'string' ? o : o.value
        const lbl = typeof o === 'string' ? o : o.label
        return <option key={val} value={val}>{lbl}</option>
      })}
    </select>
  )
}
