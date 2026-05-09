// lib/data/mock_data.dart — All mock data mirroring the existing mockData.js.
// PROD: replace each list with Supabase queries via supabase_flutter client.

import '../models/models.dart';

// ── Formatters ────────────────────────────────────────────────────────────────
String formatCurrency(double amount, {String symbol = '₱'}) {
  // Format as Philippine Peso with 2 decimal places
  final formatted = amount.toStringAsFixed(2)
      .replaceAllMapped(RegExp(r'(\d)(?=(\d{3})+\.)'), (m) => '${m[1]},');
  return '$symbol$formatted';
}

String formatDate(String? dateStr) {
  if (dateStr == null || dateStr.isEmpty) return '—';
  try {
    final d = DateTime.parse(dateStr);
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    return '${months[d.month - 1]} ${d.day}, ${d.year}';
  } catch (_) { return dateStr; }
}

String relativeTime(String? dateStr) {
  if (dateStr == null || dateStr.isEmpty) return '—';
  try {
    final d = DateTime.parse(dateStr);
    final diff = DateTime.now().difference(d);
    if (diff.inMinutes < 1)  return 'Just now';
    if (diff.inMinutes < 60) return '${diff.inMinutes}m ago';
    if (diff.inHours < 24)   return '${diff.inHours}h ago';
    if (diff.inDays < 7)     return '${diff.inDays}d ago';
    return formatDate(dateStr);
  } catch (_) { return dateStr; }
}

String fmt12(String? t) {
  if (t == null || t.isEmpty) return '—';
  try {
    final parts = t.split(':');
    final h = int.parse(parts[0]);
    final m = parts[1].padLeft(2, '0');
    final ampm = h >= 12 ? 'PM' : 'AM';
    final h12  = h % 12 == 0 ? 12 : h % 12;
    return '$h12:$m $ampm';
  } catch (_) { return t; }
}

String capitalize(String? str) {
  if (str == null || str.isEmpty) return '';
  return str[0].toUpperCase() + str.substring(1);
}

// ── MOCK_USERS ────────────────────────────────────────────────────────────────
final List<AppUser> mockUsers = [
  const AppUser(id:'1', employeeNumber:'EMP-0001', firstName:'Juan', lastName:'Dela Cruz', fullName:'Juan Dela Cruz', gender:'Male', email:'juan@example.com', contactNumber:'09171234567', role:'President', department:'Executive', occupation:'Executive Officer', joined:'2022-01-15', status:'active', addressCity:'Manila', addressProvince:'Metro Manila'),
  const AppUser(id:'2', employeeNumber:'EMP-0002', firstName:'Maria', lastName:'Santos', fullName:'Maria Santos', gender:'Female', email:'maria@example.com', contactNumber:'09181234567', role:'Secretary', department:'Administration', occupation:'Secretary General', joined:'2022-02-10', status:'active', addressCity:'Quezon City', addressProvince:'Metro Manila'),
  const AppUser(id:'3', employeeNumber:'EMP-0003', firstName:'Pedro', lastName:'Reyes', fullName:'Pedro Reyes', gender:'Male', email:'pedro@example.com', contactNumber:'09191234567', role:'Treasurer', department:'Finance', occupation:'Finance Manager', joined:'2022-03-20', status:'active', addressCity:'Makati', addressProvince:'Metro Manila'),
  const AppUser(id:'4', employeeNumber:'EMP-0004', firstName:'Ana', lastName:'Lim', fullName:'Ana Lim', gender:'Female', email:'ana@example.com', contactNumber:'09201234567', role:'Member', department:'Operations', occupation:'Operations Staff', joined:'2022-05-01', status:'active', addressCity:'Taguig', addressProvince:'Metro Manila'),
  const AppUser(id:'5', employeeNumber:'EMP-0005', firstName:'Carlos', lastName:'Villanueva', fullName:'Carlos Villanueva', gender:'Male', email:'carlos@example.com', contactNumber:'09211234567', role:'Member', department:'Projects', occupation:'Project Coordinator', joined:'2022-06-15', status:'active', addressCity:'Pasig', addressProvince:'Metro Manila'),
  const AppUser(id:'6', employeeNumber:'EMP-0006', firstName:'Luz', lastName:'Ramos', fullName:'Luz Ramos', gender:'Female', email:'luz@example.com', contactNumber:'09221234567', role:'Member', department:'Events', occupation:'Events Coordinator', joined:'2022-07-10', status:'inactive', addressCity:'Caloocan', addressProvince:'Metro Manila'),
];

