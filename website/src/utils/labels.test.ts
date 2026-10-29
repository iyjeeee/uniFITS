// utils/labels.test.ts — pluralize / indefinite
import { describe, it, expect } from 'vitest'
import { pluralize, indefinite } from './labels'

describe('pluralize', () => {
  it.each([['Utility', 'Utilities'], ['Activity', 'Activities'], ['Entry', 'Entries'], ['Day', 'Days'], ['Box', 'Boxes'], ['Church', 'Churches'], ['Class', 'Classes'], ['Fund', 'Funds'], ['Employee', 'Employees'], ['Transaction', 'Transactions'], ['Report', 'Reports']])('%s -> %s', (a, b) => { expect(pluralize(a)).toBe(b) })
  it('empty stays empty', () => { expect(pluralize('')).toBe('') })
})

describe('indefinite', () => {
  it.each([['Employee', 'an'], ['Officer', 'an'], ['Project', 'a'], ['Member', 'a'], ['  Event', 'an'], ['Utility', 'a'], ['University', 'a'], ['Usher', 'an'], ['One-off', 'a'], ['Hour', 'an'], ['Honor', 'an'], ['Umbrella', 'an'], ['Uncle', 'an']])('%s -> %s', (w, a) => { expect(indefinite(w)).toBe(a) })
})
