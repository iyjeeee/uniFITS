// ManageProjects.jsx — Manage Projects page
// KPI tiles: total, active, on hold, completed, overdue, completion rate

import React, { useState } from 'react';
import { KpiGrid } from '../../components/KPI';
import { Button, Modal } from '../../components/shared';
import '../../styles/global.css';

// Projects-specific KPI metrics config
const PROJECT_METRICS = [
  {
    id:         'proj-total',
    color:      'teal',
    icon:       '📁',
    value:      '47',
    label:      'Total Projects',
    trend:      5,
    trendLabel: '+5 this year',
    period:     'vs last year',
  },
  {
    id:         'proj-active',
    color:      'blue',
    icon:       '🚀',
    value:      '23',
    label:      'Active Projects',
    trend:      2,
    trendLabel: '+2 launched',
    period:     'this month',
  },
  {
    id:         'proj-on-hold',
    color:      'amber',
    icon:       '⏸️',
    value:      '5',
    label:      'On Hold',
    trend:      -1,
    trendLabel: '-1 resumed',
    period:     'vs last week',
    showBadge:  true,
  },
  {
    id:         'proj-completed',
    color:      'green',
    icon:       '🏁',
    value:      '16',
    label:      'Completed',
    trend:      4,
    trendLabel: '+4 this quarter',
    period:     'this quarter',
  },
  {
    id:         'proj-overdue',
    color:      'rose',
    icon:       '⚠️',
    value:      '3',
    label:      'Overdue',
    trend:      -2,
    trendLabel: '-2 resolved',
    period:     'vs last month',
    showBadge:  true,
  },
  {
    id:         'proj-completion',
    color:      'violet',
    icon:       '📈',
    value:      '78%',
    label:      'Completion Rate',
    trend:      6,
    trendLabel: '+6% up',
    period:     'vs last quarter',
  },
];

const ManageProjects = () => {
  const [isAddOpen, setIsAddOpen] = useState(false); // Add project modal state

  return (
    <div className="page-wrapper">
      {/* Page header */}
      <header className="page-header">
        <div>
          <h1 className="page-title">Manage Projects</h1>
          <p className="page-subtitle">Track all projects, milestones, and team assignments</p>
        </div>
        <Button variant="primary" onClick={() => setIsAddOpen(true)}>
          + New Project
        </Button>
      </header>

      {/* KPI tile grid */}
      <KpiGrid metrics={PROJECT_METRICS} />

      {/* Projects list area */}
      <div className="card">
        <p style={{ color: 'var(--color-text-muted)', textAlign: 'center', padding: '40px 0' }}>
          Projects table / kanban renders here
        </p>
      </div>

      {/* Add Project modal */}
      <Modal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        title="Create New Project"
        footer={
          <>
            <Button variant="secondary" onClick={() => setIsAddOpen(false)}>Cancel</Button>
            <Button variant="primary">Create Project</Button>
          </>
        }
      >
        <div className="form-group">
          <label className="form-label">Project Name <span>*</span></label>
          <input className="form-input" placeholder="e.g. Website Redesign" />
        </div>
        <div className="form-group">
          <label className="form-label">Status</label>
          <select className="form-select">
            <option>Active</option>
            <option>On Hold</option>
            <option>Planning</option>
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
  );
};

export default ManageProjects;
