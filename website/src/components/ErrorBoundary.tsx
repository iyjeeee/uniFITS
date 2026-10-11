// components/ErrorBoundary.tsx — Catches render errors in a page so the shell (sidebar/header) stays usable
import { Component } from 'react'
import type { ErrorInfo, ReactNode } from 'react'
import { Card, Button } from './ui'

interface ErrorBoundaryProps {
  children:   ReactNode
  onGoHome?:  () => void   // optional — "Go to Dashboard" button is hidden when omitted
}
interface ErrorBoundaryState { error: Error | null }

export default class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { error: null }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState { return { error } }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[ErrorBoundary]', error, info.componentStack)   // SWAP: send to a logging service later
  }

  reset = () => this.setState({ error: null })

  render() {
    const { error } = this.state
    if (!error) return this.props.children

    return (
      <Card style={{ padding: '40px 24px', textAlign: 'center' }}>
        <div role="alert" style={{ maxWidth: 480, margin: '0 auto' }}>
          <div style={{ fontSize: 40, marginBottom: 8 }} aria-hidden="true">⚠️</div>
          <h3 style={{ marginBottom: 6 }}>Something went wrong</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: 13.5, lineHeight: 1.5, marginBottom: 6 }}>
            This page hit an unexpected error. The rest of the app is still working.
          </p>
          <p style={{ color: 'var(--text-muted)', fontSize: 12, marginBottom: 20, wordBreak: 'break-word' }}>
            {error.message}
          </p>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button onClick={this.reset}>Try again</Button>
            {this.props.onGoHome && <Button variant="secondary" onClick={this.props.onGoHome}>Go to Dashboard</Button>}
          </div>
        </div>
      </Card>
    )
  }
}
