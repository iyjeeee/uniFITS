// components/ItemDetailContent.tsx — Shared rich detail panel for the Project/Event manage modals (used by Projects.tsx and Events.tsx)
// Hero, info grid, funding bar + 4 extra sections: Member Contributions, Member Attendance, External Income, External Expense, Financial Summary
// Composition only; data in itemDetail/itemDetailData, pieces in itemDetail/.
import ItemHero from './itemDetail/ItemHero'
import ItemInfoGrid from './itemDetail/ItemInfoGrid'
import FundingProgress from './itemDetail/FundingProgress'
import TransactionPanel from './itemDetail/TransactionPanel'
import AttendancePanel from './itemDetail/AttendancePanel'
import FinancialSummary from './itemDetail/FinancialSummary'
import { ContribIcon, IncomeIcon, ExpenseIcon } from './itemDetail/itemDetailIcons'
import { getItemDetailData, buildDetailRows } from './itemDetail/itemDetailData'
import { KIND_COLOR, KIND_BG } from './itemDetail/itemDetailShared'
import useBreakpoint from '../hooks/useBreakpoint'
import type { Project, AppEvent, OrgConfig } from '../types'

interface ItemDetailContentProps {
  item: Project | AppEvent | null
  org:  OrgConfig
  kind: 'project' | 'event'
}

export default function ItemDetailContent({ item, org, kind }: ItemDetailContentProps) {
  const { isMobile } = useBreakpoint()  // must run before any early return — rules of hooks
  if (!item) return null
  const accentC = KIND_COLOR[kind] ?? KIND_COLOR.project
  const bgC     = KIND_BG[kind]    ?? KIND_BG.project
  const pct     = item.target_funding > 0
    ? Math.min(100, Math.round((item.current_funding / item.target_funding) * 100))
    : null
  const data   = getItemDetailData(item, kind)
  const twoCol = isMobile ? '1fr' : '1fr 1fr'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <ItemHero item={item} kind={kind} accentC={accentC} />
      <ItemInfoGrid rows={buildDetailRows(item, kind, org)} />
      {pct !== null && <FundingProgress item={item} pct={pct} accentC={accentC} bgC={bgC} org={org} />}

      {/* ══ EXTRA SECTIONS ═══════════════════════════════════════════ */}
      <div style={{ borderTop: '2px solid var(--border-inner)', paddingTop: 20, display: 'flex', flexDirection: 'column', gap: 20 }}>

        {/* Row A: Member Contributions | Member Attendance */}
        <div style={{ display: 'grid', gridTemplateColumns: twoCol, gap: 16 }}>
          <TransactionPanel icon={<ContribIcon />} title={`${org.people_label} Contributions`} txs={data.memberContribs} org={org}
            color="var(--success)" bg="var(--success-light)" border="rgba(46,125,82,.25)"
            emptyText="No member contributions recorded for this activity." totalLabel="Total Contributions" />
          <AttendancePanel records={data.attendanceRecords} org={org} />
        </div>

        {/* Row B: External Income | External Expense */}
        <div style={{ display: 'grid', gridTemplateColumns: twoCol, gap: 16 }}>
          <TransactionPanel icon={<IncomeIcon />} title="External Income" txs={data.externalIncome} org={org}
            color="var(--info)" bg="var(--info-light)" border="rgba(36,113,163,.25)"
            emptyText="No external income recorded for this activity." totalLabel="Total External Income" />
          <TransactionPanel icon={<ExpenseIcon />} title="External Expense" txs={data.externalExpense} org={org}
            color="var(--danger)" bg="var(--danger-light)" border="rgba(192,57,43,.25)"
            emptyText="No expenses recorded for this activity." totalLabel="Total Expenses" />
        </div>

        {/* Financial Summary — balance overview at the bottom */}
        <FinancialSummary data={data} org={org} />
      </div>
    </div>
  )
}
