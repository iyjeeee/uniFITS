// events.test.tsx — Events page flows + the title-keyword category rule
import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { OrgProvider } from '../context/OrgContext'
import Events from '../pages/events/Events'
import { getEventCategory, EVENT_CATEGORY_OPTIONS } from '../pages/events/parts/eventsShared'
import { MOCK_EVENTS } from '../api/mockData'
import type { AppEvent } from '../types'

const mount = () => render(<OrgProvider orgData={{}}><Events /></OrgProvider>)
const btn = (re: RegExp) => { const b = screen.getAllByRole('button').filter(x => re.test(x.textContent ?? '')).pop(); if (!b) throw new Error('no button ' + re); return b }
const rows = () => Array.from(document.querySelectorAll('tbody tr'))
const selects = () => Array.from(document.querySelectorAll('select'))
const act = (i: number, title: string) => fireEvent.click(rows()[i].querySelector(`button[title="${title}"]`) as Element)
const ev = (title: string) => ({ ...MOCK_EVENTS[0], title }) as AppEvent

describe('getEventCategory (title keywords — events have no type field)', () => {
  it('maps the keyword groups', () => {
    expect(getEventCategory(ev('Annual Gala Night'))).toBe('Fundraising'); expect(getEventCategory(ev('Charity Benefit Dinner'))).toBe('Fundraising')
    expect(getEventCategory(ev('Summer Sportsfest'))).toBe('Sports'); expect(getEventCategory(ev('Inter-school Tournament'))).toBe('Sports')
    expect(getEventCategory(ev('Independence Day Parade'))).toBe('Civic')
    expect(getEventCategory(ev('Leadership Seminar'))).toBe('Training'); expect(getEventCategory(ev('Skills Workshop'))).toBe('Training')
  })
  it('is case-insensitive, first rule wins, and falls back to General', () => {
    expect(getEventCategory(ev('ANNUAL GALA'))).toBe('Fundraising')
    expect(getEventCategory(ev('Benefit Game Night'))).toBe('Fundraising')   // fundraising rule is checked before sports
    expect(getEventCategory(ev('Christmas Party 2024'))).toBe('General'); expect(getEventCategory(ev(''))).toBe('General')
  })
  it('every mock event lands in one of the listed categories', () => {
    MOCK_EVENTS.forEach(e => expect(EVENT_CATEGORY_OPTIONS.includes(getEventCategory(e))).toBe(true))
  })
})

describe('Events', () => {
  it('KPI tiles count the events by status', () => {
    mount()
    const strip = document.querySelector('div[style*="repeat"]') as HTMLElement
    const kpi = (label: string) => Array.from(strip.querySelectorAll('div')).find(d => d.textContent === label)?.nextElementSibling?.textContent
    const count = (s: string) => MOCK_EVENTS.filter(e => e.status === s).length
    expect(kpi('Overall Events')).toBe(String(MOCK_EVENTS.length)); expect(kpi('Completed')).toBe(String(count('completed')))
    expect(kpi('Ongoing')).toBe(String(count('ongoing'))); expect(kpi('Upcoming')).toBe(String(count('upcoming')))
  })
  it('the category filter narrows the table and search can empty it', () => {
    mount()
    fireEvent.change(selects()[0], { target: { value: 'Sports' } }); expect(rows().length).toBe(MOCK_EVENTS.filter(e => getEventCategory(e) === 'Sports').length)
    fireEvent.change(selects()[0], { target: { value: 'all' } })
    fireEvent.change(document.querySelector('input[placeholder="Search…"]') as Element, { target: { value: 'zzz-no-match' } })
    expect(screen.getByText('No events found.')).toBeTruthy()
  })
  it('Approve sets Ongoing and Reject sets Cancelled, each with feedback', () => {
    mount(); const first = MOCK_EVENTS[0].title
    act(0, 'Approve'); expect(document.body.textContent).toContain(`"${first}" approved and set to Ongoing.`); fireEvent.click(btn(/Got it/))
    act(0, 'Reject'); expect(document.body.textContent).toContain(`"${first}" rejected and marked Cancelled.`)
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
