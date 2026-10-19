// parts/useSettings.ts — Settings page state: system name, labels, security values, wipe modal, response feedback
// None of the values is persisted — the Save buttons only show a message (see bug log)
import { useState } from 'react'
import { useOrg } from '../../../context/OrgContext'
import { DEFAULT_SECURITY } from './settingsShared'
import type { SettingsResponse } from './settingsShared'

export default function useSettings() {
  const org = useOrg()
  const [systemName, setSystemName] = useState(org.name || 'uniFITS Organization')
  const [labels, setLabels] = useState<Record<string, string>>({
    people_label:      org.people_label,
    project_label:     org.project_label,
    event_label:       org.event_label,
    fund_label:        org.fund_label,
    transaction_label: org.transaction_label,
    utility_label:     org.utility_label,
    attendance_label:  org.attendance_label,
    report_label:      org.report_label,
  })
  const [security, setSecurity] = useState<Record<string, string | number>>(DEFAULT_SECURITY)
  const [showWipeModal, setShowWipeModal] = useState(false)
  const [response,      setResponse]      = useState<SettingsResponse | null>(null)

  const setLabel = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => setLabels((l) => ({ ...l, [k]: e.target.value }))
  const setSec = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => setSecurity((s) => ({ ...s, [k]: e.target.value }))

  const showOK = (title: string, message: string) => setResponse({ variant: 'success', title, message })
  const showWarn = (title: string, message: string) => setResponse({ variant: 'warning', title, message })
  const showErr = (title: string, message: string) => setResponse({ variant: 'danger',  title, message })

  function handleWipeAll() {
    setShowWipeModal(false)
    showErr('All Data Wiped', 'All club data has been permanently deleted. Core tables (settings, roles, members) remain intact.')
  }
  function handleWipeExceptCore() {
    setShowWipeModal(false)
    showWarn('Data Wiped (Core Kept)', 'All club activity data has been removed. Settings, roles, and member records are preserved.')
  }

  return { systemName, setSystemName, labels, security, showWipeModal, setShowWipeModal, response, setResponse, setLabel, setSec, showOK, handleWipeAll, handleWipeExceptCore }
}
