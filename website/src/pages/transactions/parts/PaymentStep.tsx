// parts/PaymentStep.tsx — Step 2: payment method cards (icon + subtitle per method name)
import type { ReactNode } from 'react'
import { SectionDivider } from '../../../components/ui'
import { FieldError, ToggleCard } from '../../../components/FormWizard'
import { MOCK_PAYMENT_METHODS } from '../../../api/mockData'
import { IcoCash, IcoPhone, IcoBank, IcoCard, IcoCheque } from './AddTransactionIcons'

interface Props { form: Record<string, string>; errors: Record<string, string>; onPick: (key: string, value: string, reset?: Record<string, string>) => void }

export default function PaymentStep({ form, errors, onPick }: Props) {
  return (
    <div style={{ display: 'flex' as const, flexDirection: 'column' as const, gap: 16 }}>
      <SectionDivider label="Payment Method" />
      <p style={{ margin: 0, fontSize: 13.5, color: 'var(--text-muted)' }}>How was this payment made?</p>
      <div style={{ display: 'grid' as const, gridTemplateColumns: 'repeat(2,1fr)', gap: 10 }}>
        {MOCK_PAYMENT_METHODS.map((m) => {
          const icons: Record<string, ReactNode> = { 'Cash': <IcoCash />, 'GCash': <IcoPhone />, 'Bank Transfer': <IcoBank />, 'PayMaya': <IcoCard />, 'Cheque': <IcoCheque /> }
          const subs: Record<string, string> = { 'Cash': 'Physical cash handover', 'GCash': 'GCash mobile wallet', 'Bank Transfer': 'Direct bank deposit', 'PayMaya': 'PayMaya e-wallet', 'Cheque': 'Cheque payment' }
          return (
            <ToggleCard key={m.id} icon={icons[m.name] || <IcoCard />} label={m.name} sublabel={subs[m.name] || ''} value={m.id} current={form.payment_method_id} hasError={!!errors.payment_method_id} onClick={(v) => onPick('payment_method_id', v)} />
          )
        })}
      </div>
      <FieldError msg={errors.payment_method_id} />
    </div>
  )
}
