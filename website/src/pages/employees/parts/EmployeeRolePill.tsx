// parts/EmployeeRolePill.tsx — Blue role badge used in the table and the detail hero
export default function EmployeeRolePill({ role }: { role: string }) {
  return <span style={{ padding: '3px 10px', borderRadius: 20, background: '#4B5EAA', color: '#fff', fontSize: 11, fontWeight: 700 }}>{role}</span>
}
