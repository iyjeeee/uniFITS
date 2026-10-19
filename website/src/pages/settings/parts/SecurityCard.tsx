// parts/SecurityCard.tsx — Column 3: login attempts, lockout, session timeout, backup frequency + retention, Save Security Settings (message only)
import { Card, SectionDivider } from '../../../components/ui'
import CompactInput from './CompactInput'
import CompactSelect from './CompactSelect'
import SettingsActionButton from './SettingsActionButton'
import { BACKUP_FREQ_OPTIONS } from './settingsShared'
import type { FieldChange } from './settingsShared'

interface Props { security: Record<string, string | number>; onChange: FieldChange; onSave: () => void }

export default function SecurityCard({ security, onChange, onSave }: Props) {
  return (
    <Card style={{ padding: '18px 20px', display: 'flex' as const, flexDirection: 'column' as const, gap: 0 }}>
      <SectionDivider label="Security Settings" />
      <div style={{ display: 'flex' as const, flexDirection: 'column' as const, gap: 13, marginBottom: 18 }}>
        <CompactInput
          label="Max Login Attempts"
          type="number"
          value={security.max_login_attempts}
          onChange={onChange('max_login_attempts')}
          hint="Failed attempts before lockout"
        />
        <CompactInput
          label="Lockout Duration (min)"
          type="number"
          value={security.lockout_duration_minutes}
          onChange={onChange('lockout_duration_minutes')}
          hint="How long a lockout lasts"
        />
        <CompactInput
          label="Session Timeout (min)"
          type="number"
          value={security.session_timeout_minutes}
          onChange={onChange('session_timeout_minutes')}
          hint="Auto-logout after inactivity"
        />
        <CompactSelect
          label="Backup Frequency"
          value={security.backup_frequency}
          onChange={onChange('backup_frequency')}
          options={BACKUP_FREQ_OPTIONS}
        />
        <CompactInput
          label="Backup Retention (days)"
          type="number"
          value={security.backup_retention_days}
          onChange={onChange('backup_retention_days')}
        />
      </div>
      <SettingsActionButton onClick={onSave}>
        Save Security Settings
      </SettingsActionButton>
    </Card>
  )
}
