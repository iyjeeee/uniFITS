// addEventType.test.tsx -- Add Event asks for the event type (required, like Project Type) and shows it in the review
import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { OrgProvider } from '../context/OrgContext'
import AddEvent from '../pages/events/AddEvent'
import { EVENT_TYPES } from '../constants/eventTypes'

const mount = () => render(<OrgProvider orgData={{}}><AddEvent /></OrgProvider>)
const field = (label: RegExp, tag: string) => screen.getByText(label, { selector: 'label' }).parentElement?.querySelector(tag) as HTMLSelectElement   // labels are not linked to controls yet (B-60)
const next = () => fireEvent.click(screen.getByRole('button', { name: /Continue/ }))

describe('Add Event: event type', () => {
  it('offers the listed types and blocks Continue until one is chosen', () => {
    mount()
    const select = field(/Event Type/, 'select')
    expect(Array.from(select.options).map(o => o.value).filter(Boolean)).toEqual([...EVENT_TYPES])
    fireEvent.change(field(/Event Name/, 'input'), { target: { value: 'Charity Run' } })
    next()
    expect(document.body.textContent).toMatch(/Event Type is required/i)
    expect(screen.queryByText(/Event Date/, { selector: 'label' })).toBeNull()   // still on step 1
    fireEvent.change(select, { target: { value: 'Sports' } })
    next()
    expect(screen.getByText(/Event Date/, { selector: 'label' })).toBeTruthy()   // moved on to Date & Time
  })
})
