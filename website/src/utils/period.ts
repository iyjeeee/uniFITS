// utils/period.ts — Report periods (annual / quarterly / monthly): Manila "today", period -> date range, options and default from the data (B-04, B-31)
import { MONTH_NAMES } from '../constants/calendar'
import { approvedTx } from './ledger'
import type { Transaction } from '../types'

export interface PeriodRange { from: string; to: string }   // inclusive, 'YYYY-MM-DD'
export interface PeriodOption { value: string; label: string }

const QUARTER_TEXT = ['Jan–Mar', 'Apr–Jun', 'Jul–Sep', 'Oct–Dec']
const pad = (n: number) => String(n).padStart(2, '0')
const lastDay = (y: number, m: number) => new Date(Date.UTC(y, m, 0)).getUTCDate()   // m = 1..12

/* manilaToday -- today's date in the Philippines ('YYYY-MM-DD'), independent of the browser's time zone */
export function manilaToday(now: Date = new Date()): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Manila', year: 'numeric', month: '2-digit', day: '2-digit' }).format(now)
}

/* dayBefore -- the previous calendar day */
export function dayBefore(date: string): string {
  const [y, m, d] = date.split('-').map(Number)
  return new Date(Date.UTC(y, m - 1, d - 1)).toISOString().slice(0, 10)
}

/* inRange -- is a 'YYYY-MM-DD' date inside the range? (null range = no limit) */
export function inRange(date: string, range: PeriodRange | null): boolean {
  return !range || (date >= range.from && date <= range.to)
}

// quarterValue / monthValue -- the stored text of one option
const quarterValue = (y: number, q: number) => `Q${q} ${y} (${QUARTER_TEXT[q - 1]})`
const monthValue   = (y: number, m: number) => `${MONTH_NAMES[m - 1]} ${y}`

/* periodRange -- date range of "2025" / "Q2 2026 (Apr–Jun)" / "March 2025"; null when the text is not a period */
export function periodRange(type: string, period: string): PeriodRange | null {
  if (type === 'annual') { const y = /^\d{4}$/.test(period) ? Number(period) : NaN; return Number.isNaN(y) ? null : { from: `${y}-01-01`, to: `${y}-12-31` } }
  if (type === 'quarterly') {
    const m = /^Q([1-4]) (\d{4})/.exec(period); if (!m) return null
    const q = Number(m[1]), y = Number(m[2]), start = (q - 1) * 3 + 1, end = start + 2
    return { from: `${y}-${pad(start)}-01`, to: `${y}-${pad(end)}-${lastDay(y, end)}` }
  }
  const m = /^([A-Za-z]+) (\d{4})$/.exec(period); const idx = m ? MONTH_NAMES.indexOf(m[1]) : -1
  if (!m || idx < 0) return null
  const y = Number(m[2]); return { from: `${y}-${pad(idx + 1)}-01`, to: `${y}-${pad(idx + 1)}-${lastDay(y, idx + 1)}` }
}

// periodOf -- the option value that contains a date
function periodOf(type: string, date: string): string {
  const y = Number(date.slice(0, 4)), m = Number(date.slice(5, 7))
  return type === 'annual' ? String(y) : type === 'quarterly' ? quarterValue(y, Math.ceil(m / 3)) : monthValue(y, m)
}

/* getPeriodOptions -- periods from the first approved record's year up to today, newest first (no future periods) */
export function getPeriodOptions(type: string, txs: Transaction[], today: string): PeriodOption[] {
  const nowY = Number(today.slice(0, 4)), nowM = Number(today.slice(5, 7))
  const years = approvedTx(txs).map((t) => Number(t.transaction_date.slice(0, 4)))
  const firstY = Math.min(nowY, ...(years.length ? years : [nowY]))
  const out: PeriodOption[] = []
  for (let y = nowY; y >= firstY; y--) {
    if (type === 'annual') { out.push({ value: String(y), label: String(y) }); continue }
    const lastM = y === nowY ? nowM : 12
    if (type === 'quarterly') for (let q = Math.ceil(lastM / 3); q >= 1; q--) out.push({ value: quarterValue(y, q), label: quarterValue(y, q) })
    else for (let m = lastM; m >= 1; m--) out.push({ value: monthValue(y, m), label: monthValue(y, m) })
  }
  return out
}

/* getDefaultPeriod -- the period of the latest real activity (opening balances are setup entries), else the current period */
export function getDefaultPeriod(type: string, txs: Transaction[], today: string): string {
  const dates = approvedTx(txs).filter((t) => t.entry_type !== 'opening_balance' && t.transaction_date <= today).map((t) => t.transaction_date).sort()
  return periodOf(type, dates.length ? dates[dates.length - 1] : today)
}
