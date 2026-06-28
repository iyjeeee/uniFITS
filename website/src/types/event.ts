// types/event.ts — Event type definitions
// Named AppEvent (not Event) to avoid collision with the DOM's built-in Event type

export type EventStatus = 'upcoming' | 'ongoing' | 'completed' | 'cancelled' | 'rejected'

// AppEvent — matches MOCK_EVENTS + backend events table
// event_time stored as 24-hr 'HH:MM' string — use fmt12() from mockData.ts for display
export interface AppEvent {
  id: string
  title: string
  description: string
  event_date: string          // 'YYYY-MM-DD'
  event_time: string          // 'HH:MM' 24-hr format — always display via fmt12()
  location: string
  status: EventStatus
  target_funding: number      // PHP amount
  current_funding: number     // PHP amount
}
