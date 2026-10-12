// parts/AllAnnouncementsModal.tsx — Every announcement: pinned section + paginated recent posts
import { InfoModal } from '../../../components/ui'
import type { Announcement } from '../../../types'
import { Ico } from './icons'
import { MODAL_PER_PAGE } from './helpers'
import { Pagination } from './Pagination'
import ModalSection from './ModalSection'
import AnnRow from './AnnRow'

export default function AllAnnouncementsModal({ open, onClose, announcements, page, onPageChange, onSelect }: { open: boolean; onClose: () => void; announcements: Announcement[]; page: number; onPageChange: (page: number) => void; onSelect: (a: Announcement) => void }) {
  const pinned   = announcements.filter(a => a.is_pinned)
  const regular  = announcements.filter(a => !a.is_pinned)
  const pageRows = regular.slice((page - 1) * MODAL_PER_PAGE, page * MODAL_PER_PAGE)   // only the current page (pinned are always all shown)

  return (
    <InfoModal open={open} onClose={onClose}
      title="All Announcements"
      subtitle={`${announcements.length} total · ${pinned.length} pinned · ${regular.length} unpinned`}>
      <div>
        {/* Pinned section */}
        {pinned.length > 0 && (
          <div style={{ marginBottom: 20 }}>
            <ModalSection icon={<Ico.Pin />} label="Pinned" count={pinned.length} color="var(--accent)" />
            {pinned.map(a => <AnnRow key={a.id} a={a} onClick={() => onSelect(a)} />)}
          </div>
        )}

        {/* Unpinned section (paginated) */}
        {regular.length > 0 && (
          <div>
            <ModalSection icon={<Ico.Bell />} label="Recent Posts" count={regular.length} color="var(--text-secondary)" />
            {pageRows.map(a => <AnnRow key={a.id} a={a} onClick={() => onSelect(a)} />)}
          </div>
        )}

        {regular.length > MODAL_PER_PAGE && (
          <Pagination page={page} total={Math.ceil(regular.length / MODAL_PER_PAGE)} onChange={onPageChange} />
        )}

        {announcements.length === 0 && (
          <div style={{ textAlign:'center', padding:'32px 0', color:'var(--text-muted)', fontSize:13 }}>
            No announcements yet.
          </div>
        )}
      </div>
    </InfoModal>
  )
}
