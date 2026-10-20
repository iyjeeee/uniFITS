// sidebar/SidebarBrand.tsx — 62px brand bar: "uF" mark + "uniFITS" wordmark (wordmark hidden when collapsed)
import { brandBar, brandMark, wordmark } from './sidebarStyles'

export default function SidebarBrand({ showLabel }: { showLabel: boolean }) {
  return (
    <div style={brandBar}>
      <div style={brandMark}>uF</div>
      {showLabel && <span style={wordmark}>uniFITS</span>}
    </div>
  )
}
