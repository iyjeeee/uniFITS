// AddTransaction.tsx — 3-col layout: StepSidebar | Form | Live Preview
// Validation: per-step validation blocks Continue; shows inline field errors
// Composition only; state/validation in parts/useAddTransaction, one component per step in parts/.
import { Button, Card, ResponseModal } from '../../components/ui'
import useBreakpoint from '../../hooks/useBreakpoint'
import { StepSidebar, StepBanner } from '../../components/FormWizard'
import useAddTransaction from './parts/useAddTransaction'
import { ADD_TX_STEPS } from './parts/addTransactionShared'
import SourceStep from './parts/SourceStep'
import PaymentStep from './parts/PaymentStep'
import EntryTypeStep from './parts/EntryTypeStep'
import CategoryStep from './parts/CategoryStep'
import AmountStep from './parts/AmountStep'
import ReviewStep from './parts/ReviewStep'
import TransactionLivePreview from './parts/TransactionLivePreview'

export default function AddTransaction() {
  const { isMobile } = useBreakpoint()
  const w = useAddTransaction()
  const { org, step, form, errors } = w

  return (
    <>
    <div style={{ display: 'grid' as const, gridTemplateColumns: isMobile ? '1fr' : '200px 1fr 240px', gap: 14, alignItems: 'stretch' }}>

      {/* LEFT — Step sidebar */}
      <Card style={{ padding: '18px 14px' }}>
        <div style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' as const, letterSpacing: '.07em', marginBottom: 12 }}>Steps</div>
        <StepSidebar steps={ADD_TX_STEPS} current={step} />
      </Card>

      {/* MIDDLE — Form */}
      <Card style={{ padding: 24 }}>
        <StepBanner errors={errors} />

        {step === 0 && <SourceStep form={form} errors={errors} org={org} onPick={w.pick} onChange={w.set} userOptions={w.userOptions} />}
        {step === 1 && <PaymentStep form={form} errors={errors} onPick={w.pick} />}
        {step === 2 && <EntryTypeStep form={form} errors={errors} onPick={w.pick} />}
        {step === 3 && <CategoryStep form={form} errors={errors} org={org} onPick={w.pick} onChange={w.set} fundOptions={w.fundOptions} activityOptions={w.activityOptions} />}
        {step === 4 && <AmountStep form={form} errors={errors} org={org} onChange={w.set} />}
        {step === 5 && <ReviewStep form={form} org={org} />}

        {/* Navigation */}
        <div style={{ display: 'flex' as const, justifyContent: 'space-between', marginTop: 28 }}>
          <Button variant="secondary" onClick={w.handleBack} disabled={step === 0}>← Back</Button>
          {step < ADD_TX_STEPS.length - 1
            ? <Button onClick={w.handleContinue}>Continue →</Button>
            : <Button variant="success" onClick={() => w.setFeedback(true)}>✓ Record {org.transaction_label}</Button>
          }
        </div>
      </Card>

      {/* RIGHT — Live Preview (hidden on mobile) */}
      {!isMobile && (
        <Card style={{ padding: 20 }}>
          <TransactionLivePreview form={form} org={org} />
        </Card>
      )}
    </div>
    <ResponseModal open={w.feedback} onClose={() => { w.setFeedback(false); window.location.hash = '/transactions' }}
      variant="success" title="Transaction Recorded!" message="The transaction has been successfully recorded." confirmLabel="Go to Transactions" />
    </>
  )
}
