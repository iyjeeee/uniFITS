// utils/formatters.ts — All formatting utilities for uniFITS Mobile
// Mirrors website's src/utils/formatters.js — same logic, TypeScript version

import { Config } from '@/constants/config';

/** formatCurrency — Format number as Philippine Peso (₱) */
export const formatCurrency = (amount: number | null | undefined, compact = false): string => {
  if (amount === null || amount === undefined) return '—';
  if (compact) {
    const abs = Math.abs(amount);
    if (abs >= 1_000_000) return `₱ ${(amount / 1_000_000).toFixed(1)}M`;
    if (abs >= 1_000)     return `₱ ${(amount / 1_000).toFixed(1)}K`;
  }
  // Using Intl.NumberFormat — available in React Native via Hermes
  return new Intl.NumberFormat(Config.LOCALE, {
    style:                 'currency',
    currency:              Config.CURRENCY_CODE,
    minimumFractionDigits: 2,
  }).format(amount);
};

type DateStyle = 'short' | 'medium' | 'long';

/** formatDate — Format date string or Date with locale options */
export const formatDate = (date: string | Date | null | undefined, style: DateStyle = 'medium'): string => {
  if (!date) return '—';
  const options: Record<DateStyle, Intl.DateTimeFormatOptions> = {
    short:  { month: 'short', day: 'numeric', year: '2-digit' },   // "Mar 15, '26"
    medium: { month: 'short', day: 'numeric', year: 'numeric' },    // "Mar 15, 2026"
    long:   { weekday: 'short', month: 'long', day: 'numeric', year: 'numeric' }, // "Sun, March 15, 2026"
  };
  try {
    return new Intl.DateTimeFormat(Config.LOCALE, options[style]).format(new Date(date));
  } catch {
    return String(date);
  }
};

/** formatNumber — Format number with thousands separator */
export const formatNumber = (num: number | null | undefined): string => {
  if (num === null || num === undefined) return '—';
  return new Intl.NumberFormat(Config.LOCALE).format(num);
};

/** formatPercent — Format decimal or raw percentage */
export const formatPercent = (value: number | null | undefined, raw = true): string => {
  if (value === null || value === undefined) return '—';
  const pct = raw ? value : value * 100;
  return `${pct.toFixed(1)}%`;
};

/** truncate — Clip string with ellipsis */
export const truncate = (str: string | null | undefined, max = 40): string => {
  if (!str) return '';
  return str.length > max ? `${str.slice(0, max)}…` : str;
};

/** getInitials — 'Juan Dela Cruz' → 'JD' (first 2 word initials) */
export const getInitials = (name = ''): string => {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0].toUpperCase())
    .join('');
};

/** fmt12 — Convert '14:30' (24-hr) to '2:30 PM' (12-hr) */
export const fmt12 = (t: string | null | undefined): string => {
  if (!t) return '—';
  const [h, m] = t.split(':').map(Number);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const h12  = h % 12 || 12;
  return `${h12}:${String(m).padStart(2, '0')} ${ampm}`;
};

/** relativeTime — '2m ago', '3h ago', '2d ago', falls back to formatDate */
export const relativeTime = (dateStr: string | null | undefined): string => {
  if (!dateStr) return '—';
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1)  return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24)  return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7)  return `${days}d ago`;
  return formatDate(dateStr, 'medium');
};

/** fundingPercent — Calculate funding progress 0-100 */
export const fundingPercent = (current: number, target: number): number => {
  if (!target) return 0;
  return Math.min(100, Math.round((current / target) * 100));
};
