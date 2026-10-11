// test/setup.ts — Vitest global setup: jsdom gaps + automatic cleanup between tests
import { afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'

afterEach(() => { cleanup(); window.sessionStorage.clear(); window.location.hash = '' })

// jsdom has no layout/print APIs — stub the ones pages call
window.scrollTo = () => {}
window.print = () => {}
window.HTMLElement.prototype.scrollIntoView = () => {}
