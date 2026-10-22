// AddUtility.tsx — 3-col layout: StepSidebar | Form | Live Preview
// Validation: per-step validation blocks Continue; shows inline field errors
// Composition only; state/validation in parts/useAddUtility, one component per step in parts/.
import { Button, Card, ResponseModal } from '../../components/ui'
import useBreakpoint from '../../hooks/useBreakpoint'
import { StepSidebar, StepBanner, WizardPreview } from '../../components/FormWizard'
import useAddUtility from './parts/useAddUtility'
import { ADD_UTILITY_STEPS, getUtilitySummaryRows } from './parts/addUtilityShared'
import UtilityCategoryStep from './parts/UtilityCategoryStep'
import UtilityPaymentStep from './parts/UtilityPaymentStep'
import UtilityAmountStep from './parts/UtilityAmountStep'
import UtilityReviewStep from './parts/UtilityReviewStep'

export default function AddUtility() {
  const { isMobile } = useBreakpoint()
  const w = useAddUtility()
  const { org, step, form, errors } = w

  return (
    <>
    <div style={{ display: 'grid' as const, gridTemplateColumns: isMobile ? '1fr' : '200px 1fr 240px', gap: 14, alignItems: 'stretch' }}>

      {/* LEFT — Step sidebar */}
      <Card style={{ padding: '18px 14px' }}>
        <div style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' as const, letterSpacing: '.07em', marginBottom: 12 }}>Steps</div>
        <StepSidebar steps={ADD_UTILITY_STEPS} current={step} />
      </Card>

      {/* MIDDLE — Form */}
      <Card style={{ padding: 24 }}>
        <StepBanner errors={errors} />

        {step === 0 && <UtilityCategoryStep form={form} errors={errors} onPick={w.pickCategory} onChange={w.set} />}
        {step === 1 && <UtilityPaymentStep form={form} errors={errors} fundOptions={w.fundOptions} onChange={w.set} />}
        {step === 2 && <UtilityAmountStep form={form} errors={errors} org={org} onChange={w.set} />}
        {step === 3 && <UtilityReviewStep form={form} org={org} />}

        {/* Navigation */}
        <div style={{ display: 'flex' as const, justifyContent: 'space-between', marginTop: 28 }}>
          <Button variant="secondary" onClick={w.handleBack} disabled={step === 0}>← Back</Button>
          {step < ADD_UTILITY_STEPS.length - 1
            ? <Button onClick={w.handleContinue}>Continue →</Button>
            : <Button variant="success" onClick={() => w.setFeedback(true)}>✓ Record {org.utility_label}</Button>
          }
        </div>
      </Card>

      {/* RIGHT — Live Preview (hidden on mobile) */}
      {!isMobile && (
        <Card style={{ padding: 20 }}>
          <WizardPreview rows={getUtilitySummaryRows(form, org)} />
        </Card>
      )}
    </div>
    <ResponseModal open={w.feedback} onClose={() => { w.setFeedback(false); window.location.hash = '/transactions/utilities' }}
      variant="success" title="Utility Recorded!" message="The utility expense has been successfully recorded." confirmLabel="Go to Utilities" />
    </>
  )
}
