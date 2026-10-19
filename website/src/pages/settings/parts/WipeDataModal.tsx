// parts/WipeDataModal.tsx — Wipe All Data InfoModal: full reset or keep-core-tables option (each only shows a message — see bug log)
import { InfoModal, Button } from '../../../components/ui'
import SettingsWarnIcon from './SettingsWarnIcon'

interface Props { open: boolean; onClose: () => void; onWipeAll: () => void; onWipeCore: () => void }

export default function WipeDataModal({ open, onClose, onWipeAll, onWipeCore }: Props) {
  return (
    <InfoModal
      open={open}
      onClose={onClose}
      title="Wipe All Data"
      subtitle="Choose what to wipe — this action cannot be undone"
      accentColor="var(--danger)"
      footer={<Button variant="secondary" onClick={onClose}>Close</Button>}>
        <div style={{ display: 'flex' as const, flexDirection: 'column' as const, gap: 16 }}>
          <div style={{ padding: '12px 16px', borderRadius: 10, background: '#fdecea', border: '1.5px solid rgba(192,57,43,.3)', display: 'flex' as const, gap: 10, alignItems: 'flex-start' }}>
            <span style={{ color: 'var(--danger)', flexShrink: 0, marginTop: 1 }}><SettingsWarnIcon /></span>
            <div style={{ fontSize: 13.5, color: 'var(--danger)', fontWeight: 600, lineHeight: 1.55 }}>
              This action is permanent and cannot be reversed. Please choose carefully.
            </div>
          </div>
          <div style={{ padding: '18px 20px', borderRadius: 12, border: '2px solid rgba(192,57,43,.35)', background: 'rgba(192,57,43,.03)' }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--danger)', marginBottom: 8 }}>Wipe ALL Data</div>
            <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.65, marginBottom: 14 }}>
              Permanently deletes <strong>everything</strong> — attendances, events, projects, transactions, funds, audit logs, settings, roles, and member records.<br />
              <strong style={{ color: 'var(--danger)' }}>Nothing is preserved. This is a full system reset.</strong>
            </div>
            <Button variant="danger" onClick={onWipeAll}>Wipe ALL Data (Full Reset)</Button>
          </div>
          <div style={{ padding: '18px 20px', borderRadius: 12, border: '2px solid rgba(212,134,10,.35)', background: 'rgba(212,134,10,.03)' }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--warning)', marginBottom: 8 }}>Wipe All Data — Except Core Tables</div>
            <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.65, marginBottom: 14 }}>
              Deletes all club activity data but <strong>preserves</strong> core tables: settings, roles, permissions, and member records.<br />
              <strong style={{ color: 'var(--warning)' }}>Recommended for year-end reset or demo refresh.</strong>
            </div>
            <Button onClick={onWipeCore} style={{ background: 'var(--warning)', color: '#fff', border: 'none' }}>
              Wipe Data (Keep Core Tables)
            </Button>
          </div>
        </div>
    </InfoModal>
  )
}
