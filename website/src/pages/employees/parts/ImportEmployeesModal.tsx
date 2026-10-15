// parts/ImportEmployeesModal.tsx — Import Employees InfoModal: drop zone (UI only, no upload logic yet) + required CSV columns
import { InfoModal } from '../../../components/ui'
import { IcoUpload, IcoFileUp } from './EmployeesIcons'

export default function ImportEmployeesModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null
  return (
    <InfoModal
      open={open}
      onClose={onClose}
      title="Import Employees"
      subtitle="Upload a CSV or Excel file to batch-import employee records"
      accentColor="var(--accent)"
      footer={
    <div style={{ display: 'flex' as const, gap: 10, justifyContent: 'flex-end' }}>
      <button
        style={{ display: 'inline-flex' as const, alignItems: 'center', gap: 6, padding: '10px 22px', borderRadius: 9, border: 'none', background: 'var(--accent)', color: '#fff', fontSize: 13.5, fontWeight: 600, cursor: 'pointer' as const, fontFamily: 'var(--font-body)', transition: 'transform .18s ease, box-shadow .18s ease' }}
      onMouseEnter={(e: React.MouseEvent<HTMLElement>) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 0 0 1.5px rgba(0,0,0,.70), 0 4px 12px rgba(0,0,0,.14)' }}
      onMouseLeave={(e: React.MouseEvent<HTMLElement>) => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '' }}>
        <IcoUpload /> Import File
      </button>
      <button onClick={onClose}
        style={{ padding: '10px 28px', borderRadius: 9, border: '1.5px solid var(--border-card)', background: 'var(--neutral-light)', color: 'var(--text-primary)', fontSize: 14, fontWeight: 600, cursor: 'pointer' as const, fontFamily: 'var(--font-body)' }}>
        Close
      </button>
    </div>
      }>
    <div style={{ display: 'flex' as const, flexDirection: 'column' as const, gap: 20 }}>
      {/* Drop zone */}
      <div style={{ border: '2px dashed var(--border-card)', borderRadius: 14, padding: '36px 24px', textAlign: 'center' as const, background: 'var(--neutral-light)', display: 'flex' as const, flexDirection: 'column' as const, alignItems: 'center', gap: 12 }}>
        <div style={{ color: 'var(--accent)', opacity: .6 }}><IcoFileUp /></div>
        <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)' }}>Drop your file here</div>
        <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>Supports .csv and .xlsx (Excel) files</div>
        <label style={{ marginTop: 4 }}>
          <input type="file" accept=".csv,.xlsx,.xls" style={{ display: 'none' as const }} />
          <span style={{ display: 'inline-flex' as const, padding: '8px 20px', borderRadius: 8, border: 'none', background: 'var(--accent)', color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer' as const }}>
            Browse File
          </span>
        </label>
      </div>
      {/* Instructions */}
      <div>
        <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 10 }}>Required CSV Columns</div>
        <div style={{ display: 'grid' as const, gridTemplateColumns: 'repeat(2,1fr)', gap: 8 }}>
          {['first_name','last_name','email','contact_number','gender','date_of_birth','department','occupation'].map(col => (
            /* CSV column pills — neutral-light bg ensures code text is readable (removed dark table-head-bg) */
            <div key={col} style={{ padding: '8px 12px', borderRadius: 8, background: 'var(--neutral-light)', border: '1.5px solid var(--border-card)', fontSize: 12.5 }}>
              <code style={{ color: 'var(--accent)', fontWeight: 600 }}>{col}</code>
            </div>
          ))}
        </div>
        <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 10 }}>
          Download the <a href="#" style={{ color: 'var(--accent)', fontWeight: 600 }}>template file</a> to ensure correct formatting.
        </div>
      </div>
    </div>
    </InfoModal>
  )
}
