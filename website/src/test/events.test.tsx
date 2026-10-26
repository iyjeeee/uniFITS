// events.test.tsx — Events page flows + the title-keyword category rule
import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent, cleanup } from '@testing-library/react'
import { OrgProvider } from '../context/OrgContext'
import Events from '../pages/events/Events'
import { EVENT_TYPES } from '../constants/eventTypes'
import { MOCK_EVENTS } from '../api/mockData'
import { approvedOnly } from '../utils/approvals'

const mount = () => render(<OrgProvider orgData={{}}><Events /></OrgProvider>)
const btn = (re: RegExp) => { const b = screen.getAllByRole('button').filter(x => re.test(x.textContent ?? '')).pop(); if (!b) throw new Error('no button ' + re); return b }
const rows = () => Array.from(document.querySelectorAll('tbody tr'))
const fieldIn = (label: RegExp, tag: string) => screen.getByText(label, { selector: 'label' }).parentElement?.querySelector(tag) as HTMLSelectElement   // labels are not linked to controls yet (B-60)
const selects = () => Array.from(document.querySelectorAll('select'))
const act = (i: number, title: string) => fireEvent.click(rows()[i].querySelector(`button[title="${title}"]`) as Element)

describe('event types (a real field, not guessed from the title)', () => {
  it('every mock event has one of the listed types', () => {
    MOCK_EVENTS.forEach(e => expect(EVENT_TYPES).toContain(e.event_type))
  })
  it('the type filter offers All + the listed types', () => {
    mount()
    expect(Array.from((selects()[0] as HTMLSelectElement).options).map(o => o.value)).toEqual(['all', ...EVENT_TYPES])
  })
  it('the filter uses the STORED type: a "Sportsfest" typed Training is found under Training, not Sports', () => {
    const e = MOCK_EVENTS.find(x => x.title === 'Summer Sportsfest')!; const was = e.event_type
    e.event_type = 'Training'
    try {
      mount()
      fireEvent.change(selects()[0], { target: { value: 'Training' } })
      expect(rows().map(r => r.textContent).join('|')).toContain('Summer Sportsfest')
      fireEvent.change(selects()[0], { target: { value: 'Sports' } })
      expect(rows().map(r => r.textContent).join('|')).not.toContain('Summer Sportsfest')
    } finally { e.event_type = was }
  })
  it('the Edit modal has an Event Type select; changing it moves the event to the new type filter', () => {
    mount(); const t = 'Summer Sportsfest'
    fireEvent.click(screen.getByText(t)); fireEvent.click(btn(/Edit Event/))
    const typeSelect = fieldIn(/Event Type/, 'select')
    expect(typeSelect.value).toBe('Sports')
    fireEvent.change(typeSelect, { target: { value: 'Civic' } }); fireEvent.click(btn(/Save Event/))
    fireEvent.click(btn(/Got it/))
    fireEvent.change(selects()[0], { target: { value: 'Civic' } })
    expect(rows().map(r => r.textContent).join('|')).toContain(t)
  })
})

describe('Events', () => {
  it('KPI tiles count the events by status (Overall = all rows; the others = approved events only)', () => {
    mount()
    const strip = document.querySelector('div[style*="repeat"]') as HTMLElement
    const kpi = (label: string) => Array.from(strip.querySelectorAll('div')).find(d => d.textContent === label)?.nextElementSibling?.textContent
    const count = (s: string) => approvedOnly(MOCK_EVENTS).filter(e => e.status === s).length
    expect(kpi('Overall Events')).toBe(String(MOCK_EVENTS.length)); expect(kpi('Completed')).toBe(String(count('completed')))
    expect(kpi('Ongoing')).toBe(String(count('ongoing'))); expect(kpi('Upcoming')).toBe(String(count('upcoming')))
  })
  it('the type filter narrows the table and search can empty it', () => {
    mount()
    fireEvent.change(selects()[0], { target: { value: 'Sports' } }); expect(rows().length).toBe(MOCK_EVENTS.filter(e => e.event_type === 'Sports').length)
    fireEvent.change(selects()[0], { target: { value: 'all' } })
    fireEvent.change(document.querySelector('input[placeholder="Search…"]') as Element, { target: { value: 'zzz-no-match' } })
    expect(screen.getByText('No events found.')).toBeTruthy()
  })
  it('Approve and Reject (pending event only) each show feedback and leave the lifecycle status alone', () => {
    const pending = MOCK_EVENTS.find(e => e.approval_status === 'pending')!.title
    mount(); fireEvent.click(screen.getByTitle('Approve')); expect(document.body.textContent).toContain(`"${pending}" has been approved.`)
    cleanup(); mount(); fireEvent.click(screen.getByTitle('Reject')); expect(document.body.textContent).toContain(`"${pending}" has been rejected.`)
  })
  it('detail Edit opens the edit modal; Save updates the row and shows feedback', () => {
    mount(); const t = MOCK_EVENTS[1].title
    fireEvent.click(screen.getByText(t)); fireEvent.click(btn(/Edit Event/))
    const input = Array.from(document.querySelectorAll<HTMLInputElement>('input')).find(i => i.value === t) as HTMLInputElement
    fireEvent.change(input, { target: { value: t + ' II' } }); fireEvent.click(btn(/Save Event/))
    expect(document.body.textContent).toContain(`"${t} II" has been saved successfully.`)
  })
  it('delete asks first, then removes the row with feedback', async () => {
    mount(); const n = rows().length
    act(0, 'Delete'); expect(screen.getByText('Delete Event')).toBeTruthy(); fireEvent.click(btn(/Yes, Delete/))
    await screen.findByText(/has been permanently removed/); expect(rows().length).toBe(n - 1)
  })
})
