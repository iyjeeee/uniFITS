// types/audit.ts — Audit log type definitions

export type AuditAction = 'login' | 'logout' | 'insert' | 'update' | 'delete' | 'backup' | 'restore'

// AuditLog — matches MOCK_AUDIT_LOGS + backend audit_logs table
export interface AuditLog {
  id: string
  user_id: string | null      // FK to users.id of the actor; null = the System -- name via getActorName()
  action: AuditAction
  table_name: string          // e.g. 'users', 'transactions', 'sessions'
  summary: string             // human-readable description of the action
  ip_address: string          // e.g. '192.168.1.1'
  created_at: string          // ISO date string
}

// BackupJob — matches MOCK_BACKUP_JOBS + backend backup_jobs table
export type BackupJobStatus = 'success' | 'failed' | 'running'
export type BackupTrigger = 'scheduled' | 'manual'

export interface BackupJob {
  id: string
  filename: string            // e.g. 'backup_2025-03-15_auto.sql.gz'
  job_type: 'backup' | 'restore'
  trigger: BackupTrigger
  file_size_bytes: number
  status: BackupJobStatus
  started_at: string          // ISO date string
  completed_at: string        // ISO date string
  created_by: string | null   // FK to users.id of who started it; null = the System (scheduled job)
}
