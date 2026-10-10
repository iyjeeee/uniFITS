// Backup.jsx — Backup & Recovery System; create, restore, export, download backups
// Responsive via useBreakpoint — action tile grid collapses on mobile
import { useState } from 'react'
import { Badge, Button, Card, CardHeader, ResponseModal } from '../../components/ui'
import { MOCK_BACKUP_JOBS, formatDate } from '../../api/mockData'
import useBreakpoint from '../../hooks/useBreakpoint'

// SVG icons for action tiles — no emoji
function IconSave()    { return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg> }
function IconExport()  { return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg> }
function IconRestore() { return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-3.5"/></svg> }
function IconTrash()   { return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg> }
function IconInfo()    { return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg> }

function formatFileSize(bytes: number): string {
  if (!bytes) return '—'
  return (bytes / 1024 / 1024).toFixed(2) + ' MB'
}

export default function Backup() {
  const { isMobile, isTablet } = useBreakpoint()
  const actionCols = isMobile ? 'repeat(2,1fr)' : 'repeat(4,1fr)' // action tiles responsive
  const backupLayout = isMobile || isTablet ? '1fr' : '1fr 240px' // history + status panel
  const [jobs, setJobs]         = useState(MOCK_BACKUP_JOBS)
  const [creating, setCreating] = useState(false)
  // Feedback modal state — replaces all native alert() calls
  const [feedback, setFeedback] = useState<{ open: boolean; title: string; message: string }>({ open: false, title: '', message: '' })
  const notify = (title: string, message: string) => setFeedback({ open: true, title, message })
  // Simulate creating a new backup job
  function handleCreateBackup() {
    setCreating(true)
    setTimeout(() => {
      const now = new Date().toISOString()
      setJobs(prev => [{
        id: String(Date.now()), filename: `backup_${now.slice(0,10)}.sql.gz`,
        job_type: 'backup', trigger: 'manual', file_size_bytes: 4200000,
        status: 'success', started_at: now, completed_at: now, created_by: 'Current User',
      }, ...prev])
      setCreating(false)
    }, 1500)
  }

  // Quick action tiles config
  const actions = [
    { label: 'Create New Backup', color: 'var(--accent)',  bg: 'var(--accent-light)',  icon: <IconSave />,    onClick: handleCreateBackup,                              loading: creating },
    { label: 'Export Database',   color: 'var(--success)', bg: 'var(--success-light)', icon: <IconExport />,  onClick: () => notify('Export Started', 'A secure SQL dump is being prepared for download.') },
    { label: 'Restore System',    color: 'var(--warning)', bg: 'var(--warning-light)', icon: <IconRestore />, onClick: () => notify('Restore System', 'Select a backup file from the list below to restore.') },
    { label: 'Force Full Cleanup',color: 'var(--danger)',  bg: 'var(--danger-light)',  icon: <IconTrash />,   onClick: () => notify('Cleanup Started', 'Old backup files are being removed from the system.') },
  ]

  return (
    <div style={{ display: 'flex' as const, flexDirection: 'column' as const, gap: 14 }}>

      {/* Quick action tiles */}
      <div style={{ display: 'grid' as const, gridTemplateColumns: actionCols, gap: 12 }}>
        {actions.map((b: any) => (
          <button key={b.label} onClick={b.onClick} style={{ padding: '18px 14px', borderRadius: 'var(--radius-md)', border: `1px solid ${b.color}25`, background: b.bg, cursor: 'pointer' as const, textAlign: 'center' as const, fontFamily: 'var(--font-body)', transition: 'box-shadow .15s' }}>
            <div style={{ color: b.color, display: 'flex' as const, justifyContent: 'center', marginBottom: 8 }}>{b.icon}</div>
            <div style={{ fontSize: 13, fontWeight: 600, color: b.color }}>{b.label}</div>
            {b.loading && <div style={{ fontSize: 11.5, color: 'var(--text-muted)', marginTop: 4 }}>Running…</div>}
          </button>
        ))}
      </div>

      {/* Backup table + guide sidebar */}
      <div style={{ display: 'grid' as const, gridTemplateColumns: backupLayout, gap: 14, alignItems: 'flex-start' }}>

        <Card>
          <CardHeader title="Backup & Recovery System" subtitle="Manage and restore your system backups" />

          {/* Info banner — SVG icon, no emoji */}
          <div style={{ margin: '14px 18px 0', padding: '12px 14px', background: 'var(--info-light)', borderLeft: '3px solid var(--info)', borderRadius: '0 6px 6px 0' }}>
            <div style={{ display: 'flex' as const, alignItems: 'center', gap: 7, fontSize: 13, fontWeight: 600, color: 'var(--info)', marginBottom: 5 }}>
              <IconInfo /> Backup Information
            </div>
            <div style={{ fontSize: 12.5, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              ZIP files contain database (.sql) and files (.zip) — best for full system recovery.<br />
              Auto backups are created daily. Manual backups are created on demand.<br />
              Use Restore to recover your system from available backups.
            </div>
          </div>

          <div style={{ overflowX: 'auto' as const, marginTop: 14 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ background: 'var(--table-header-bg)' }}>
                  {['#','Filename','Type','Format','Date','Size','Actions'].map((h: any) => (
                    <th key={h} style={{ padding: '9px 14px', textAlign: 'left' as const, fontSize: 11, fontWeight: 600, color: 'var(--table-head-fg)', textTransform: 'uppercase' as const, letterSpacing: '.06em', borderBottom: '2px solid var(--border-table)', whiteSpace: 'nowrap' as const }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {jobs.map((job, i) => (
                  <tr key={job.id} style={{ borderBottom: '1px solid var(--border-inner)' }}>
                    <td style={{ padding: '10px 14px', color: 'var(--text-muted)', fontSize: 12 }}>{jobs.length - i}</td>
                    <td style={{ padding: '10px 14px' }}><code style={{ fontSize: 11 }}>{job.filename}</code></td>
                    <td style={{ padding: '10px 14px' }}><Badge variant={job.trigger === 'scheduled' ? 'info' : 'accent'}>{job.trigger}</Badge></td>
                    <td style={{ padding: '10px 14px' }}><Badge variant="neutral">ZIP</Badge></td>
                    <td style={{ padding: '10px 14px' }}>{formatDate(job.started_at)}</td>
                    <td style={{ padding: '10px 14px' }}>{formatFileSize(job.file_size_bytes)}</td>
                    <td style={{ padding: '10px 14px' }}>
                      <div style={{ display: 'flex' as const, gap: 6 }}>
                        <Button variant="secondary" size="sm" onClick={() => notify('Restore', `Restoring system from ${job.filename}…`)}>Restore</Button>
                        <Button variant="secondary" size="sm" onClick={() => notify('Download', `Preparing ${job.filename} for download…`)}>Download</Button>
                        <Button variant="danger"    size="sm">Delete</Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Quick guide */}
        <Card style={{ padding: 18 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 14 }}>Quick Guide</div>
          {[
            ['Create Backup',   'Full or incremental backups. Auto-generated daily.'],
            ['Export Database', 'Secure SQL export for manual transfer or off-site storage.'],
            ['Restore System',  'Restore from a selected backup file.'],
          ].map(([k, v]) => (
            <div key={k} style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--accent)', marginBottom: 3 }}>{k}</div>
              <div style={{ fontSize: 12.5, color: 'var(--text-muted)', lineHeight: 1.55 }}>{v}</div>
            </div>
          ))}
          <div style={{ display: 'flex' as const, flexDirection: 'column' as const, gap: 8, marginTop: 16 }}>
            <Button variant="secondary" size="sm" style={{ width: '100%', justifyContent: 'center' }}>View Backup Statistics</Button>
            <Button variant="secondary" size="sm" style={{ width: '100%', justifyContent: 'center' }}>View Cleanup Statistics</Button>
          </div>
        </Card>
      </div>

      {/* Feedback modal — replaces all native alert() calls */}
      <ResponseModal
        open={feedback.open}
        onClose={() => setFeedback(f => ({ ...f, open: false }))}
        variant="info"
        title={feedback.title}
        message={feedback.message}
        confirmLabel="OK"
      />
    </div>
  )
}
