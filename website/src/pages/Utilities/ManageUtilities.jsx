// ManageUtilities.jsx — Manage Utilities page
// KPI tiles: active utilities, pending maintenance, resolved this month,
// total assets, downtime hours, uptime percentage

import React, { useState } from 'react';
import { KpiGrid } from '../../components/KPI';
import { Button, Modal } from '../../components/shared';
import '../../styles/global.css';

// Utilities-specific KPI metrics config
const UTILITY_METRICS = [
  {
    id:         'util-active',
    color:      'sky',
    icon:       '⚡',
    value:      '9',
    label:      'Active Utilities',
    trend:      0,
    trendLabel: 'All operational',
    period:     'today',
  },
  {
    id:         'util-maintenance',
    color:      'amber',
    icon:       '🔧',
    value:      '4',
    label:      'Pending Maintenance',
    trend:      -2,
    trendLabel: '-2 scheduled',
    period:     'vs last week',
    showBadge:  true,
  },
  {
    id:         'util-resolved',
    color:      'green',
    icon:       '✅',
    value:      '18',
    label:      'Resolved This Month',
    trend:      3,
    trendLabel: '+3 more',
    period:     'vs last month',
  },
  {
    id:         'util-assets',
    color:      'teal',
    icon:       '🏗️',
    value:      '63',
    label:      'Total Assets',
    trend:      2,
    trendLabel: '+2 added',
    period:     'this quarter',
  },
  {
    id:         'util-downtime',
    color:      'rose',
    icon:       '⏱️',
    value:      '1.4h',
    label:      'Downtime This Month',
    trend:      -1,
    trendLabel: '-0.6h improved',
    period:     'vs last month',
  },
  {
    id:         'util-uptime',
    color:      'blue',
    icon:       '📶',
    value:      '99.1%',
    label:      'System Uptime',
    trend:      1,
    trendLabel: '+0.3% up',
    period:     'vs last month',
  },
];

const ManageUtilities = () => {
  const [isAddOpen, setIsAddOpen] = useState(false); // Add utility modal state

  return (
    <div className="page-wrapper">
      {/* Page header */}
      <header className="page-header">
        <div>
          <h1 className="page-title">Manage Utilities</h1>
          <p className="page-subtitle">Monitor assets, maintenance requests, and system health</p>
        </div>
        <Button variant="primary" onClick={() => setIsAddOpen(true)}>
          + Add Utility
        </Button>
      </header>

      {/* KPI tile grid */}
      <KpiGrid metrics={UTILITY_METRICS} />

      {/* Utilities list area */}
      <div className="card">
        <p style={{ color: 'var(--color-text-muted)', textAlign: 'center', padding: '40px 0' }}>
          Utilities list / maintenance log renders here
        </p>
      </div>

      {/* Add Utility modal */}
      <Modal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        title="Add Utility / Asset"
        footer={
          <>
            <Button variant="secondary" onClick={() => setIsAddOpen(false)}>Cancel</Button>
            <Button variant="primary">Save Utility</Button>
          </>
        }
      >
        <div className="form-group">
          <label className="form-label">Utility / Asset Name <span>*</span></label>
          <input className="form-input" placeholder="e.g. HVAC Unit – Floor 3" />
        </div>
        <div className="form-group">
          <label className="form-label">Category</label>
          <select className="form-select">
            <option>Electrical</option>
            <option>Plumbing</option>
            <option>HVAC</option>
            <option>IT Infrastructure</option>
            <option>Other</option>
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Status</label>
          <select className="form-select">
            <option>Operational</option>
            <option>Under Maintenance</option>
            <option>Offline</option>
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Notes</label>
          <textarea className="form-textarea" placeholder="Additional notes or maintenance history…" />
        </div>
      </Modal>
    </div>
  );
};

export default ManageUtilities;
