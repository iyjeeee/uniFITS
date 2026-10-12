// components/ui/Avatar.tsx — Avatar (initials / image)
import type { CSSProperties } from 'react'

// ── Avatar ────────────────────────────────────────────────────────────────────
const AVATAR_COLORS = ['#4B5EAA','#2E7D52','#C0392B','#D4860A','#2471A3','#7D3C98','#117A65']
interface AvatarProps { name?: string; size?: number; src?: string; style?: CSSProperties }
export function Avatar({ name = '?', size = 36, src, style }: AvatarProps) {
  const initials = name.split(' ').map(p => p[0]).slice(0, 2).join('').toUpperCase()
  const color = AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length]
  return (
    <div style={{ width: size, height: size, borderRadius: '50%', background: src ? 'transparent' : color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: size * .37, fontWeight: 700, color: '#fff', flexShrink: 0, overflow: 'hidden', ...style }}>
      {src ? <img src={src} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : initials}
    </div>
  )
}
