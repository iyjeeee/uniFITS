// ManageFunds.jsx — Manage Funds page
// KPI tiles: total funds, allocated, available balance, monthly expenses,
// budget utilization, pending approvals

import React, { useState } from 'react';
import { KpiGrid } from '../../components/KPI';
import { Button, Modal } from '../../components/shared';
import '../../styles/global.css';

// Funds-specific KPI metrics config
const FUND_METRICS = [
  {
    id:         'fund-total',
    color:      'green',
    icon:       '💰',
    value:      '₱ 4.8M',
    label:      'Total Funds',
    trend:      1,
    trendLabel: '+₱ 120K',
    period:     'this quarter',
  },
  {
    id:         'fund-allocated',
    color:      'blue',
    icon:       '📦',
    value:      '₱ 3.1M',
    label:      'Allocated',
    trend:      2,
    trendLabel: '+₱ 80K',
    period:     'vs last month',
  },
  {
    id:         'fund-available',
    color:      'teal',
    icon:       '💵',
    value:      '₱ 1.7M',
    label:      'Available Balance',
    trend:      -1,
    trendLabel: '-₱ 40K used',
    period:     'vs last month',
  },
  {
    id:         'fund-expenses',
    color:      'amber',
    icon:       '💸',
    value:      '₱ 540K',
    label:      'Monthly Expenses',
    trend:      -4,
    trendLabel: '-4% lower',
    period:     'vs last month',
  },
  {
    id:         'fund-utilization',
    color:      'violet',
    icon:       '📊',
    value:      '64%',
    label:      'Budget Utilization',
    trend:      3,
    trendLabel: '+3% used',
    period:     'vs last quarter',
  },
  {
    id:         'fund-pending',
    color:      'rose',
    icon:       '🕐',
    value:      '12',
    label:      'Pending Approvals',
    trend:      -3,
    trendLabel: '-3 approved',
    period:     'vs yesterday',
    showBadge:  true,
  },
];

const ManageFunds = () => {
  const [isAddOpen, setIsAddOpen] = useState(false); // Add fund entry modal state

  return (
    <div className="page-wrapper">
      {/* Page header */}
      <header className="page-header">
        <div>
          <h1 className="page-title">Manage Funds</h1>
          <p className="page-subtitle">Budget allocation, expenses, and financial overview</p>
        </div>
        <Button variant="primary" onClick={() => setIsAddOpen(true)}>
          + Add Fund Entry
        </Button>
      </header>

      {/* KPI tile grid */}
      <KpiGrid metrics={FUND_METRICS} />

      {/* Funds table area */}
      <div className="card">
        <p style={{ color: 'var(--color-text-muted)', textAlign: 'center', padding: '40px 0' }}>
          Fund allocation table renders here
        </p>
      </div>

      {/* Add Fund modal */}
      <Modal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        title="Add Fund Entry"
        footer={
          <>
            <Button variant="secondary" onClick={() => setIsAddOpen(false)}>Cancel</Button>
            <Button variant="primary">Save Entry</Button>
          </>
        }
      >
        <div className="form-group">
          <label className="form-label">Fund Name / Purpose <span>*</span></label>
          <input className="form-input" placeholder="e.g. Q2 Marketing Budget" />
        </div>
        <div className="form-group">
          <label className="form-label">Amount (₱) <span>*</span></label>
          <input className="form-input" type="number" placeholder="0.00" min="0" step="0.01" />
        </div>
        <div className="form-group">
          <label className="form-label">Type</label>
          <select className="form-select">
            <option>Allocation</option>
            <option>Expense</option>
            <option>Revenue</option>
            <option>Transfer</option>
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
  );
};

export default ManageFunds;
