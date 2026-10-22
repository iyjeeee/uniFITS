// formWizard.test.tsx — shared wizard pieces: ToggleCard (both variants), WizardPreview, FieldError, StepSidebar
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ToggleCard, WizardPreview, FieldError, StepSidebar } from '../components/FormWizard'

const base = { label: 'Cash', icon: <i>ic</i>, value: 'cash', onClick: () => {} }

describe('ToggleCard', () => {
  it('calls onClick with its value', () => {
    const onClick = vi.fn(); render(<ToggleCard {...base} current="" onClick={onClick} />); fireEvent.click(screen.getByRole('button')); expect(onClick).toHaveBeenCalledWith('cash')
  })
  it('active = accent border, error = danger border, otherwise neutral', () => {
    const style = (p: Partial<React.ComponentProps<typeof ToggleCard>>) => { const { container } = render(<ToggleCard {...base} current="x" {...p} />); return (container.querySelector('button') as HTMLElement).getAttribute('style') ?? '' }
    expect(style({ current: 'cash' })).toContain('var(--accent)'); expect(style({ hasError: true })).toContain('var(--danger)'); expect(style({})).toContain('var(--border-card)')
  })
  it('"choice" shows a sublabel and has min-width 0; "category" ignores it and uses min-width 45%', () => {
    const a = render(<ToggleCard {...base} current="" sublabel="Physical cash" />); expect(screen.getByText('Physical cash')).toBeTruthy(); expect((a.container.querySelector('button') as HTMLElement).style.minWidth).toMatch(/^0(px)?$/); a.unmount()
    const b = render(<ToggleCard {...base} current="" sublabel="Physical cash" variant="category" />); expect(screen.queryByText('Physical cash')).toBeNull(); expect((b.container.querySelector('button') as HTMLElement).style.minWidth).toBe('45%')
  })
})

describe('WizardPreview', () => {
  it('shows each row and dims the empty dash', () => {
    render(<WizardPreview rows={[['Source', 'Member'], ['Fund', '—']]} />)
    expect(screen.getByText('Live Preview')).toBeTruthy(); expect(screen.getByText('Member')).toBeTruthy()
    expect((screen.getByText('—') as HTMLElement).style.color).toBe('var(--border-card)'); expect((screen.getByText('Member') as HTMLElement).style.color).toBe('var(--text-primary)')
  })
})

describe('FieldError / StepSidebar', () => {
  it('FieldError renders nothing without a message', () => { const { container } = render(<FieldError />); expect(container.innerHTML).toBe('') })
  it('FieldError shows its message', () => { render(<FieldError msg="Required" />); expect(screen.getByText(/Required/)).toBeTruthy() })
  it('StepSidebar lists every step', () => { render(<StepSidebar steps={['One', 'Two', 'Three']} current={1} />); ['One', 'Two', 'Three'].forEach(s => expect(screen.getByText(s)).toBeTruthy()) })
})
