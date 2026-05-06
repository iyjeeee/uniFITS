// AllTransactions.jsx — All Transactions page
// KPI tiles: total transactions, completed, pending, failed, total amount, avg per transaction

import React, { useState } from 'react';
import { KpiGrid } from '../../components/KPI';
import { Button, Modal } from '../../components/shared';
import '../../styles/global.css';

// Transactions-specific KPI metrics config
const TRANSACTION_METRICS = [
  {
    id:         'txn-total',
    color:      'slate',
    icon:       '🧾',
    value:      '1,284',
    label:      'Total Transactions',
    trend:      42,
    trendLabel: '+42 this month',
    period:     'vs last month',
  },
  {
    id:         'txn-completed',
    color:      'green',
    icon:       '✅',
    value:      '1,221',
    label:      'Completed',
    trend:      38,
    trendLabel: '+38 this month',
    period:     'vs last month',
  },
  {
    id:         'txn-pending',
    color:      'amber',
    icon:       '⏳',
    value:      '37',
    label:      'Pending',
    trend:      -5,
    trendLabel: '-5 resolved',
    period:     'vs yesterday',
    showBadge:  true,
  },
  {
    id:         'txn-failed',
    color:      'rose',
    icon:       '❌',
    value:      '26',
    label:      'Failed / Rejected',
    trend:      -3,
    trendLabel: '-3 fewer',
    period:     'vs last month',
    showBadge:  true,
  },
  {
    id:         'txn-amount',
    color:      'blue',
    icon:       '💳',
    value:      '₱ 8.2M',
    label:      'Total Amount',
    trend:      7,
    trendLabel: '+₱ 380K',
    period:     'vs last month',
  },
  {
    id:         'txn-avg',
    color:      'teal',
    icon:       '📐',
    value:      '₱ 6.4K',
    label:      'Avg Per Transaction',
    trend:      2,
    trendLabel: '+₱ 120 avg',
    period:     'vs last month',
  },
];

const AllTransactions = () => {
  const [isAddOpen, setIsAddOpen] = useState(false); // Add transaction modal state

  return (
    <div className="page-wrapper">
      {/* Page header */}
      <header className="page-header">
        <div>
          <h1 className="page-title">All Transactions</h1>
          <p className="page-subtitle">Complete transaction history and financial records</p>
        </div>
        <div style={{ display: 'flex', gap: 'var(--sp-3)' }}>
          {/* Export button */}
          <Button variant="secondary">⬇ Export</Button>
          <Button variant="primary" onClick={() => setIsAddOpen(true)}>
            + New Transaction
          </Button>
        </div>
      </header>

      {/* KPI tile grid */}
      <KpiGrid metrics={TRANSACTION_METRICS} />

      {/* Transactions table area */}
      <div className="card">
        <p style={{ color: 'var(--color-text-muted)', textAlign: 'center', padding: '40px 0' }}>
          Transactions table with filters renders here
        </p>
      </div>

      {/* Add Transaction modal */}
      <Modal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        title="New Transaction"
        footer={
          <>
            <Button variant="secondary" onClick={() => setIsAddOpen(false)}>Cancel</Button>
            <Button variant="primary">Record Transaction</Button>
          </>
        }
      >
        <div className="form-group">
          <label className="form-label">Reference No.</label>
          <input className="form-input" placeholder="Auto-generated or manual" />
        </div>
        <div className="form-group">
          <label className="form-label">Type <span>*</span></label>
          <select className="form-select">
            <option>Payment</option>
            <option>Receipt</option>
            <option>Transfer</option>
            <option>Refund</option>
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
            <option>Completed</option>
            <option>Pending</option>
            <option>Failed</option>
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Notes</label>
          <textarea className="form-textarea" placeholder="Transaction details or remarks…" />
        </div>
      </Modal>
    </div>
  );
};

export default AllTransactions;
