// ManageUtilities.jsx — Manage Utilities with KPI tiles + filter toolbar
import React, { useState } from 'react'
import { KpiGrid } from '../../components/KPI'
import { Button, Modal } from '../../components/shared'
import '../../styles/global.css'

const UTILITY_METRICS = [
  { id:'util-active',      color:'sky',   icon:'⚡',  value:'9',     label:'Active Utilities',       trend:0,  trendLabel:'All operational',  period:'today'          },
  { id:'util-maintenance', color:'amber', icon:'🔧',  value:'4',     label:'Pending Maintenance',    trend:-2, trendLabel:'-2 scheduled',     period:'vs last week',  showBadge:true },
  { id:'util-resolved',    color:'green', icon:'✅',  value:'18',    label:'Resolved This Month',    trend:3,  trendLabel:'+3 more',          period:'vs last month'  },
  { id:'util-assets',      color:'teal',  icon:'🏗️', value:'63',    label:'Total Assets',           trend:2,  trendLabel:'+2 added',         period:'this quarter'   },
  { id:'util-downtime',    color:'rose',  icon:'⏱️', value:'1.4h',  label:'Downtime This Month',    trend:-1, trendLabel:'-0.6h improved',   period:'vs last month'  },
  { id:'util-uptime',      color:'blue',  icon:'📶',  value:'99.1%', label:'System Uptime',          trend:1,  trendLabel:'+0.3% up',         period:'vs last month'  },
]

function FilterSelect({ value, onChange, options }) {
  const [hov, setHov] = useState(false)
  return (
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        padding: '7px 28px 7px 12px', borderRadius: 8, fontSize: 13, fontFamily: 'inherit',
        border: '1px solid var(--color-border-dark)',
        background: hov ? '#4A5264' : '#5A6474',
        color: '#fff',
        cursor: 'pointer', outline: 'none',
        transition: 'background .18s ease, transform .18s ease, box-shadow .18s ease',
        transform: hov ? 'translateY(-2px)' : 'none',
        boxShadow: hov ? '0 0 0 1.5px rgba(0,0,0,.70), 0 4px 12px rgba(0,0,0,.14)' : 'none',
        appearance: 'none', WebkitAppearance: 'none',
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%23ffffff' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E")`,
        backgroundRepeat: 'no-repeat', backgroundPosition: 'right 9px center',
        backgroundSize: '10px',
      }}>
      {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  )
}

const ManageUtilities = () => {
  const [isAddOpen,    setIsAddOpen]    = useState(false)
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterType,   setFilterType]   = useState('all')

  const statusOptions = [
    { value:'all',                label:'All Status'          },
    { value:'operational',        label:'Operational'         },
    { value:'under-maintenance',  label:'Under Maintenance'   },
    { value:'offline',            label:'Offline'             },
    { value:'pending',            label:'Pending'             },
  ]
  const typeOptions = [
    { value:'all',              label:'All Types'        },
    { value:'electrical',       label:'Electrical'       },
    { value:'plumbing',         label:'Plumbing'         },
    { value:'hvac',             label:'HVAC'             },
    { value:'it-infrastructure',label:'IT Infrastructure'},
    { value:'equipment',        label:'Equipment'        },
    { value:'other',            label:'Other'            },
  ]

  return (
    <div className="page-wrapper">
      <header className="page-header">
        <div>
          <h1 className="page-title">Manage Utilities</h1>
          <p className="page-subtitle">Monitor assets, maintenance requests, and system health</p>
        </div>
        <Button variant="primary" onClick={() => setIsAddOpen(true)}>+ Add Utility</Button>
      </header>

      <KpiGrid metrics={UTILITY_METRICS} />

      {/* Filter toolbar */}
      <div style={{ display:'flex', gap:10, flexWrap:'wrap', marginBottom:16 }}>
        <FilterSelect value={filterStatus} onChange={setFilterStatus} options={statusOptions} />
        <FilterSelect value={filterType}   onChange={setFilterType}   options={typeOptions}   />
      </div>

      <div className="card">
        <p style={{ color:'var(--color-text-muted)', textAlign:'center', padding:'40px 0' }}>
          Utilities list / maintenance log renders here
          {filterStatus !== 'all' && ` · Status: ${filterStatus}`}
          {filterType   !== 'all' && ` · Type: ${filterType}`}
        </p>
      </div>

      <Modal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} title="Add Utility / Asset"
        footer={<><Button variant="secondary" onClick={() => setIsAddOpen(false)}>Cancel</Button><Button variant="primary">Save Utility</Button></>}>
        <div className="form-group">
          <label className="form-label">Utility / Asset Name <span>*</span></label>
          <input className="form-input" placeholder="e.g. HVAC Unit – Floor 3" />
        </div>
        <div className="form-group">
          <label className="form-label">Category</label>
          <select className="form-select">
            <option>Electrical</option><option>Plumbing</option>
            <option>HVAC</option><option>IT Infrastructure</option>
            <option>Equipment</option><option>Other</option>
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Status</label>
          <select className="form-select">
            <option>Operational</option><option>Under Maintenance</option>
            <option>Offline</option><option>Pending</option>
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Notes</label>
          <textarea className="form-textarea" placeholder="Additional notes or maintenance history…" />
        </div>
      </Modal>
    </div>
  )
}

export default ManageUtilities
