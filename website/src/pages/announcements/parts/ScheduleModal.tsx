// parts/ScheduleModal.tsx — Full upcoming schedule, paginated
import { InfoModal } from '../../../components/ui'
import { MODAL_PER_PAGE } from './helpers'
import type { ScheduleEntry } from './types'
import Pagination from '../../../components/Pagination'
import ScheduleItem from './ScheduleItem'

export default function ScheduleModal({ open, onClose, items, page, onPageChange }: { open: boolean; onClose: () => void; items: ScheduleEntry[]; page: number; onPageChange: (page: number) => void }) {
  const totalPages = Math.max(1, Math.ceil(items.length / MODAL_PER_PAGE))
  const pageRows   = items.slice((page - 1) * MODAL_PER_PAGE, page * MODAL_PER_PAGE)

  return (
    <InfoModal open={open} onClose={onClose}
      title="Full Upcoming Schedule"
      subtitle={`${items.length} activities · Page ${page} of ${totalPages} · ${MODAL_PER_PAGE} per page`}>
      <div>
        {pageRows.map(a => <ScheduleItem key={`${a.kind}-${a.id}`} a={a} />)}
        <Pagination page={page} total={totalPages} onChange={onPageChange} padded />
      </div>
    </InfoModal>
  )
}
