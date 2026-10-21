// parts/FundExportModals.tsx — Export PDF confirmation (info) + result feedback (success) ResponseModals
import { ResponseModal } from '../../../components/ui'
import type { FundExportResult } from './useFundReport'
import type { ModalVariant } from '../../../types'

interface Props { open: boolean; onCancel: () => void; onConfirm: () => void; result: FundExportResult | null; onCloseResult: () => void }

export default function FundExportModals({ open, onCancel, onConfirm, result, onCloseResult }: Props) {
  return (
    <>
      {/* ── Export PDF Confirmation Modal ──────────────────────── */}
      <ResponseModal
        open={open}
        onClose={onCancel}
        variant="info"
        title="Export Fund Report PDF"
        message="This will generate a downloadable PDF of the fund report with all financial details. Continue?"
        confirmLabel="Export PDF"
        cancelLabel="Cancel"
        onConfirm={onConfirm}
      />

      {/* ── Export Result Feedback ─────────────────────────────── */}
      <ResponseModal
        open={!!result}
        onClose={onCloseResult}
        variant={(result?.variant || 'success') as ModalVariant}
        title={result?.title || ''}
        message={result?.message || ''}
        confirmLabel="Got it"
      />
    </>
  )
}
