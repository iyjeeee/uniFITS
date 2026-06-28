// ManageFunds.jsx — Manage Funds with KPI tiles + filter toolbar
import React, { useState } from 'react'
import { KpiGrid } from '../../components/KPI'
import { Button, Modal } from '../../components/shared'


const FUND_METRICS = [
  { id:'fund-total',       color:'green',  icon:'💰', value:'₱ 4.8M', label:'Total Funds',          trend:1,  trendLabel:'+₱ 120K',       period:'this quarter'   },
  { id:'fund-allocated',   color:'blue',   icon:'📦', value:'₱ 3.1M', label:'Allocated',            trend:2,  trendLabel:'+₱ 80K',        period:'vs last month'  },
  { id:'fund-available',   color:'teal',   icon:'💵', value:'₱ 1.7M', label:'Available Balance',    trend:-1, trendLabel:'-₱ 40K used',   period:'vs last month'  },
  { id:'fund-expenses',    color:'amber',  icon:'💸', value:'₱ 540K', label:'Monthly Expenses',     trend:-4, trendLabel:'-4% lower',     period:'vs last month'  },
  { id:'fund-utilization', color:'violet', icon:'📊', value:'64%',    label:'Budget Utilization',   trend:3,  trendLabel:'+3% used',      period:'vs last quarter'},
  { id:'fund-pending',     color:'rose',   icon:'🕐', value:'12',     label:'Pending Approvals',    trend:-3, trendLabel:'-3 approved',   period:'vs yesterday',  showBadge:true },
]

function FilterSelect({ value, onChange, options }: Record<string, any>) {
  const [hov, setHov] = useState(false)
  return (
    <select
      value={value}
      onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => onChange(e.target.value)}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        padding: '7px 28px 7px 12px', borderRadius: 8, fontSize: 13, fontFamily: 'inherit',
        border: '1px solid var(--color-border-dark)',
        background: hov ? '#4A5264' : '#5A6474',
        color: '#fff',
        cursor: 'pointer' as const, outline: 'none',
        transition: 'background .18s ease, transform .18s ease, box-shadow .18s ease',
        transform: hov ? 'translateY(-2px)' : 'none',
        boxShadow: hov ? '0 0 0 1.5px rgba(0,0,0,.70), 0 4px 12px rgba(0,0,0,.14)' : 'none',
        appearance: 'none', WebkitAppearance: 'none',
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%23ffffff' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E")`,
        backgroundRepeat: 'no-repeat', backgroundPosition: 'right 9px center',
        backgroundSize: '10px',
      }}>
      {options.map((o: any) => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  )
}

const ManageFunds = () => {
  const [isAddOpen,    setIsAddOpen]    = useState(false)
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterType,   setFilterType]   = useState('all')

  const statusOptions = [
    { value:'all',      label:'All Status'  },
    { value:'active',   label:'Active'      },
    { value:'inactive', label:'Inactive'    },
    { value:'pending',  label:'Pending'     },
    { value:'closed',   label:'Closed'      },
  ]
  const typeOptions = [
    { value:'all',         label:'All Types'    },
    { value:'allocation',  label:'Allocation'   },
    { value:'expense',     label:'Expense'      },
    { value:'revenue',     label:'Revenue'      },
    { value:'transfer',    label:'Transfer'     },
    { value:'reserve',     label:'Reserve'      },
  ]

  return (
    <div className="page-wrapper">
      <header className="page-header">
        <div>
          <h1 className="page-title">Manage Funds</h1>
          <p className="page-subtitle">Budget allocation, expenses, and financial overview</p>
        </div>
        <Button variant="primary" onClick={() => setIsAddOpen(true)}>+ Add Fund Entry</Button>
      </header>

      <KpiGrid metrics={FUND_METRICS} />

      {/* Filter toolbar */}
      <div style={{ display:'flex', gap:10, flexWrap:'wrap', marginBottom:16 }}>
        <FilterSelect value={filterStatus} onChange={setFilterStatus} options={statusOptions} />
        <FilterSelect value={filterType}   onChange={setFilterType}   options={typeOptions}   />
      </div>

      <div className="card">
        <p style={{ color:'var(--color-text-muted)', textAlign:'center', padding:'40px 0' }}>
          Fund allocation table renders here
          {filterStatus !== 'all' && ` · Status: ${filterStatus}`}
          {filterType   !== 'all' && ` · Type: ${filterType}`}
        </p>
      </div>

      <Modal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} title="Add Fund Entry"
        footer={<><Button variant="secondary" onClick={() => setIsAddOpen(false)}>Cancel</Button><Button variant="primary">Save Entry</Button></>}>
        <div className="form-group">
          <label className="form-label">Fund Name / Purpose <span>*</span></label>
          <input className="form-input" placeholder="e.g. Q2 Community Fund" />
        </div>
        <div className="form-group">
          <label className="form-label">Amount (₱) <span>*</span></label>
          <input className="form-input" type="number" placeholder="0.00" min="0" step="0.01" />
        </div>
        <div className="form-group">
          <label className="form-label">Type</label>
          <select className="form-select">
            <option>Allocation</option><option>Expense</option>
            <option>Revenue</option><option>Transfer</option><option>Reserve</option>
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Status</label>
          <select className="form-select">
            <option>Active</option><option>Inactive</option>
            <option>Pending</option><option>Closed</option>
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Date <span>*</span></label>
          <input className="form-input" type="date" />
        </div>
        <div className="form-group">
          <label className="form-label">Notes</label>
          <textarea className="form-textarea" placeholder="Optional notes or reference…" />
        </div>
      </Modal>
    </div>
  )
}

export default ManageFunds
