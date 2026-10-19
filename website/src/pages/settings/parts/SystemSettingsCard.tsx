// parts/SystemSettingsCard.tsx — Column 1: system name, read-only currency, logo upload (UI only), Update Settings + Wipe All Data buttons
import { Card, SectionDivider } from '../../../components/ui'
import { useOrg } from '../../../context/OrgContext'
import CompactInput from './CompactInput'
import SettingsActionButton from './SettingsActionButton'
import SettingsWarnIcon from './SettingsWarnIcon'

interface Props { systemName: string; onSystemNameChange: (value: string) => void; onUpdate: () => void; onWipe: () => void }

export default function SystemSettingsCard({ systemName, onSystemNameChange, onUpdate, onWipe }: Props) {
  const org = useOrg()
  return (
    <Card style={{ padding: '18px 20px', display: 'flex' as const, flexDirection: 'column' as const, gap: 0 }}>
      <SectionDivider label="System Settings" />
      <div style={{ display: 'flex' as const, flexDirection: 'column' as const, gap: 13, marginBottom: 18 }}>

        <CompactInput
          label="System Name"
          value={systemName}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => onSystemNameChange(e.target.value)}
        />
        <CompactInput
          label="Currency Symbol"
          value={org.currency_symbol}
          disabled
          hint="Contact support to change"
        />

        {/* Logo upload */}
        <div>
          <div style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase' as const, letterSpacing: '.04em', marginBottom: 6 }}>Logo</div>
          <div style={{ display: 'flex' as const, gap: 10, alignItems: 'center' }}>
            <div style={{ width: 36, height: 36, borderRadius: 8, background: 'var(--accent)', display: 'flex' as const, alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontSize: 14, color: '#fff', flexShrink: 0 }}>uF</div>
            <div style={{ flex: 1 }}>
              <input type="file" accept="image/*" style={{ fontSize: 11.5, width: '100%' }} />
              <div style={{ fontSize: 10.5, color: 'var(--text-muted)', marginTop: 2 }}>PNG or SVG</div>
            </div>
          </div>
        </div>
      </div>

      {/* Buttons — centered, reasonable width */}
      <div style={{ display: 'flex' as const, flexDirection: 'column' as const, gap: 8 }}>
        <SettingsActionButton onClick={onUpdate} icon={null}>
          Update Settings
        </SettingsActionButton>
        <SettingsActionButton danger onClick={onWipe} icon={<SettingsWarnIcon />}>
          Wipe All Data
        </SettingsActionButton>
      </div>
    </Card>
  )
}
