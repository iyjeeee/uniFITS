// AllTransactions.jsx — All Transactions with KPI tiles + filter toolbar
import React, { useState } from 'react'
import { KpiGrid } from '../../components/KPI'
import { Button, Modal } from '../../components/shared'
import '../../styles/global.css'

const TRANSACTION_METRICS = [
  { id:'txn-total',     color:'slate', icon:'🧾', value:'1,284', label:'Total Transactions', trend:42, trendLabel:'+42 this month', period:'vs last month' },
  { id:'txn-completed', color:'green', icon:'✅', value:'1,221', label:'Completed',          trend:38, trendLabel:'+38 this month', period:'vs last month' },
  { id:'txn-pending',   color:'amber', icon:'⏳', value:'37',    label:'Pending',            trend:-5, trendLabel:'-5 resolved',    period:'vs yesterday',  showBadge:true },
  { id:'txn-failed',    color:'rose',  icon:'❌', value:'26',    label:'Failed / Rejected',  trend:-3, trendLabel:'-3 fewer',       period:'vs last month', showBadge:true },
  { id:'txn-amount',    color:'blue',  icon:'💳', value:'₱ 8.2M',label:'Total Amount',       trend:7,  trendLabel:'+₱ 380K',       period:'vs last month' },
  { id:'txn-avg',       color:'teal',  icon:'📐', value:'₱ 6.4K',label:'Avg Per Transaction',trend:2,  trendLabel:'+₱ 120 avg',    period:'vs last month' },
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
        background: hov ? '#4A5264' : '#5A6474',   /* secondary Button rest/hover colors */
        color: '#fff',                              /* always white — same as Button secondary */
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

const AllTransactions = () => {
  const [isAddOpen,    setIsAddOpen]    = useState(false)
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterType,   setFilterType]   = useState('all')

  const statusOptions = [
    { value:'all',       label:'All Status'  },
    { value:'completed', label:'Completed'   },
    { value:'pending',   label:'Pending'     },
    { value:'failed',    label:'Failed'      },
    { value:'rejected',  label:'Rejected'    },
  ]
  const typeOptions = [
    { value:'all',          label:'All Types'     },
    { value:'contribution', label:'Contribution'  },
    { value:'income',       label:'Income'        },
    { value:'expense',      label:'Expense'       },
    { value:'transfer',     label:'Transfer'      },
    { value:'refund',       label:'Refund'        },
  ]

  return (
    <div className="page-wrapper">
      <header className="page-header">
        <div>
          <h1 className="page-title">All Transactions</h1>
          <p className="page-subtitle">Complete transaction history and financial records</p>
        </div>
        <div style={{ display:'flex', gap:'var(--sp-3)' }}>
          <Button variant="secondary">⬇ Export</Button>
          <Button variant="primary" onClick={() => setIsAddOpen(true)}>+ New Transaction</Button>
        </div>
      </header>

      <KpiGrid metrics={TRANSACTION_METRICS} />

      {/* Filter toolbar */}
      <div style={{ display:'flex', gap:10, flexWrap:'wrap', marginBottom:16 }}>
        <FilterSelect value={filterStatus} onChange={setFilterStatus} options={statusOptions} />
        <FilterSelect value={filterType}   onChange={setFilterType}   options={typeOptions}   />
      </div>

      <div className="card">
        <p style={{ color:'var(--color-text-muted)', textAlign:'center', padding:'40px 0' }}>
          Transactions table with filters renders here
          {filterStatus !== 'all' && ` · Status: ${filterStatus}`}
          {filterType   !== 'all' && ` · Type: ${filterType}`}
        </p>
      </div>

      <Modal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} title="New Transaction"
        footer={<><Button variant="secondary" onClick={() => setIsAddOpen(false)}>Cancel</Button><Button variant="primary">Record Transaction</Button></>}>
        <div className="form-group">
          <label className="form-label">Reference No.</label>
          <input className="form-input" placeholder="Auto-generated or manual" />
        </div>
        <div className="form-group">
          <label className="form-label">Type <span>*</span></label>
          <select className="form-select">
            <option>Contribution</option><option>Income</option>
            <option>Expense</option><option>Transfer</option><option>Refund</option>
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Amount (₱) <span>*</span></label>
          <input className="form-input" type="number" placeholder="0.00" min="0" step="0.01" />
        </div>
        <div className="form-group">
          <label className="form-label">Date <span>*</span></label>
          <input className="form-input" type="date" />
        </div>
        <div className="form-group">
          <label className="form-label">Status</label>
          <select className="form-select">
            <option>Completed</option><option>Pending</option>
            <option>Failed</option><option>Rejected</option>
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Notes</label>
          <textarea className="form-textarea" placeholder="Transaction details or remarks…" />
        </div>
      </Modal>
    </div>
  )
}

export default AllTransactions