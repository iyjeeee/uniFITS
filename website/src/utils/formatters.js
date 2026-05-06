// utils/formatters.js — Shared formatting utilities for uniFITS
// Currency, dates, numbers, percentages — centralized here for consistency

/**
 * formatCurrency — Format a number as Philippine Peso (₱)
 * @param {number} amount
 * @param {boolean} compact - Use compact notation (e.g. ₱ 4.8M)
 * @returns {string}
 */
export const formatCurrency = (amount, compact = false) => {
  if (amount === null || amount === undefined) return '—';
  if (compact) {
    const abs = Math.abs(amount);
    if (abs >= 1_000_000) return `₱ ${(amount / 1_000_000).toFixed(1)}M`;
    if (abs >= 1_000)     return `₱ ${(amount / 1_000).toFixed(1)}K`;
  }
  return new Intl.NumberFormat('en-PH', {
    style:    'currency',
    currency: 'PHP',
    minimumFractionDigits: 2,
  }).format(amount);
};

/**
 * formatDate — Format a date string or Date object
 * @param {string|Date} date
 * @param {string}      style - 'short' | 'medium' | 'long'
 * @returns {string}
 */
export const formatDate = (date, style = 'medium') => {
  if (!date) return '—';
  const options = {
    short:  { month: 'short', day: 'numeric', year: '2-digit' },
    medium: { month: 'short', day: 'numeric', year: 'numeric' },
    long:   { weekday: 'short', month: 'long', day: 'numeric', year: 'numeric' },
  };
  return new Intl.DateTimeFormat('en-PH', options[style] ?? options.medium).format(new Date(date));
};

/**
 * formatNumber — Format a number with thousands separator
 * @param {number} num
 * @returns {string}
 */
export const formatNumber = (num) => {
  if (num === null || num === undefined) return '—';
  return new Intl.NumberFormat('en-PH').format(num);
};

/**
 * formatPercent — Format a decimal as percentage
 * @param {number} value  - Decimal value (0.87 → "87%") or raw (87 → "87%")
 * @param {boolean} raw   - If true, value is already a percentage (skip *100)
 * @returns {string}
 */
export const formatPercent = (value, raw = true) => {
  if (value === null || value === undefined) return '—';
  const pct = raw ? value : value * 100;
  return `${pct.toFixed(1)}%`;
};

/**
 * truncate — Truncate long strings with ellipsis
 * @param {string} str
 * @param {number} max
 * @returns {string}
 */
export const truncate = (str, max = 40) => {
  if (!str) return '';
  return str.length > max ? `${str.slice(0, max)}…` : str;
};

/**
 * getInitials — Get uppercase initials from a full name
 * @param {string} name
 * @returns {string} e.g. "Juan Dela Cruz" → "JD"
 */
export const getInitials = (name = '') => {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0].toUpperCase())
    .join('');
};
