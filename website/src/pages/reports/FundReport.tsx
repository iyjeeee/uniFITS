// FundReport.tsx — Tile-card fund report; 4 per row; fund detail opens InfoModal (not blank page)
// Composition only; state in parts/useFundReport, KPI/tile sections/modals in parts/.
import { useOrg } from '../../context/OrgContext'
import useBreakpoint from '../../hooks/useBreakpoint'
import useFundReport from './parts/useFundReport'
import FundReportKpiStrip from './parts/FundReportKpiStrip'
import FundTileSection from './parts/FundTileSection'
import FundDetailModal from './parts/FundDetailModal'
import FundExportModals from './parts/FundExportModals'
import { IcoLock, IcoGlobe } from './parts/FundReportIcons'
import { MOCK_FUNDS } from '../../api/mockData'

export default function FundReport() {
  const org = useOrg()
  const { isMobile, isTablet } = useBreakpoint()
  const fundCols = isMobile ? '1fr' : isTablet ? 'repeat(2,1fr)' : 'repeat(4,1fr)'
  const r = useFundReport()

  return (
    <div style={{ display: 'flex' as const, flexDirection: 'column' as const, gap: 16 }}>

      {/* ── KPI strip ─────────────────────────────────────────── */}
      <FundReportKpiStrip funds={MOCK_FUNDS} />

      {/* ── Required Funds Section ─────────────────────────────── */}
      {r.required.length > 0 && (
        <FundTileSection title={`Funds Required for All ${org.people_label}s`} icon={<IcoLock />} iconBg="var(--accent-light)" iconColor="var(--accent)"
          funds={r.required} columns={fundCols} org={org} onSelect={r.setViewFund} />
      )}

      {/* ── Optional Funds Section ─────────────────────────────── */}
      {r.optional.length > 0 && (
        <FundTileSection title={`Funds NOT Required for All ${org.people_label}s`} icon={<IcoGlobe />} iconBg="var(--info-light)" iconColor="var(--info)"
          funds={r.optional} columns={fundCols} org={org} onSelect={r.setViewFund} />
      )}

      {/* ── Fund Detail InfoModal ──────────────────────────────── */}
      <FundDetailModal fund={r.viewFund} org={org} onClose={() => r.setViewFund(null)} onExport={r.startExport} />

      <FundExportModals open={r.showExport} onCancel={() => r.setShowExport(false)} onConfirm={r.handleExport}
        result={r.exportResult} onCloseResult={() => r.setExportResult(null)} />
    </div>
  )
}
