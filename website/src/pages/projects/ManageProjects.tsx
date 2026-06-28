// ManageProjects.jsx — Manage Projects with KPI tiles + filter toolbar
import React, { useState } from 'react'
import { KpiGrid } from '../../components/KPI'
import { Button, Modal } from '../../components/shared'


const PROJECT_METRICS = [
  { id:'proj-total',      color:'teal',   icon:'📁', value:'47',  label:'Total Projects',    trend:5,  trendLabel:'+5 this year',      period:'vs last year'   },
  { id:'proj-active',     color:'blue',   icon:'🚀', value:'23',  label:'Active Projects',   trend:2,  trendLabel:'+2 launched',       period:'this month'     },
  { id:'proj-on-hold',    color:'amber',  icon:'⏸️', value:'5',   label:'On Hold',           trend:-1, trendLabel:'-1 resumed',        period:'vs last week',  showBadge:true },
  { id:'proj-completed',  color:'green',  icon:'🏁', value:'16',  label:'Completed',         trend:4,  trendLabel:'+4 this quarter',   period:'this quarter'   },
  { id:'proj-overdue',    color:'rose',   icon:'⚠️', value:'3',   label:'Overdue',           trend:-2, trendLabel:'-2 resolved',       period:'vs last month', showBadge:true },
  { id:'proj-completion', color:'violet', icon:'📈', value:'78%', label:'Completion Rate',   trend:6,  trendLabel:'+6% up',            period:'vs last quarter'},
]

// Reusable filter select — white bg, border-card style, standard global hover animation
function FilterSelect({ value, onChange, options }: Record<string, any>) {
  return (
    <select
      value={value}
      onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => onChange(e.target.value)}
      style={{
        padding: '7px 28px 7px 12px', borderRadius: 8, fontSize: 13, fontFamily: 'var(--font-body)',
        border: '1.5px solid var(--border-card)',
        background: '#fff', color: 'var(--text-primary)',
        cursor: 'pointer' as const, outline: 'none',
        transition: 'border-color .18s ease, transform .18s ease, box-shadow .18s ease',
        appearance: 'none', WebkitAppearance: 'none',
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%231E2128' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E")`,
        backgroundRepeat: 'no-repeat', backgroundPosition: 'right 9px center',
        backgroundSize: '10px',
      }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 0 0 1.5px rgba(0,0,0,.70), 0 4px 12px rgba(0,0,0,.14)'; e.currentTarget.style.borderColor = 'var(--accent)' }}
      onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; e.currentTarget.style.borderColor = 'var(--border-card)' }}>
      {options.map((o: any) => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  )
}

const ManageProjects = () => {
  const [isAddOpen,    setIsAddOpen]    = useState(false)
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterType,   setFilterType]   = useState('all')

  const statusOptions = [
    { value:'all',       label:'All Status'  },
    { value:'active',    label:'Active'      },
    { value:'on-hold',   label:'On Hold'     },
    { value:'completed', label:'Completed'   },
    { value:'overdue',   label:'Overdue'     },
    { value:'cancelled', label:'Cancelled'   },
  ]
  const typeOptions = [
    { value:'all',               label:'All Types'          },
    { value:'community-service', label:'Community Service'  },
    { value:'medical-mission',   label:'Medical Mission'    },
    { value:'livelihood',        label:'Livelihood'         },
    { value:'education',         label:'Education'          },
    { value:'infrastructure',    label:'Infrastructure'     },
    { value:'other',             label:'Other'              },
  ]

  return (
    <div className="page-wrapper">
      <header className="page-header">
        <div>
          <h1 className="page-title">Manage Projects</h1>
          <p className="page-subtitle">Track all projects, milestones, and team assignments</p>
        </div>
        <Button variant="primary" onClick={() => setIsAddOpen(true)}>+ New Project</Button>
      </header>

      <KpiGrid metrics={PROJECT_METRICS} />

      {/* Filter toolbar */}
      <div style={{ display:'flex', gap:10, flexWrap:'wrap', marginBottom:16 }}>
        <FilterSelect value={filterStatus} onChange={setFilterStatus} options={statusOptions} />
        <FilterSelect value={filterType}   onChange={setFilterType}   options={typeOptions}   />
      </div>

      <div className="card">
        <p style={{ color:'var(--color-text-muted)', textAlign:'center', padding:'40px 0' }}>
          Projects table / kanban renders here
          {filterStatus !== 'all' && ` · Status: ${filterStatus}`}
          {filterType   !== 'all' && ` · Type: ${filterType}`}
        </p>
      </div>

      <Modal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} title="Create New Project"
        footer={<><Button variant="secondary" onClick={() => setIsAddOpen(false)}>Cancel</Button><Button variant="primary">Create Project</Button></>}>
        <div className="form-group">
          <label className="form-label">Project Name <span>*</span></label>
          <input className="form-input" placeholder="e.g. Community Outreach Drive" />
        </div>
        <div className="form-group">
          <label className="form-label">Type</label>
          <select className="form-select">
            <option>Community Service</option><option>Medical Mission</option>
            <option>Livelihood</option><option>Education</option>
            <option>Infrastructure</option><option>Other</option>
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Status</label>
          <select className="form-select">
            <option>Active</option><option>On Hold</option>
            <option>Completed</option><option>Cancelled</option>
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Start Date</label>
          <input className="form-input" type="date" />
        </div>
        <div className="form-group">
          <label className="form-label">Target End Date</label>
          <input className="form-input" type="date" />
        </div>
        <div className="form-group">
          <label className="form-label">Description</label>
          <textarea className="form-textarea" placeholder="Project overview and goals…" />
        </div>
      </Modal>
    </div>
  )
}

export default ManageProjects
