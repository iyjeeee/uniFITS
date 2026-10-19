// settings.test.tsx — Settings page: field editing, save feedback, wipe modal (values are not persisted anywhere yet)
import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { OrgProvider } from '../context/OrgContext'
import Settings from '../pages/settings/Settings'
import { LABEL_FIELDS, BACKUP_FREQ_OPTIONS } from '../pages/settings/parts/settingsShared'

const mount = () => render(<OrgProvider orgData={{ name: 'Rotary Club', people_label: 'Member' }}><Settings /></OrgProvider>)
const btn = (re: RegExp) => { const b = screen.getAllByRole('button').filter(x => re.test(x.textContent ?? '')).pop(); if (!b) throw new Error('no button ' + re); return b }

describe('Settings', () => {
  it('starts from the org config (name, labels) and the security defaults', () => {
    mount()
    const inputs = Array.from(document.querySelectorAll('input')) as HTMLInputElement[]
    expect(inputs.some(i => i.value === 'Rotary Club')).toBe(true)
    expect(inputs.some(i => i.value === 'Member')).toBe(true)
    const nums = inputs.filter(i => i.type === 'number').map(i => i.value)
    expect(nums).toEqual(['5', '30', '60', '30'])   // attempts, lockout, session, retention
    expect(LABEL_FIELDS.length).toBe(8)
  })
  it('typing updates the system name, a label and a security number', () => {
    mount()
    const inputs = () => Array.from(document.querySelectorAll('input')) as HTMLInputElement[]
    fireEvent.change(inputs().find(i => i.value === 'Rotary Club') as Element, { target: { value: 'New Name' } })
    expect(inputs().some(i => i.value === 'New Name')).toBe(true)
    fireEvent.change(inputs().find(i => i.value === 'Project') as Element, { target: { value: 'Program' } })
    expect(inputs().some(i => i.value === 'Program')).toBe(true)
    fireEvent.change(inputs().filter(i => i.type === 'number')[0], { target: { value: '9' } })
    expect(inputs().filter(i => i.type === 'number')[0].value).toBe('9')
  })
  it('backup frequency offers daily / weekly / monthly', () => {
    mount()
    const sel = document.querySelector('select') as HTMLSelectElement
    expect(Array.from(sel.options).map(o => o.value)).toEqual(BACKUP_FREQ_OPTIONS.map(o => o.value))
    fireEvent.change(sel, { target: { value: 'weekly' } }); expect(sel.value).toBe('weekly')
  })
  it('each Save button shows its own feedback message', () => {
    mount()
    for (const [re, title] of [[/Update Settings/, 'Settings Saved'], [/Save Labels/, 'Labels Saved'], [/Save Security Settings/, 'Security Settings Saved']] as const) {
      fireEvent.click(btn(re)); expect(screen.getByText(title)).toBeTruthy(); fireEvent.click(btn(/Got it/))
    }
  })
  it('Wipe All Data opens a modal with two options, each ending in feedback', () => {
    mount()
    fireEvent.click(btn(/Wipe All Data/)); expect(screen.getByText('Choose what to wipe — this action cannot be undone')).toBeTruthy()
    fireEvent.click(btn(/Wipe ALL Data \(Full Reset\)/)); expect(screen.getByText('All Data Wiped')).toBeTruthy(); fireEvent.click(btn(/Got it/))
    fireEvent.click(btn(/Wipe All Data/)); fireEvent.click(btn(/Wipe Data \(Keep Core Tables\)/)); expect(screen.getByText('Data Wiped (Core Kept)')).toBeTruthy()
  })
})
