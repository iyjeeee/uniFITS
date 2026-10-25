// types/project.ts — Project type definitions

import type { ReviewFields } from './approval'

// Lifecycle status only - whether the project is approved is ReviewFields.approval_status
export type ProjectStatus = 'upcoming' | 'ongoing' | 'completed' | 'cancelled'

export type ProjectType =
  | 'Medical Mission'
  | 'Community Service'
  | 'Environmental'
  | 'Education'
  | 'Livelihood'
  | 'Sports'
  | 'Cultural'
  | 'Other'

// Project — matches MOCK_PROJECTS + backend projects table
export interface Project extends ReviewFields {
  id: string
  title: string
  project_type: string        // ProjectType string — permissive for custom types
  description: string
  start_date: string          // 'YYYY-MM-DD'
  end_date: string            // 'YYYY-MM-DD'
  location: string
  status: ProjectStatus
  target_funding: number      // PHP amount
  current_funding: number     // PHP amount
  photo_url?: string | null   // optional cover photo (set by Add/Edit pages)
}
