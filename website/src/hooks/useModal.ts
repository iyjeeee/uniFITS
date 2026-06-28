// hooks/useModal.ts — Reusable generic modal state hook
// Manages open/close + optional typed data payload for any modal in the app
import { useState, useCallback } from 'react'
import type { ModalState } from '../types'

/**
 * useModal<T> — Generic hook that manages a modal's visibility and optional data
 *
 * Returns ModalState<T>:
 *   isOpen   boolean        — whether the modal is open
 *   data     T | null       — optional typed payload passed to open()
 *   open     (payload?) → void  — open modal, optionally with data
 *   close    () → void      — close modal and clear data
 *   toggle   () → void      — toggle open/closed
 *
 * Usage:
 *   const modal = useModal<User>()
 *   <button onClick={() => modal.open(row)}>View</button>
 *   <InfoModal open={modal.isOpen} onClose={modal.close}>
 *     {modal.data && <DetailPanel item={modal.data} />}
 *   </InfoModal>
 */
function useModal<T>(initialOpen = false): ModalState<T> {
  const [isOpen, setIsOpen] = useState<boolean>(initialOpen)
  const [data,   setData  ] = useState<T | null>(null)

  // Open modal — optionally pass a typed data payload (e.g. the row being viewed/edited)
  const open = useCallback((payload?: T) => {
    setData(payload ?? null)
    setIsOpen(true)
  }, [])

  // Close modal and clear data
  const close = useCallback(() => {
    setIsOpen(false)
    setData(null)
  }, [])

  // Toggle open/closed
  const toggle = useCallback(() => {
    setIsOpen((prev) => !prev)
  }, [])

  return { isOpen, data, open, close, toggle }
}

export default useModal
