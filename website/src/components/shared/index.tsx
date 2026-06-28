// components/shared/index.tsx — Lightweight shared components for legacy Manage* pages
// Button and Modal wrappers that forward to the main ui/index.tsx design system
// Keeps legacy imports working without any duplication
export { Button } from '../ui/index'

// Modal — wraps InfoModal with isOpen → open prop mapping (legacy API compatibility)
import type { ReactNode } from 'react'
import { InfoModal } from '../ui/index'

interface SharedModalProps {
  isOpen:    boolean
  onClose:   () => void
  title?:    string
  subtitle?: string
  children?: ReactNode
  footer?:   ReactNode
}
export function Modal({ isOpen, onClose, title, subtitle, children, footer }: SharedModalProps) {
  return (
    <InfoModal
      open={isOpen}
      onClose={onClose}
      title={title}
      subtitle={subtitle}
      footer={footer}>
      {children}
    </InfoModal>
  )
}
