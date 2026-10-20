// components/ui/TypePill.tsx — Small accent-blue pill for a type/role label (Employees role, Projects type)
import type { ReactNode } from 'react'

export function TypePill({ children }: { children: ReactNode }) {
  return <span style={{ padding: '3px 10px', borderRadius: 20, background: '#4B5EAA', color: '#fff', fontSize: 11, fontWeight: 700 }}>{children}</span>
}
