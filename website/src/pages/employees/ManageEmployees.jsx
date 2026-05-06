// ManageEmployees.jsx — Manage Employees page
// KPI tiles: total, active, on leave, new hires, departments, turnover rate

import React, { useState } from 'react';
import { KpiGrid } from '../../components/KPI';
import { Button, Modal } from '../../components/shared';
import '../../styles/global.css';

// Employee-specific KPI metrics config
const EMPLOYEE_METRICS = [
  {
    id:         'emp-total',
    color:      'blue',
    icon:       '👥',
    value:      '148',
    label:      'Total Employees',
    trend:      4,
    trendLabel: '+4 this month',
    period:     'vs last month',
  },
  {
    id:         'emp-active',
    color:      'green',
    icon:       '✅',
    value:      '131',
    label:      'Active Employees',
    trend:      2,
    trendLabel: '+2 this week',
    period:     'vs last week',
  },
  {
    id:         'emp-on-leave',
    color:      'amber',
    icon:       '🏖️',
    value:      '17',
    label:      'On Leave',
    trend:      -3,
    trendLabel: '-3 returned',
    period:     'vs yesterday',
  },
  {
    id:         'emp-new-hires',
    color:      'teal',
    icon:       '🆕',
    value:      '6',
    label:      'New Hires',
    trend:      6,
    trendLabel: '+6 this quarter',
    period:     'this quarter',
  },
  {
    id:         'emp-departments',
    color:      'violet',
    icon:       '🏢',
    value:      '11',
    label:      'Departments',
    trend:      0,
    trendLabel: 'No change',
    period:     'this period',
  },
  {
    id:         'emp-turnover',
    color:      'rose',
    icon:       '📉',
    value:      '3.2%',
    label:      'Turnover Rate',
    trend:      -1,
    trendLabel: '-0.5% improved',
    period:     'vs last quarter',
  },
];

const ManageEmployees = () => {
  const [isAddOpen, setIsAddOpen] = useState(false); // Add employee modal state

  return (
    <div className="page-wrapper">
      {/* Page header with Add Employee action */}
      <header className="page-header">
        <div>
          <h1 className="page-title">Manage Employees</h1>
          <p className="page-subtitle">All employee records and department assignments</p>
        </div>
        <Button variant="primary" onClick={() => setIsAddOpen(true)}>
          + Add Employee
        </Button>
      </header>

      {/* KPI tile grid */}
      <KpiGrid metrics={EMPLOYEE_METRICS} />

      {/* Employee table / list area */}
      <div className="card">
        <p style={{ color: 'var(--color-text-muted)', textAlign: 'center', padding: '40px 0' }}>
          Employee records table renders here
        </p>
      </div>

      {/* Add Employee modal */}
      <Modal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        title="Add New Employee"
        footer={
          <>
            <Button variant="secondary" onClick={() => setIsAddOpen(false)}>Cancel</Button>
            <Button variant="primary" type="submit">Save Employee</Button>
          </>
        }
      >
        <div className="form-group">
          <label className="form-label">Full Name <span>*</span></label>
          <input className="form-input" placeholder="e.g. Juan Dela Cruz" />
        </div>
        <div className="form-group">
          <label className="form-label">Department <span>*</span></label>
          <select className="form-select">
            <option>Select department…</option>
            <option>Engineering</option>
            <option>Finance</option>
            <option>HR</option>
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
  );
};

export default ManageEmployees;
