// types/announcement.ts — Announcement type definitions

// Announcement — matches MOCK_ANNOUNCEMENTS + backend announcements table
export interface Announcement {
  id: string
  title: string
  content: string
  is_pinned: boolean          // pinned announcements appear at the top
  created_by: string          // full name string
  created_at: string          // ISO date string
}
