// components/RecordNotFound.tsx — Shown by detail/edit pages when the id in the address matches no record (B-01)
import { Card, Button, EmptyState } from './ui'
import type { NavigateFn } from '../types'

interface Props { label: string; backPath: string; navigate?: NavigateFn }

export default function RecordNotFound({ label, backPath, navigate }: Props) {
  const goBack = () => (navigate ? navigate(backPath) : (window.location.hash = backPath))   // fall back to the hash when no navigate prop
  return (
    <Card>
      <div role="alert">
        <EmptyState icon="🔍" title={`${label} not found`} subtitle="This record doesn't exist, or the link is incomplete."
          action={<Button variant="secondary" onClick={goBack}>Back to list</Button>} />
      </div>
    </Card>
  )
}
