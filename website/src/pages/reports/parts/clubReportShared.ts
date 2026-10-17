// parts/clubReportShared.ts — Club report constants and period helpers (years hard-coded to 2025 — see bug log B-04)
import { MONTH_NAMES } from '../../../constants/calendar'

export const REPORT_TYPE_OPTIONS = [
  { value: 'annual',    label: 'Annual Report'    },
  { value: 'quarterly', label: 'Quarterly Report' },
  { value: 'monthly',   label: 'Monthly Report'   },
]

export const YEARS = [2025, 2024, 2023]
export const QUARTERS = ['Q1 (Jan–Mar)', 'Q2 (Apr–Jun)', 'Q3 (Jul–Sep)', 'Q4 (Oct–Dec)']

// Period dropdown options for the chosen report type
export function getPeriodOptions(reportType: string) {
  return reportType === 'annual'
    ? YEARS.map(y    => ({ value: String(y),           label: String(y)           }))
    : reportType === 'quarterly'
    ? QUARTERS.map((q) => ({ value: q,                   label: q                   }))
    : MONTH_NAMES.map(m   => ({ value: m + ' 2025',         label: m + ' 2025'         }))
}

// Default period when the report type changes
export function getDefaultPeriod(reportType: string) {
  return reportType === 'annual' ? '2025' : reportType === 'quarterly' ? 'Q1 (Jan–Mar)' : 'January 2025'
}

// ClubReportExportResult — feedback shown in the ResponseModal after Export PDF
export interface ClubReportExportResult { variant: string; title: string; message: string }
