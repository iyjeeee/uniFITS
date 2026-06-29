// constants/config.ts — App-level configuration constants
// Update here when changing app name, locale, currency, or timeouts

export const Config = {
  APP_NAME:         'uniFITS',
  ORG_NAME:         'uniFITS Demo Organization',
  CURRENCY_SYMBOL:  '₱',
  CURRENCY_CODE:    'PHP',
  LOCALE:           'en-PH',
  API_TIMEOUT_MS:   10000,         // 10 seconds

  // Entity labels — matches website OrgContext defaults
  LABELS: {
    member:      'Member',
    project:     'Project',
    event:       'Event',
    fund:        'Fund',
    transaction: 'Transaction',
    attendance:  'Attendance',
  },
} as const;