// ── MOCK_ANNOUNCEMENTS ────────────────────────────────────────────────────────
final List<Announcement> mockAnnouncements = [
  const Announcement(id:'1', title:'General Assembly Meeting', content:'All members are required to attend the General Assembly this Saturday, March 22, 2025 at 9:00 AM at the Club Headquarters. The agenda includes budget review, project updates, and officer elections. Attendance is mandatory. Please inform the Secretary if you have a conflict. Light refreshments will be served.', isPinned:true, createdBy:'Juan Dela Cruz', createdAt:'2025-03-15T08:00:00Z'),
  const Announcement(id:'2', title:'Membership Dues Reminder', content:'Kindly settle your annual membership dues before March 31, 2025. Please coordinate with our Treasurer Pedro Reyes for payment details. Payment can be made via GCash or cash. Late payments will incur a ₱200 penalty fee per month.', isPinned:true, createdBy:'Maria Santos', createdAt:'2025-03-12T10:30:00Z'),
  const Announcement(id:'3', title:'Medical Mission Volunteers', content:'We are looking for volunteers for our upcoming Medical Mission on April 5, 2025. Activities include medical check-ups, medicine distribution, and dental care. Please sign up via the Events Committee. Slots are limited — first come, first served.', isPinned:false, createdBy:'Carlos Villanueva', createdAt:'2025-03-10T14:00:00Z'),
  const Announcement(id:'4', title:'New Year Activity Planning', content:'We are planning our year-end celebration. Please submit your activity suggestions to the Events Committee by March 25. All suggestions will be considered by the planning team.', isPinned:false, createdBy:'Luz Ramos', createdAt:'2025-03-08T09:00:00Z'),
  const Announcement(id:'5', title:'Website System Maintenance', content:'The club management system will undergo scheduled maintenance on March 20, 2025 from 12:00 AM to 4:00 AM. Please save your work before this window.', isPinned:false, createdBy:'Juan Dela Cruz', createdAt:'2025-03-05T07:00:00Z'),
];

// ── MOCK_PROJECTS ─────────────────────────────────────────────────────────────
final List<Project> mockProjects = [
  const Project(id:'1', title:'Medical Mission 2026', projectType:'Medical Mission', description:'Free medical check-ups for underprivileged communities in Taal, Batangas. Services include general medicine, dental care, and medicine distribution.', startDate:'2026-03-15', endDate:'2026-03-16', location:'Taal, Batangas', status:'upcoming', targetFunding:50000, currentFunding:32500),
  const Project(id:'2', title:'School Feeding Program', projectType:'Community Service', description:'Weekly feeding program for public school students in Laguna. Aims to address malnutrition among school-age children and improve academic performance through proper nutrition.', startDate:'2026-01-10', endDate:'2026-12-20', location:'San Pablo, Laguna', status:'ongoing', targetFunding:120000, currentFunding:78000),
  const Project(id:'3', title:'Tree Planting Initiative', projectType:'Environmental', description:'Planting 1,000 native trees in watershed areas to help restore the local ecosystem and combat deforestation in Sierra Madre.', startDate:'2026-03-22', endDate:'2026-03-22', location:'Sierra Madre, Rizal', status:'upcoming', targetFunding:25000, currentFunding:10000),
  const Project(id:'4', title:'Scholarship Program 2024', projectType:'Education', description:'College scholarships for deserving students from our community. Covers tuition, allowance, and school supplies for the academic year.', startDate:'2024-06-01', endDate:'2024-12-15', location:'Metro Manila', status:'completed', targetFunding:200000, currentFunding:200000),
  const Project(id:'5', title:'Livelihood Seminar', projectType:'Livelihood', description:'Practical skills training for out-of-school youth covering sewing, cooking, and basic entrepreneurship. Includes a starter kit for participants.', startDate:'2026-04-05', endDate:'2026-04-07', location:'Cavite City, Cavite', status:'upcoming', targetFunding:30000, currentFunding:12000),
];

// ── MOCK_EVENTS ───────────────────────────────────────────────────────────────
final List<AppEvent> mockEvents = [
  const AppEvent(id:'1', title:'Annual Gala Night 2026', description:'Annual fundraising gala for organizational programs. Black-tie event with dinner, entertainment, and silent auction.', eventDate:'2026-03-28', eventTime:'18:00', location:'Manila Hotel Ballroom', status:'upcoming', targetFunding:500000, currentFunding:125000),
  const AppEvent(id:'2', title:'Summer Sportsfest', description:'Team building sports activities for all members. Events include basketball, volleyball, badminton, and fun games.', eventDate:'2026-04-18', eventTime:'08:00', location:'San Juan Sports Complex', status:'upcoming', targetFunding:15000, currentFunding:8000),
  const AppEvent(id:'3', title:'Independence Day Parade', description:'Annual independence day participation and flag ceremony with the local government.', eventDate:'2026-06-12', eventTime:'07:00', location:'Luneta Park, Manila', status:'upcoming', targetFunding:5000, currentFunding:3000),
  const AppEvent(id:'4', title:'Christmas Party 2024', description:'Year-end celebration for all members and their families. Includes dinner, parlor games, and gift exchange.', eventDate:'2024-12-15', eventTime:'17:00', location:'Club Headquarters', status:'completed', targetFunding:40000, currentFunding:40000),
];

