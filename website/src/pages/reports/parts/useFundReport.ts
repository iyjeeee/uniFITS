// parts/useFundReport.ts — Fund report state: fund open in the detail modal, export confirmation, export feedback
import { useState } from 'react'
import { MOCK_FUNDS } from '../../../api/mockData'
import type { Fund } from '../../../types'

// FundExportResult — feedback shown after Export PDF
export interface FundExportResult { variant: string; title: string; message: string }

export default function useFundReport() {
  const required = MOCK_FUNDS.filter((f) => f.is_required)
  const optional = MOCK_FUNDS.filter((f) => !f.is_required)

  const [viewFund,     setViewFund]     = useState<Fund | null>(null)  // fund open in detail modal
  const [showExport,   setShowExport]   = useState(false) // export PDF confirmation
  const [exportResult, setExportResult] = useState<FundExportResult | null>(null)  // export feedback

  // Export from the detail footer: close the detail, ask for confirmation
  function startExport() { setViewFund(null); setShowExport(true) }

  function handleExport() {
    setShowExport(false)
    setExportResult({ variant: 'success', title: 'PDF Exported', message: `Fund Report PDF has been generated and is ready to download.` })
  }

  return { required, optional, viewFund, setViewFund, showExport, setShowExport, exportResult, setExportResult, startExport, handleExport }
}
