// ManageEvents.jsx — Manage Events page
// KPI tiles: total events, upcoming, ongoing, completed, cancelled, attendance rate

import React, { useState } from 'react';
import { KpiGrid } from '../../components/KPI';
import { Button, Modal } from '../../components/shared';
import '../../styles/global.css';

// Events-specific KPI metrics config
const EVENT_METRICS = [
  {
    id:         'evt-total',
    color:      'violet',
    icon:       '🗓️',
    value:      '54',
    label:      'Total Events',
    trend:      8,
    trendLabel: '+8 this year',
    period:     'vs last year',
  },
  {
    id:         'evt-upcoming',
    color:      'amber',
    icon:       '⏳',
    value:      '11',
    label:      'Upcoming',
    trend:      3,
    trendLabel: '+3 scheduled',
    period:     'this month',
  },
  {
    id:         'evt-ongoing',
    color:      'blue',
    icon:       '▶️',
    value:      '2',
    label:      'Ongoing',
    trend:      0,
    trendLabel: 'Live now',
    period:     'today',
  },
  {
    id:         'evt-completed',
    color:      'teal',
    icon:       '✅',
    value:      '38',
    label:      'Completed',
    trend:      5,
    trendLabel: '+5 this quarter',
    period:     'this quarter',
  },
  {
    id:         'evt-cancelled',
    color:      'rose',
    icon:       '❌',
    value:      '3',
    label:      'Cancelled',
    trend:      -2,
    trendLabel: '-2 fewer',
    period:     'vs last month',
  },
  {
    id:         'evt-attendance',
    color:      'amber',
    icon:       '📊',
    value:      '87%',
    label:      'Avg Attendance',
    trend:      3,
    trendLabel: '+3% improved',
    period:     'vs last quarter',
  },
];

const ManageEvents = () => {
  const [isAddOpen, setIsAddOpen] = useState(false); // Add event modal state

  return (
    <div className="page-wrapper">
      {/* Page header */}
      <header className="page-header">
        <div>
          <h1 className="page-title">Manage Events</h1>
          <p className="page-subtitle">Plan, track, and review organizational events</p>
        </div>
        <Button variant="primary" onClick={() => setIsAddOpen(true)}>
          + New Event
        </Button>
      </header>

      {/* KPI tile grid */}
      <KpiGrid metrics={EVENT_METRICS} />

      {/* Events calendar / list area */}
      <div className="card">
        <p style={{ color: 'var(--color-text-muted)', textAlign: 'center', padding: '40px 0' }}>
          Events list / calendar renders here
        </p>
      </div>

      {/* Add Event modal */}
      <Modal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        title="Create New Event"
        footer={
          <>
            <Button variant="secondary" onClick={() => setIsAddOpen(false)}>Cancel</Button>
            <Button variant="primary">Create Event</Button>
          </>
        }
      >
        <div className="form-group">
          <label className="form-label">Event Name <span>*</span></label>
          <input className="form-input" placeholder="e.g. Annual General Meeting" />
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
  );
};

export default ManageEvents;
