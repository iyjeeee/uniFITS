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

  // login — DEV: matches mock user by email (case-insensitive), any password
  // PROD: replace with → fetch(`${API_BASE}/auth/login`, { method:'POST', body: JSON.stringify({email,password}) })
  const login = useCallback(async (email, password) => {
    setError(null)
    if (!email.trim() || !password.trim()) {
      setError('Please enter your email and password.')
      return false
    }
    setLoading(true)
    await new Promise(r => setTimeout(r, 700)) // simulate network latency
    const found = MOCK_USERS.find(u => u.email.toLowerCase() === email.trim().toLowerCase())
    setLoading(false)
    if (found) {
      setUser(found)
      return true
    }
    setError('No account found with that email.\nTry: ana@example.com')
    return false
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