// ── MOCK_TRANSACTIONS ─────────────────────────────────────────────────────────
final List<Transaction> mockTransactions = [
  const Transaction(id:'1', userId:'1', userName:'Juan Dela Cruz', entryType:'contribution', category:'fund', fund:'Membership Dues Fund', amount:1200, paymentMethod:'GCash', referenceNumber:'TXN-20250301-0001', transactionDate:'2025-03-01', status:'completed', description:'Annual dues 2025'),
  const Transaction(id:'2', userId:'2', userName:'Maria Santos', entryType:'contribution', category:'fund', fund:'Membership Dues Fund', amount:1200, paymentMethod:'Cash', referenceNumber:'TXN-20250302-0002', transactionDate:'2025-03-02', status:'completed', description:'Annual dues 2025'),
  const Transaction(id:'3', userId:'3', userName:'Pedro Reyes', entryType:'contribution', category:'project', fund:'Project Fund', amount:5000, paymentMethod:'Bank Transfer', referenceNumber:'TXN-20250305-0003', transactionDate:'2025-03-05', status:'completed', description:'Medical Mission donation'),
  const Transaction(id:'4', userId:'4', userName:'Ana Lim', entryType:'contribution', category:'event', fund:'Event Fund', amount:2500, paymentMethod:'GCash', referenceNumber:'TXN-20250306-0004', transactionDate:'2025-03-06', status:'completed', description:'Gala Night contribution'),
  const Transaction(id:'5', userId:null, userName:null, entryType:'income', category:'fund', fund:'Event Fund', amount:50000, paymentMethod:'Bank Transfer', referenceNumber:'TXN-20250310-0005', transactionDate:'2025-03-10', status:'completed', description:'Corporate sponsor payment'),
  const Transaction(id:'6', userId:'5', userName:'Carlos Villanueva', entryType:'expense', category:'project', fund:'Project Fund', amount:12500, paymentMethod:'Cash', referenceNumber:'TXN-20250312-0006', transactionDate:'2025-03-12', status:'completed', description:'Medical supplies purchase'),
  const Transaction(id:'7', userId:'4', userName:'Ana Lim', entryType:'contribution', category:'project', fund:'Project Fund', amount:500, paymentMethod:'GCash', referenceNumber:'TXN-20250318-0007', transactionDate:'2025-03-18', status:'completed', description:'School Feeding donation'),
  const Transaction(id:'8', userId:'4', userName:'Ana Lim', entryType:'contribution', category:'fund', fund:'Building Fund', amount:600, paymentMethod:'GCash', referenceNumber:'TXN-20250320-0008', transactionDate:'2025-03-20', status:'pending', description:'Building fund monthly'),
  const Transaction(id:'9', userId:'1', userName:'Juan Dela Cruz', entryType:'contribution', category:'event', fund:'Event Fund', amount:3000, paymentMethod:'Cash', referenceNumber:'TXN-20250322-0009', transactionDate:'2025-03-22', status:'completed', description:'Gala Night table booking'),
];

// ── MOCK_ATTENDANCES ──────────────────────────────────────────────────────────
final List<Attendance> mockAttendances = [
  const Attendance(id:'1', userId:'1', userName:'Juan Dela Cruz', activityType:'event', activity:'Christmas Party 2024', attendanceDate:'2024-12-15', status:'present', recordedBy:'Maria Santos'),
  const Attendance(id:'2', userId:'2', userName:'Maria Santos', activityType:'event', activity:'Christmas Party 2024', attendanceDate:'2024-12-15', status:'present', recordedBy:'Maria Santos'),
  const Attendance(id:'3', userId:'3', userName:'Pedro Reyes', activityType:'project', activity:'Scholarship Program 2024', attendanceDate:'2024-06-01', status:'present', recordedBy:'Juan Dela Cruz'),
  const Attendance(id:'4', userId:'4', userName:'Ana Lim', activityType:'event', activity:'Christmas Party 2024', attendanceDate:'2024-12-15', status:'late', remarks:'1 hour late', recordedBy:'Maria Santos'),
  const Attendance(id:'5', userId:'4', userName:'Ana Lim', activityType:'project', activity:'School Feeding Program', attendanceDate:'2026-01-15', status:'present', recordedBy:'Juan Dela Cruz'),
  const Attendance(id:'6', userId:'4', userName:'Ana Lim', activityType:'project', activity:'Scholarship Program 2024', attendanceDate:'2024-06-01', status:'absent', remarks:'Work conflict', recordedBy:'Juan Dela Cruz'),
  const Attendance(id:'7', userId:'5', userName:'Carlos Villanueva', activityType:'project', activity:'Scholarship Program 2024', attendanceDate:'2024-06-01', status:'absent', remarks:'Excused — work conflict', recordedBy:'Juan Dela Cruz'),
  const Attendance(id:'8', userId:'6', userName:'Luz Ramos', activityType:'event', activity:'Christmas Party 2024', attendanceDate:'2024-12-15', status:'excused', remarks:'Medical reason', recordedBy:'Maria Santos'),
];
