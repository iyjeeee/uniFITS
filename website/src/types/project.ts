// types/project.ts — Project type definitions

export type ProjectStatus = 'upcoming' | 'ongoing' | 'completed' | 'cancelled' | 'rejected'

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
export interface Project {
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
}
