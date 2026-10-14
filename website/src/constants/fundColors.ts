// constants/fundColors.ts — Tile color rules for fund cards (Funds + FundReport)
import type { Fund } from '../types'

/* ── TILE COLOR RULES:
   is_required = true  → GREEN top strip + lock icon (non-deletable, protected fund)
   is_required = false → random solid color from palette (deletable)
   Border always matches the strip color at 30% opacity for visual cohesion.     */
export const PROTECTED_COLOR = '#2E7D52'                                        // green = non-deletable
export const OPT_COLORS      = ['#4B5EAA','#2471A3','#7D3C98','#B7600A','#117A65','#C0392B','#1E2128','#0E6655']
export function fundTileColor(fund: Fund) {
  if (fund.is_required) return PROTECTED_COLOR
  return OPT_COLORS[(parseInt(fund.id, 10) - 1 || 0) % OPT_COLORS.length]
}
