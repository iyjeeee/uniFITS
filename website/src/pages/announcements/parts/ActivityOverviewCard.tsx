// parts/ActivityOverviewCard.tsx — Project & Event overview card: paginated tile strip
import { useState } from 'react'
import { useOrg } from '../../../context/OrgContext'
import useBreakpoint from '../../../hooks/useBreakpoint'
import { Card } from '../../../components/ui'
import { Ico } from './icons'
import { TILES_PER_PAGE } from './helpers'
import type { TileItem } from './types'
import { PageBtn } from '../../../components/Pagination'
import TileCard from './TileCard'
import LegendDot from './LegendDot'

export default function ActivityOverviewCard({ tiles, onSelect }: { tiles: TileItem[]; onSelect: (item: TileItem) => void }) {
  const org = useOrg()
  const { isMobile } = useBreakpoint()
  const tileGridCols = isMobile ? 'repeat(2,1fr)' : 'repeat(4,1fr)'   // activity tile strip
  const [tilePage, setTilePage] = useState(1)
  const totalTilePages = Math.max(1, Math.ceil(tiles.length / TILES_PER_PAGE))
  const pagedTiles     = tiles.slice((tilePage - 1) * TILES_PER_PAGE, tilePage * TILES_PER_PAGE)

  return (
    <div style={{ display:'flex', flexDirection:'column' }}>
      <Card style={{ display:'flex', flexDirection:'column', flex: 1 }}>
        <div style={{ padding:'12px 16px', borderBottom:'1px solid var(--border-inner)', display:'flex', alignItems:'center', justifyContent:'space-between', flexShrink:0 }}>
          <div>
            <div style={{ fontSize:13.5, fontWeight:600 }}>Project &amp; Event Overview</div>
            <div style={{ fontSize:11.5, color:'var(--text-muted)', marginTop:1 }}>Ongoing &amp; upcoming activities</div>
          </div>
          <div style={{ display:'flex', gap:12, alignItems:'center' }}>
            <LegendDot color="var(--accent)"  label={`${org.project_label}s`} />
            <LegendDot color="var(--success)" label={`${org.event_label}s`} />
          </div>
        </div>

        <div style={{ padding:'14px 16px', flex:1 }}>
          {pagedTiles.length === 0
            ? <div style={{ textAlign:'center', padding:'40px 0', color:'var(--text-muted)', fontSize:13 }}>No active activities.</div>
            : (
              <div style={{ display:'grid', gridTemplateColumns:tileGridCols, gap:12 }}>
                {pagedTiles.map((item) => (
                  <TileCard key={`${item.kind}-${item.id}`} item={item} org={org} onClick={() => onSelect(item)} />
                ))}
              </div>
            )
          }
        </div>

        {/* Always-visible pagination */}
        <div style={{ padding:'10px 16px', borderTop:'1px solid var(--border-inner)', display:'flex', alignItems:'center', justifyContent:'space-between', flexShrink:0 }}>
          <div style={{ fontSize:12, color:'var(--text-muted)' }}>Page {tilePage} of {totalTilePages} · {tiles.length} total</div>
          <div style={{ display:'flex', gap:4 }}>
            <PageBtn disabled={tilePage===1}              onClick={() => setTilePage(p=>p-1)}><Ico.ChevL /></PageBtn>
            {Array.from({ length: totalTilePages }, (_,i) => i+1).map((p) => (
              <PageBtn key={p} active={p===tilePage} onClick={() => setTilePage(p)}>{p}</PageBtn>
            ))}
            <PageBtn disabled={tilePage===totalTilePages} onClick={() => setTilePage(p=>p+1)}><Ico.ChevR /></PageBtn>
          </div>
        </div>
      </Card>
    </div>
  )
}
