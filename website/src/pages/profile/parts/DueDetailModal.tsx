// parts/DueDetailModal.tsx — Detail view for one due/fund
import { useOrg } from '../../../context/OrgContext'
import { Button, InfoModal } from '../../../components/ui'
import type { DueFund } from './dueShared'
import DueDetailContent from './DueDetailContent'

export default function DueDetailModal({ fund, onClose }: { fund: DueFund | null; onClose: () => void }) {
  const org = useOrg()
  if (!fund) return null
  return (
    <InfoModal
      open={!!fund}
      onClose={onClose}
      title={fund.name}
      subtitle={fund.description || 'Fund details and payment information'}
      accentColor={fund.is_required ? 'var(--accent)' : 'var(--success)'}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>Close</Button>
          <Button>Pay Now</Button>
        </>
      }>
      <DueDetailContent fund={fund} org={org} />
    </InfoModal>
  )
}
