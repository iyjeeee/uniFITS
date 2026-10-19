// header/LogoutModal.tsx — "Sign Out?" confirmation; confirm calls onLogout (fallback clears the session keys and goes to /login)
import { ResponseModal } from '../ui'

interface Props { open: boolean; onClose: () => void; onLogout: () => void }

export default function LogoutModal({ open, onClose, onLogout }: Props) {
  return (
    <ResponseModal
      open={open}
      onClose={onClose}
      variant="warning"
      title="Sign Out?"
      message="Are you sure you want to sign out? Any unsaved changes will be lost."
      confirmLabel="Yes, Sign Out"
      cancelLabel="Cancel"
      onConfirm={() => {
        onClose()
        if (typeof onLogout === 'function') {
          onLogout()
        } else {
          try { sessionStorage.removeItem('unifits_authed'); sessionStorage.removeItem('unifits_user') } catch { /* ignore */ }
          window.location.hash = '/login'
        }
      }}
    />
  )
}
