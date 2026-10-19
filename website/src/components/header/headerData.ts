// header/headerData.ts — Notification type, hard-coded mock notifications and page size (see bug log: not in api/mockData)
// Notification record shape
export interface Notification { id: number; text: string; time: string; read: boolean }

export const MOCK_NOTIFICATIONS: Notification[] = [
  { id: 1,  text: 'New project "Medical Mission" created',         time: '2 min ago',  read: false },
  { id: 2,  text: 'Maria Santos paid membership dues',             time: '1 hr ago',   read: false },
  { id: 3,  text: 'Backup completed successfully',                 time: '3 hrs ago',  read: false },
  { id: 4,  text: 'Annual Gala Night event updated',               time: 'Yesterday',  read: true  },
  { id: 5,  text: 'Tree Planting Initiative funding reached 40%',  time: 'Yesterday',  read: true  },
  { id: 6,  text: 'Pedro Reyes paid membership dues',              time: '2 days ago', read: true  },
  { id: 7,  text: 'New member Ana Lim registered',                 time: '3 days ago', read: true  },
  { id: 8,  text: 'School Feeding Program budget approved',        time: '4 days ago', read: true  },
  { id: 9,  text: 'System backup scheduled for tomorrow 2AM',      time: '5 days ago', read: true  },
  { id: 10, text: 'Carlos Villanueva updated project status',      time: '6 days ago', read: true  },
  { id: 11, text: 'Livelihood Seminar venue confirmed',            time: '1 week ago', read: true  },
  { id: 12, text: 'Emergency Fund reached ₱20,000 milestone',     time: '1 week ago', read: true  },
]

export const NOTIF_PER_PAGE = 8
