// parts/EmployeesFilterSelect.tsx — Native filter dropdown used by the Employees toolbar (no chevron; differs from ui/FilterSelect, see bug log)
interface Props { value: string; onChange: (value: string) => void; options: { value: string; label: string }[] }

export default function EmployeesFilterSelect({ value, onChange, options }: Props) {
  return (
    <select value={value} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => onChange(e.target.value)}
      style={{ padding: '7px 10px', borderRadius: 7, border: '1.5px solid var(--border-card)', fontSize: 13, fontFamily: 'var(--font-body)', color: 'var(--text-primary)', background: '#fff', cursor: 'pointer' as const, outline: 'none', transition: 'border-color .18s ease, box-shadow .18s ease' }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.boxShadow = '0 0 0 1.5px rgba(75,94,170,.25)' }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-card)'; e.currentTarget.style.boxShadow = '' }}>
      {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  )
}
