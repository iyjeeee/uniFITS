// parts/LabelsCard.tsx — Column 2: editable terminology labels (people, project, event, ...) + Save Labels (message only — see bug log)
import { Card, SectionDivider } from '../../../components/ui'
import SettingsActionButton from './SettingsActionButton'
import { LABEL_FIELDS } from './settingsShared'
import type { FieldChange } from './settingsShared'

interface Props { labels: Record<string, string>; onLabelChange: FieldChange; onSave: () => void }

export default function LabelsCard({ labels, onLabelChange, onSave }: Props) {
  return (
    <Card style={{ padding: '18px 20px', display: 'flex' as const, flexDirection: 'column' as const, gap: 0 }}>
      <SectionDivider label="Terminology Labels" />
      <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 12 }}>
        Customize labels for your organization.
      </div>
      <div style={{ display: 'flex' as const, flexDirection: 'column' as const, gap: 9, marginBottom: 18 }}>
        {LABEL_FIELDS.map(([k, label]) => (
          <div key={k} style={{ display: 'grid' as const, gridTemplateColumns: '110px 1fr', gap: 8, alignItems: 'center' }}>
            <label style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-secondary)' }}>{label}</label>
            <input
              value={labels[k]}
              onChange={onLabelChange(k)}
              style={{
                padding: '6px 9px', borderRadius: 6,
                border: '1.5px solid var(--border-card)',
                fontSize: 12.5, fontFamily: 'var(--font-body)',
                color: 'var(--text-primary)', background: '#fff',
                outline: 'none', boxSizing: 'border-box' as const,
              }}
              onFocus={e => e.target.style.borderColor = 'var(--accent)'}
              onBlur={e  => e.target.style.borderColor = 'var(--border-card)'}
            />
          </div>
        ))}
      </div>
      <SettingsActionButton onClick={onSave}>
        Save Labels
      </SettingsActionButton>
    </Card>
  )
}
