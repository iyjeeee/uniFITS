// test/modals.test.tsx — Modals lock body scroll while open and release it on close
import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { InfoModal, ResponseModal } from '../components/ui'

describe('modal scroll lock', () => {
  it('InfoModal locks body scroll while open and releases on close', () => {
    const v = render(<InfoModal open onClose={() => {}} title="T">x</InfoModal>)
    expect(document.body.style.overflow).toBe('hidden')
    v.rerender(<InfoModal open={false} onClose={() => {}} title="T">x</InfoModal>)
    expect(document.body.style.overflow).toBe('')
  })

  it('ResponseModal locks body scroll while open and releases on unmount', () => {
    const v = render(<ResponseModal open onClose={() => {}} title="T" message="m" />)
    expect(document.body.style.overflow).toBe('hidden')
    v.unmount()
    expect(document.body.style.overflow).toBe('')
  })
})
