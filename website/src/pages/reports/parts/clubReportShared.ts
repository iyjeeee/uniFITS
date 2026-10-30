// parts/clubReportShared.ts — Club report constants and period helpers (options + default come from the data and today's Manila date; see utils/period.ts)
import { MOCK_TRANSACTIONS } from '../../../api/mockData'
import { getPeriodOptions as periodOptions, getDefaultPeriod as defaultPeriod, manilaToday } from '../../../utils/period'

export const REPORT_TYPE_OPTIONS = [
  { value: 'annual',    label: 'Annual Report'    },
  { value: 'quarterly', label: 'Quarterly Report' },
  { value: 'monthly',   label: 'Monthly Report'   },
]

// Period dropdown options for the chosen report type (first approved record's year up to today, newest first)
export function getPeriodOptions(reportType: string) { return periodOptions(reportType, MOCK_TRANSACTIONS, manilaToday()) }

// Default period when the report type changes: the period of the latest activity
export function getDefaultPeriod(reportType: string) { return defaultPeriod(reportType, MOCK_TRANSACTIONS, manilaToday()) }

// ClubReportExportResult — feedback shown in the ResponseModal after Export PDF
export interface ClubReportExportResult { variant: string; title: string; message: string }
