// utils/route.test.ts — splitHash / withId: parse "#/path?id=5" into path + params (B-01)
import { describe, it, expect } from 'vitest'
import { splitHash, withId } from './route'

describe('splitHash', () => {
  it('splits path and query', () => {
    const r = splitHash('#/projects/detail?id=5')
    expect(r.path).toBe('/projects/detail'); expect(r.params.get('id')).toBe('5')
  })
  it('works without the leading # and without a query', () => {
    expect(splitHash('/dashboard').path).toBe('/dashboard'); expect(splitHash('/dashboard').params.get('id')).toBeNull()
  })
  it('empty input gives an empty path', () => { expect(splitHash('').path).toBe('') })
  it('keeps an empty id as an empty string', () => { expect(splitHash('#/events/edit?id=').params.get('id')).toBe('') })
})

describe('withId', () => {
  it('appends an encoded id', () => { expect(withId('/employees/details', '5')).toBe('/employees/details?id=5'); expect(withId('/x', 'a b')).toBe('/x?id=a%20b') })
})
