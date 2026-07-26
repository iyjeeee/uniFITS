// ManageEmployees.jsx — Manage Employees with KPI tiles + filter toolbar
import React, { useState } from 'react'
import { KpiGrid } from '../../components/KPI'
import { Button, Modal } from '../../components/shared'


// KPI tile metrics
const EMPLOYEE_METRICS = [
  { id:'emp-total',       color:'blue',   icon:'👥', value:'148',  label:'Total Employees',  trend:4,  trendLabel:'+4 this month',     period:'vs last month'  },
  { id:'emp-active',      color:'green',  icon:'✅', value:'131',  label:'Active Employees',  trend:2,  trendLabel:'+2 this week',      period:'vs last week'   },
  { id:'emp-on-leave',    color:'amber',  icon:'🏖️', value:'17',   label:'On Leave',          trend:-3, trendLabel:'-3 returned',       period:'vs yesterday'   },
  { id:'emp-new-hires',   color:'teal',   icon:'🆕', value:'6',    label:'New Hires',         trend:6,  trendLabel:'+6 this quarter',   period:'this quarter'   },
  { id:'emp-departments', color:'violet', icon:'🏢', value:'11',   label:'Departments',       trend:0,  trendLabel:'No change',         period:'this period'    },
  { id:'emp-turnover',    color:'rose',   icon:'📉', value:'3.2%', label:'Turnover Rate',     trend:-1, trendLabel:'-0.5% improved',    period:'vs last quarter'},
]

// Reusable filter select — white bg, border-card style, standard global hover animation
function FilterSelect({ value, onChange, options }) {
  return (
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      style={{
        padding: '7px 28px 7px 12px', borderRadius: 8, fontSize: 13, fontFamily: 'var(--font-body)',
        border: '1.5px solid var(--border-card)',
        background: '#fff', color: 'var(--text-primary)',
        cursor: 'pointer', outline: 'none',
        transition: 'border-color .18s ease, transform .18s ease, box-shadow .18s ease',
        appearance: 'none', WebkitAppearance: 'none',
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%231E2128' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E")`,
        backgroundRepeat: 'no-repeat', backgroundPosition: 'right 9px center',
        backgroundSize: '10px',
      }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 0 0 1.5px rgba(0,0,0,.70), 0 4px 12px rgba(0,0,0,.14)'; e.currentTarget.style.borderColor = 'var(--accent)' }}
      onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; e.currentTarget.style.borderColor = 'var(--border-card)' }}>
      {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  )
}

const ManageEmployees = () => {
  const [isAddOpen,    setIsAddOpen]    = useState(false)
  const [filterStatus, setFilterStatus] = useState('all')  // All Status
  const [filterType,   setFilterType]   = useState('all')  // All Types (department)

  const statusOptions = [
    { value:'all',       label:'All Status'   },
    { value:'active',    label:'Active'       },
    { value:'on-leave',  label:'On Leave'     },
    { value:'inactive',  label:'Inactive'     },
  ]
  const typeOptions = [
    { value:'all',          label:'All Types'     },
    { value:'engineering',  label:'Engineering'   },
    { value:'finance',      label:'Finance'       },
    { value:'hr',           label:'HR'            },
    { value:'operations',   label:'Operations'    },
    { value:'marketing',    label:'Marketing'     },
  ]

  return (
    <div className="page-wrapper">
      {/* Page header */}
      <header className="page-header">
        <div>
          <h1 className="page-title">Manage Employees</h1>
          <p className="page-subtitle">All employee records and department assignments</p>
        </div>
        <Button variant="primary" onClick={() => setIsAddOpen(true)}>+ Add Employee</Button>
      </header>

      {/* KPI tile grid */}
      <KpiGrid metrics={EMPLOYEE_METRICS} />

      {/* Filter toolbar */}
      <div style={{ display:'flex', gap:10, flexWrap:'wrap', marginBottom:16 }}>
        <FilterSelect value={filterStatus} onChange={setFilterStatus} options={statusOptions} />
        <FilterSelect value={filterType}   onChange={setFilterType}   options={typeOptions}   />
      </div>

      {/* Employee table area */}
      <div className="card">
        <p style={{ color:'var(--color-text-muted)', textAlign:'center', padding:'40px 0' }}>
          Employee records table renders here
          {filterStatus !== 'all' && ` · Status: ${filterStatus}`}
          {filterType   !== 'all' && ` · Dept: ${filterType}`}
        </p>
      </div>

      {/* Add Employee modal */}
      <Modal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} title="Add New Employee"
        footer={<><Button variant="secondary" onClick={() => setIsAddOpen(false)}>Cancel</Button><Button variant="primary" type="submit">Save Employee</Button></>}>
        <div className="form-group">
          <label className="form-label">Full Name <span>*</span></label>
          <input className="form-input" placeholder="e.g. Juan Dela Cruz" />
        </div>
        <div className="form-group">
          <label className="form-label">Department <span>*</span></label>
          <select className="form-select">
            <option>Select department…</option>
            <option>Engineering</option><option>Finance</option>
            <option>HR</option><option>Operations</option><option>Marketing</option>
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Status</label>
          <select className="form-select">
            <option>Active</option><option>On Leave</option><option>Inactive</option>
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Position</label>
          <input className="form-input" placeholder="e.g. Senior Developer" />
        </div>
        <div className="form-group">
          <label className="form-label">Start Date <span>*</span></label>
          <input className="form-input" type="date" />
        </div>
      </Modal>
    </div>
  )
}

export default ManageEmployees
