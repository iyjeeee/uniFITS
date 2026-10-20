// sidebar/SidebarCollapseButton.tsx — Footer "Collapse" button (desktop only): chevron rotates when collapsed, label hidden when collapsed
import { footerBar, collapseBtn } from './sidebarStyles'

interface Props { collapsed: boolean; showLabel: boolean; hovered: boolean; onHover: (hovered: boolean) => void; onClick: () => void }

export default function SidebarCollapseButton({ collapsed, showLabel, hovered: collHovered, onHover, onClick }: Props) {
  return (
    <div style={footerBar}>
      <button
        style={{ ...collapseBtn, background: collHovered ? 'rgba(255,255,255,.10)' : 'transparent', transform: collHovered ? 'translateX(3px)' : 'none', boxShadow: collHovered ? 'inset 0 0 0 1px rgba(255,255,255,.12), 0 2px 8px rgba(0,0,0,.25)' : 'none' }}
        onClick={onClick}
        title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        onMouseEnter={() => onHover(true)}
        onMouseLeave={() => onHover(false)}>
        <svg width={18} height={18} viewBox="0 0 24 24" fill="none"
          stroke={collHovered ? 'rgba(249,250,251,.90)' : 'rgba(249,250,251,.40)'}
          strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"
          style={{ flexShrink: 0, transition: 'transform .25s ease, stroke .15s ease', transform: collapsed ? 'rotate(180deg)' : 'none' }}>
          <polyline points="15 18 9 12 15 6" />
        </svg>
        {showLabel && (
          <span style={{ fontSize: 13, color: collHovered ? 'rgba(249,250,251,.90)' : 'rgba(249,250,251,.40)', transition: 'color .15s ease' }}>
            Collapse
          </span>
        )}
      </button>
    </div>
  )
}
