// test/recordIds.test.tsx — B-01: detail/edit pages open the record named in the address (#/path?id=N); unknown id -> not found
import { describe, it, expect, afterEach } from 'vitest'
import { render, screen, cleanup, waitFor } from '@testing-library/react'
import type { ReactElement } from 'react'
import { OrgProvider } from '../context/OrgContext'
import App from '../App'
import EmployeeDetails from '../pages/employees/EmployeeDetails'
import EditEmployee from '../pages/employees/EditEmployee'
import ProjectDetail from '../pages/projects/ProjectDetail'
import EditProject from '../pages/projects/EditProject'
import EventDetail from '../pages/events/EventDetail'
import EditEvent from '../pages/events/EditEvent'
import EditFund from '../pages/funds/EditFund'
import Profile from '../pages/profile/Profile'
import EditProfile from '../pages/profile/EditProfile'
import PersonalTransactions from '../pages/profile/PersonalTransactions'
import { MOCK_USERS, MOCK_PROJECTS, MOCK_EVENTS, MOCK_FUNDS } from '../api/mockData'

const nav = () => {}
const wrap = (ui: ReactElement) => render(<OrgProvider orgData={{}}>{ui}</OrgProvider>)
const inputValues = () => Array.from(document.querySelectorAll('input')).map((i) => i.value)
afterEach(() => { cleanup(); window.sessionStorage.clear(); window.location.hash = '' })

describe('detail / edit pages open the requested record', () => {
  it('EmployeeDetails id=3', () => { wrap(<EmployeeDetails id="3" navigate={nav} />); expect(screen.getAllByText(MOCK_USERS[2].full_name).length).toBeGreaterThan(0); expect(screen.queryByText(MOCK_USERS[0].full_name)).toBeNull() })
  it('EditEmployee id=3', () => { wrap(<EditEmployee id="3" navigate={nav} />); expect(inputValues()).toContain(MOCK_USERS[2].first_name) })
  it('ProjectDetail id=2', () => { wrap(<ProjectDetail id="2" navigate={nav} />); expect(screen.getAllByText(MOCK_PROJECTS[1].title).length).toBeGreaterThan(0) })
  it('EditProject id=2', () => { wrap(<EditProject id="2" navigate={nav} />); expect(inputValues()).toContain(MOCK_PROJECTS[1].title) })
  it('EventDetail id=3', () => { wrap(<EventDetail id="3" navigate={nav} />); expect(screen.getAllByText(MOCK_EVENTS[2].title).length).toBeGreaterThan(0) })
  it('EditEvent id=3', () => { wrap(<EditEvent id="3" navigate={nav} />); expect(inputValues()).toContain(MOCK_EVENTS[2].title) })
  it('EditFund id=2', () => { wrap(<EditFund id="2" navigate={nav} />); expect(inputValues()).toContain(MOCK_FUNDS[1].name) })
})

describe('unknown or missing id shows a not-found state (never record 1)', () => {
  const cases: [string, (id?: string) => ReactElement, string][] = [
    ['EmployeeDetails', (id) => <EmployeeDetails id={id} navigate={nav} />, MOCK_USERS[0].full_name],
    ['EditEmployee',    (id) => <EditEmployee id={id} navigate={nav} />,    MOCK_USERS[0].full_name],
    ['ProjectDetail',   (id) => <ProjectDetail id={id} navigate={nav} />,   MOCK_PROJECTS[0].title],
    ['EditProject',     (id) => <EditProject id={id} navigate={nav} />,     MOCK_PROJECTS[0].title],
    ['EventDetail',     (id) => <EventDetail id={id} navigate={nav} />,     MOCK_EVENTS[0].title],
    ['EditEvent',       (id) => <EditEvent id={id} navigate={nav} />,       MOCK_EVENTS[0].title],
    ['EditFund',        (id) => <EditFund id={id} navigate={nav} />,        MOCK_FUNDS[0].name],
  ]
  it.each(cases)('%s with id=999', (_n, make, firstRecord) => {
    wrap(make('999')); expect(screen.getByText(/not found/i)).toBeTruthy(); expect(screen.queryByText(firstRecord)).toBeNull(); expect(inputValues()).not.toContain(firstRecord)
  })
  it.each(cases)('%s with no id', (_n, make) => { wrap(make(undefined)); expect(screen.getByText(/not found/i)).toBeTruthy() })
  it('the not-found button goes back to the list', () => {
    const calls: string[] = []; wrap(<ProjectDetail id="999" navigate={(p) => calls.push(p)} />)
    screen.getByRole('button', { name: /back to/i }).click(); expect(calls).toEqual(['/projects'])
  })
})

describe('profile pages follow the logged-in user (no more default user 1)', () => {
  const maria = MOCK_USERS[1]
  it('Profile shows the logged-in user', () => { wrap(<Profile currentUser={maria} navigate={nav} />); expect(screen.getAllByText(maria.full_name).length).toBeGreaterThan(0); expect(screen.queryByText(MOCK_USERS[0].full_name)).toBeNull() })
  it('EditProfile edits the logged-in user', () => { wrap(<EditProfile currentUser={maria} navigate={nav} />); expect(inputValues()).toContain(maria.full_name) })   // the form shows the full name in one field
  it('PersonalTransactions uses the logged-in user', () => { wrap(<PersonalTransactions currentUser={maria} navigate={nav} />); expect(screen.queryByText(/not found/i)).toBeNull() })
  it('an explicit userId still wins', () => { wrap(<Profile userId="3" currentUser={maria} navigate={nav} />); expect(screen.getAllByText(MOCK_USERS[2].full_name).length).toBeGreaterThan(0) })
  it('a user that no longer exists shows not found', () => { wrap(<Profile currentUser={{ ...maria, id: '999' }} navigate={nav} />); expect(screen.getByText(/not found/i)).toBeTruthy() })
})

describe('through the real router', () => {
  const signIn = () => { window.sessionStorage.setItem('unifits_authed', 'true'); window.sessionStorage.setItem('unifits_user', JSON.stringify(MOCK_USERS[1])) }
  it('deep link #/projects/detail?id=2 opens project 2', async () => {
    signIn(); window.location.hash = '#/projects/detail?id=2'; render(<App />)
    expect((await screen.findAllByText(MOCK_PROJECTS[1].title)).length).toBeGreaterThan(0)
  })
  it('deep link with an unknown id shows not found', async () => {
    signIn(); window.location.hash = '#/events/detail?id=999'; render(<App />)
    expect(await screen.findByText(/not found/i)).toBeTruthy()
  })
  it('a detail address is still a known route (not the dashboard fallback)', async () => {
    signIn(); window.location.hash = '#/employees/details?id=3'; render(<App />)
    await waitFor(() => expect(screen.getAllByText(MOCK_USERS[2].full_name).length).toBeGreaterThan(0))
  })
  it('My Profile shows the logged-in user, not user 1', async () => {
    signIn(); window.location.hash = '#/profile'; render(<App />)
    await waitFor(() => expect(screen.getAllByText(MOCK_USERS[1].full_name).length).toBeGreaterThan(0))
  })
})
