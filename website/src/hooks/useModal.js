// hooks/useModal.js — Reusable modal state hook
// Manages open/close + optional data payload for any modal in the app

import { useState, useCallback } from 'react';

/**
 * useModal — Hook that manages a modal's visibility and optional data
 *
 * Returns:
 *   isOpen    {boolean}  - Whether modal is open
 *   data      {any}      - Optional payload passed to open()
 *   open      {Function} - Open modal, optionally with data
 *   close     {Function} - Close modal and clear data
 *   toggle    {Function} - Toggle open/closed
 *
 * Usage:
 *   const editModal = useModal();
 *   <Button onClick={() => editModal.open(employee)}>Edit</Button>
 *   <Modal isOpen={editModal.isOpen} onClose={editModal.close}>…</Modal>
 */
const useModal = (initialOpen = false) => {
  const [isOpen, setIsOpen] = useState(initialOpen); // Modal visibility
  const [data,   setData  ] = useState(null);        // Optional payload

  // Open modal — optionally pass a data object (e.g. row being edited)
  const open = useCallback((payload = null) => {
    setData(payload);
    setIsOpen(true);
  }, []);

  // Close modal and clear data
  const close = useCallback(() => {
    setIsOpen(false);
    setData(null);
  }, []);

  // Toggle open/closed
  const toggle = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  return { isOpen, data, open, close, toggle };
};

export default useModal;
