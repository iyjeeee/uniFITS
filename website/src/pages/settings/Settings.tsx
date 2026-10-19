// Settings.tsx — All 3 sections in one row: System | Labels | Security
// Responsive: 3-col desktop → 1-col mobile via useBreakpoint. Composition only; state in parts/useSettings, UI in parts/.
import { ResponseModal } from '../../components/ui'
import useBreakpoint from '../../hooks/useBreakpoint'
import useSettings from './parts/useSettings'
import SystemSettingsCard from './parts/SystemSettingsCard'
import LabelsCard from './parts/LabelsCard'
import SecurityCard from './parts/SecurityCard'
import WipeDataModal from './parts/WipeDataModal'
import type { ModalVariant } from '../../types'

export default function Settings() {
  const { isMobile, isTablet } = useBreakpoint()
  const settingsCols = isMobile || isTablet ? '1fr' : '1fr 1fr 1fr' // 3-col desktop, 1-col mobile
  const s = useSettings()

  return (
    <div style={{ display: 'flex' as const, flexDirection: 'column' as const, gap: 14 }}>

      {/* ── ONE ROW: System Settings | Terminology Labels | Security Settings ── */}
      <div style={{ display: 'grid' as const, gridTemplateColumns: settingsCols, gap: 14, alignItems: 'stretch' }}>
        <SystemSettingsCard systemName={s.systemName} onSystemNameChange={s.setSystemName}
          onUpdate={() => s.showOK('Settings Saved', 'System settings have been updated successfully.')} onWipe={() => s.setShowWipeModal(true)} />
        <LabelsCard labels={s.labels} onLabelChange={s.setLabel}
          onSave={() => s.showOK('Labels Saved', 'Terminology labels have been updated throughout the system.')} />
        <SecurityCard security={s.security} onChange={s.setSec}
          onSave={() => s.showOK('Security Settings Saved', 'Security and session settings have been updated successfully.')} />
      </div>

      {/* ── Wipe All Data InfoModal ─────────────────────────────────── */}
      <WipeDataModal open={s.showWipeModal} onClose={() => s.setShowWipeModal(false)} onWipeAll={s.handleWipeAll} onWipeCore={s.handleWipeExceptCore} />

      {/* ── Response modal ──────────────────────────────────────────── */}
      <ResponseModal
        open={!!s.response}
        onClose={() => s.setResponse(null)}
        variant={(s.response?.variant || 'success') as ModalVariant}
        title={s.response?.title   || ''}
        message={s.response?.message || ''}
        confirmLabel="Got it"
      />
    </div>
  )
}
