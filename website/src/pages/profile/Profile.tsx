// Profile.tsx — Member profile: hero, quick stats, personal info, role, attendance and transactions
// Composition only — pieces live in ./parts (data + edit state in useProfile)
import { ResponseModal } from '../../components/ui'
import useBreakpoint from '../../hooks/useBreakpoint'
import ProfileHeroCard from './parts/ProfileHeroCard'
import ProfileStatsRow from './parts/ProfileStatsRow'
import PersonalInfoCard from './parts/PersonalInfoCard'
import RoleAccessCard from './parts/RoleAccessCard'
import AttendanceSummaryCard from './parts/AttendanceSummaryCard'
import PersonalTransactionsCard from './parts/PersonalTransactionsCard'
import AllAttendanceModal from './parts/AllAttendanceModal'
import AllTransactionsModal from './parts/AllTransactionsModal'
import EditProfileModal from './parts/EditProfileModal'
import { useProfile } from './parts/useProfile'

export default function Profile({ userId = '1' }: { userId?: string }) {
  const { isMobile, isTablet } = useBreakpoint()
  const p = useProfile(userId)

  return (
    <div style={{ display: 'flex' as const, flexDirection: 'column' as const, gap: 14 }}>

      <ProfileHeroCard user={p.user} onEdit={() => p.setShowEditModal(true)} />
      <ProfileStatsRow userTransactions={p.userTransactions} totalContributed={p.totalContributed} attStats={p.attStats} attTotal={p.attTotal} />

      {/* Main info grid — 4-col desktop, 2-col tablet, 1-col mobile */}
      <div style={{ display: 'grid' as const, gridTemplateColumns: isMobile ? '1fr' : isTablet ? 'repeat(2,1fr)' : 'repeat(4, 1fr)', gap: 14 }}>
        <PersonalInfoCard user={p.user} />
        <RoleAccessCard user={p.user} />
        <AttendanceSummaryCard userAttendance={p.userAttendance} attStats={p.attStats} attTotal={p.attTotal} onViewAll={() => p.setShowAllAttend(true)} />
        <PersonalTransactionsCard user={p.user} userTransactions={p.userTransactions} onViewAll={() => p.setShowAllTxn(true)} />
      </div>

      <AllAttendanceModal open={p.showAllAttend} onClose={() => p.setShowAllAttend(false)} user={p.user} userAttendance={p.userAttendance} attStats={p.attStats} />
      <AllTransactionsModal open={p.showAllTxn} onClose={() => p.setShowAllTxn(false)} user={p.user} />
      <EditProfileModal open={p.showEditModal} onClose={() => p.setShowEditModal(false)} onSave={p.handleSave} user={p.user} form={p.form} set={p.set} setForm={p.setForm} />

      {/* Save result */}
      <ResponseModal
        open={!!p.saveResponse}
        onClose={() => p.setSaveResponse(null)}
        variant={p.saveResponse?.variant || 'success'}
        title={p.saveResponse?.title  || ''}
        message={p.saveResponse?.message || ''}
        confirmLabel="Got it"
      />
    </div>
  )
}
