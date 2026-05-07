// src/context/AuthContext.js
// ─────────────────────────────────────────────────────────────────────────────
// Authentication state management.
// DEV: uses mock data. PROD: swap login() body with real API call to
// POST /api/auth/login and store the JWT via expo-secure-store.
// ─────────────────────────────────────────────────────────────────────────────
import React, { createContext, useContext, useState, useCallback } from 'react'
import { MOCK_USERS } from '../api/mockData'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user,    setUser]    = useState(null)
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState(null)

  // login — DEV: accepts ANY email + any password (no DB yet).
  // Matches mock user by email if found; otherwise falls back to first mock
  // user with the entered email assigned — so app always has data to display.
  // PROD: replace body with → fetch(`${API_BASE}/auth/login`, { method:'POST', body: JSON.stringify({email,password}) })
  const login = useCallback(async (email, password) => {
    setError(null)
    if (!email.trim() || !password.trim()) {
      setError('Please enter your email and password.')
      return false
    }
    setLoading(true)
    await new Promise(r => setTimeout(r, 700)) // simulate network latency

    // Find mock user by email — any email is accepted, fallback to MOCK_USERS[0]
    const found     = MOCK_USERS.find(u => u.email.toLowerCase() === email.trim().toLowerCase())
    const userToSet = found || { ...MOCK_USERS[0], email: email.trim() }
    setLoading(false)
    setUser(userToSet)
    return true
  }, [])

  const logout = useCallback(() => {
    setUser(null)
    setError(null)
  }, [])

  const updateUser = useCallback((partial) => {
    setUser(prev => prev ? { ...prev, ...partial } : prev)
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading, error, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
