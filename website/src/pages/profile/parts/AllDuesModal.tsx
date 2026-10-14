// parts/AllDuesModal.tsx — Every fund/due as paged tiles
import { useOrg } from '../../../context/OrgContext'
import useBreakpoint from '../../../hooks/useBreakpoint'
import { Button, InfoModal } from '../../../components/ui'
import type { DueFund } from './dueShared'
import { DUES_PER_PAGE } from './dueShared'
import DueTileCard from './DueTileCard'
import Pagination from '../../../components/Pagination'

export default function AllDuesModal({ open, funds, page, onPageChange, onClose, onSelect }: { open: boolean; funds: DueFund[]; page: number; onPageChange: (page: number) => void; onClose: () => void; onSelect: (fund: DueFund) => void }) {
  const org = useOrg()
  const { isMobile } = useBreakpoint()
  const pages = Math.max(1, Math.ceil(funds.length / DUES_PER_PAGE))
  const paged = funds.slice((page - 1) * DUES_PER_PAGE, page * DUES_PER_PAGE)
  return (
    <InfoModal
      open={open}
      onClose={onClose}
      title="All Dues & Funds"
      subtitle={`${funds.length} total funds · Page ${page} of ${pages}`}
      footer={<Button variant="secondary" onClick={onClose}>Close</Button>}>
      <div>
        {/* Tile grid in modal */}
        <div style={{ display: 'grid' as const, gridTemplateColumns: isMobile ? 'repeat(2,1fr)' : 'repeat(3, 1fr)', gap: 14, marginBottom: 20 }}>
          {paged.map((f) => (
            <DueTileCard
              key={f.id}
              fund={f}
              org={org}
              onClick={() => onSelect(f)}
            />
          ))}
        </div>
        {/* Pagination */}
        <Pagination page={page} total={pages} onChange={onPageChange} />
      </div>
    </InfoModal>
  )
}
