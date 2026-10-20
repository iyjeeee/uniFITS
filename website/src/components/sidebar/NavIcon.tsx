// sidebar/NavIcon.tsx — 18px SVG icon for a nav item (paths + optional rect/circle), white when active or hovered
import type { NavItemDef } from './sidebarNav'

export default function NavIcon({ item, active }: { item: NavItemDef; active: boolean }) {
  return (
    <svg width={18} height={18} viewBox="0 0 24 24" fill="none"
      stroke={active ? '#fff' : 'rgba(249,250,251,.6)'}
      strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"
      style={{ flexShrink: 0 }}>
      {item.rect   && <rect   {...item.rect} />}
      {item.circle && <circle {...item.circle} />}
      {item.paths.map((d, i) => <path key={i} d={d} />)}
    </svg>
  )
}
