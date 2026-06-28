// ManageEvents.jsx — Manage Events with KPI tiles + filter toolbar
import React, { useState } from 'react'
import { KpiGrid } from '../../components/KPI'
import { Button, Modal } from '../../components/shared'


const EVENT_METRICS = [
  { id:'evt-total',      color:'violet', icon:'🗓️', value:'54',  label:'Total Events',    trend:8,  trendLabel:'+8 this year',       period:'vs last year'   },
  { id:'evt-upcoming',   color:'amber',  icon:'⏳', value:'11',  label:'Upcoming',         trend:3,  trendLabel:'+3 scheduled',       period:'this month'     },
  { id:'evt-ongoing',    color:'blue',   icon:'▶️', value:'2',   label:'Ongoing',          trend:0,  trendLabel:'Live now',           period:'today'          },
  { id:'evt-completed',  color:'teal',   icon:'✅', value:'38',  label:'Completed',        trend:5,  trendLabel:'+5 this quarter',    period:'this quarter'   },
  { id:'evt-cancelled',  color:'rose',   icon:'❌', value:'3',   label:'Cancelled',        trend:-2, trendLabel:'-2 fewer',           period:'vs last month'  },
  { id:'evt-attendance', color:'amber',  icon:'📊', value:'87%', label:'Avg Attendance',   trend:3,  trendLabel:'+3% improved',       period:'vs last quarter'},
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

const ManageEvents = () => {
  const [isAddOpen,    setIsAddOpen]    = useState(false)
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterType,   setFilterType]   = useState('all')

  const statusOptions = [
    { value:'all',       label:'All Status'  },
    { value:'upcoming',  label:'Upcoming'    },
    { value:'ongoing',   label:'Ongoing'     },
    { value:'completed', label:'Completed'   },
    { value:'cancelled', label:'Cancelled'   },
  ]
  const typeOptions = [
    { value:'all',            label:'All Types'         },
    { value:'seminar',        label:'Seminar'           },
    { value:'outreach',       label:'Outreach'          },
    { value:'general-assembly', label:'General Assembly'},
    { value:'sports',         label:'Sports'            },
    { value:'cultural',       label:'Cultural'          },
    { value:'other',          label:'Other'             },
  ]

  return (
    <div className="page-wrapper">
      <header className="page-header">
        <div>
          <h1 className="page-title">Manage Events</h1>
          <p className="page-subtitle">Plan, track, and review organizational events</p>
        </div>
        <Button variant="primary" onClick={() => setIsAddOpen(true)}>+ New Event</Button>
      </header>

      <KpiGrid metrics={EVENT_METRICS} />

      {/* Filter toolbar */}
      <div style={{ display:'flex', gap:10, flexWrap:'wrap', marginBottom:16 }}>
        <FilterSelect value={filterStatus} onChange={setFilterStatus} options={statusOptions} />
        <FilterSelect value={filterType}   onChange={setFilterType}   options={typeOptions}   />
      </div>

      <div className="card">
        <p style={{ color:'var(--color-text-muted)', textAlign:'center', padding:'40px 0' }}>
          Events list / calendar renders here
          {filterStatus !== 'all' && ` · Status: ${filterStatus}`}
          {filterType   !== 'all' && ` · Type: ${filterType}`}
        </p>
      </div>

      <Modal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} title="Create New Event"
        footer={<><Button variant="secondary" onClick={() => setIsAddOpen(false)}>Cancel</Button><Button variant="primary">Create Event</Button></>}>
        <div className="form-group">
          <label className="form-label">Event Name <span>*</span></label>
          <input className="form-input" placeholder="e.g. Annual General Meeting" />
        </div>
        <div className="form-group">
          <label className="form-label">Type</label>
          <select className="form-select">
            <option>Seminar</option><option>Outreach</option>
            <option>General Assembly</option><option>Sports</option>
            <option>Cultural</option><option>Other</option>
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Status</label>
          <select className="form-select">
            <option>Upcoming</option><option>Ongoing</option>
            <option>Completed</option><option>Cancelled</option>
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Date <span>*</span></label>
          <input className="form-input" type="date" />
        </div>
        <div className="form-group">
          <label className="form-label">Time</label>
          <input className="form-input" type="time" />
        </div>
        <div className="form-group">
          <label className="form-label">Location</label>
          <input className="form-input" placeholder="e.g. Conference Room A" />
        </div>
        <div className="form-group">
          <label className="form-label">Description</label>
          <textarea className="form-textarea" placeholder="Brief description of the event…" />
        </div>
      </Modal>
    </div>
  )
}

export default ManageEvents
