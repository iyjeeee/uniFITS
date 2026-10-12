// hooks/useToast.ts — Toast state: useToast() returns { toasts, toast }; toast({ message, variant, duration })
// Render <ToastContainer toasts={toasts} /> (components/ui) to display them. Currently not used by any page.
import { useState } from 'react'
import type { Toast, ToastVariant } from '../types'

interface ToastOptions { message: string; variant?: ToastVariant; duration?: number }

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([])
  const toast = ({ message, variant = 'success', duration = 3000 }: ToastOptions) => {
    const id = Date.now() + Math.random()
    setToasts(prev => [...prev, { id, message, variant }])
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), duration)
  }
  return { toasts, toast }
}
