// parts/EmployeeReportView.tsx — Printable report card for the selected member: header, member info, recent transactions
import { Card } from '../../../components/ui'
import { useOrg } from '../../../context/OrgContext'
import EmployeeInfoSection from './EmployeeInfoSection'
import EmployeeTransactionsSection from './EmployeeTransactionsSection'
import type { User, Transaction } from '../../../types'

export default function EmployeeReportView({ selected, myTx }: { selected: User; myTx: Transaction[] }) {
  const org = useOrg()
  return (
    <Card>
      {/* Report header */}
      <div style={{ padding: '22px 28px', borderBottom: '1px solid var(--border-inner)', textAlign: 'center' as const }}>
        <div style={{ fontSize: 18, fontWeight: 700 }}>uniFITS Organization</div>
        <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--accent)', marginTop: 3 }}>
          {org.people_label} Report
        </div>
        <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 3 }}>
          Generated: {new Date().toLocaleDateString('en-PH', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>

      {/* Member info */}
      <EmployeeInfoSection selected={selected} />

      {/* Recent transactions */}
      <EmployeeTransactionsSection myTx={myTx} />
    </Card>
  )
}
