// test/pages.smoke.test.tsx — Every page must render and survive a click on each of its controls.
// Fails on thrown errors, React key/child warnings and uncaught errors. New pages are picked up automatically.
import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, fireEvent } from '@testing-library/react'
import type { ComponentType } from 'react'
import { OrgProvider } from '../context/OrgContext'
import { MOCK_USERS } from '../api/mockData'
import type { User, NavigateFn } from '../types'

interface PageProps { currentUser: User | null; navigate: NavigateFn }
const modules = import.meta.glob<{ default: ComponentType<PageProps> }>(['../pages/**/*.tsx', '!../pages/login/**'], { eager: true })
const pages = Object.entries(modules).map(([path, m]) => [path.replace('../pages/', '').replace('.tsx', ''), m.default] as const)

const MAX_CLICKS = 60
const IGNORED = /not wrapped in act|Not implemented: (navigation|window\.scrollTo)/
const SEVERE = /same key|not valid as a React child|Cannot read|is not a function|is not defined|Maximum update depth/

// Clickable elements — buttons, links (not mailto/tel), table rows, pointer-cursor cards
function controls(root: HTMLElement): HTMLElement[] {
  return Array.from(root.querySelectorAll<HTMLElement>('button, a[href], tr, [role=button], div, li')).filter(el => {
    if (el instanceof HTMLButtonElement && el.disabled) return false
    if (el instanceof HTMLAnchorElement) return !/^(mailto|tel):/.test(el.getAttribute('href') ?? '')
    if (el.tagName === 'DIV' || el.tagName === 'LI') return el.style.cursor === 'pointer'
    return true
  })
}

const mount = (Page: ComponentType<PageProps>) =>
  render(<OrgProvider orgData={{}}><Page currentUser={MOCK_USERS[0]} navigate={() => {}} /></OrgProvider>)

describe('page smoke tests', () => {
  afterEach(() => vi.restoreAllMocks())

  it.each(pages)('%s renders and survives clicking every control', (name, Page) => {
    const problems: string[] = []
    vi.spyOn(console, 'error').mockImplementation((...args: unknown[]) => {
      const msg = String(args[0])
      if (!IGNORED.test(msg) && SEVERE.test(msg + ' ' + String(args[1] ?? ''))) problems.push(`${msg.slice(0, 120)} ${String(args[1] ?? '')}`)
    })
    const onError = (e: ErrorEvent) => { e.preventDefault(); problems.push('uncaught: ' + e.message) }
    window.addEventListener('error', onError)

    try {
      const probe = mount(Page)
      const total = Math.min(controls(probe.container).length, MAX_CLICKS)
      probe.unmount()

      for (let i = 0; i < total; i++) {
        const view = mount(Page)
        const el = controls(view.container)[i]
        if (el) {
          try { fireEvent.click(el) }
          catch (e) { problems.push(`click #${i} "${(el.textContent ?? '').trim().slice(0, 30)}": ${(e as Error).message.slice(0, 100)}`) }
        }
        view.unmount()
      }
    } finally { window.removeEventListener('error', onError) }

    expect(problems, `${name}: ${problems.length} problem(s)`).toEqual([])
  })
})
