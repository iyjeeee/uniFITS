// shared/index.jsx — Lightweight shared components for legacy Manage* pages
// Button and Modal wrappers that forward to the main ui/index.jsx design system
// Keeps legacy imports working without duplication
export { Button } from '../ui/index.jsx'

// Modal — wraps InfoModal with isOpen → open prop mapping (legacy API compat)
import { InfoModal } from '../ui/index.jsx'

export function Modal({ isOpen, onClose, title, subtitle, children, footer }) {
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
