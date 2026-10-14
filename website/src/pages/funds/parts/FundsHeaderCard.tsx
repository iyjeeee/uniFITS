// parts/FundsHeaderCard.tsx — Title, fund count and the Add Fund button
import { useOrg } from '../../../context/OrgContext'
import { BtnIco } from '../../../components/Icons'
import { Card } from '../../../components/ui'

export default function FundsHeaderCard({ count }: { count: number }) {
  const org = useOrg()
  return (
  <Card style={{ padding: '14px 20px' }}>
    <div style={{ display: 'flex' as const, alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
      <div>
        <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)' }}>{org.fund_label} Management</div>
        <div style={{ fontSize: 12.5, color: 'var(--text-muted)', marginTop: 2 }}>
          {count} fund{count !== 1 ? 's' : ''} configured — click any tile to view details
        </div>
      </div>
      <button onClick={() => { window.location.hash = '/funds/add' }}
        style={{ display: 'inline-flex' as const, alignItems: 'center', gap: 6, padding: '9px 18px', borderRadius: 8, border: 'none', background: 'var(--accent)', color: '#fff', fontSize: 13.5, fontWeight: 600, cursor: 'pointer' as const, fontFamily: 'var(--font-body)', whiteSpace: 'nowrap' as const }}>
        <BtnIco.Plus /> Add {org.fund_label}
      </button>
    </div>
  </Card>
  )
}
