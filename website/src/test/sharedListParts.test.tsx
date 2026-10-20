// sharedListParts.test.tsx — shared list-page building blocks: KpiStrip, TableToolbar (+ search / add), NativeFilterSelect, FilterSelect, TypePill
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import KpiStrip from '../components/KpiStrip'
import { TableToolbar, ToolbarSearch, ToolbarAddButton } from '../components/TableToolbar'
import { NativeFilterSelect, FilterSelect, TypePill } from '../components/ui'

describe('KpiStrip', () => {
  it('renders one tile per KPI with label, value and the value size', () => {
    render(<KpiStrip kpis={[{ label: 'A', value: 5, color: 'red' }, { label: 'B', value: '₱10', color: 'blue' }]} valueSize={22} />)
    expect(screen.getByText('A')).toBeTruthy(); expect(screen.getByText('5')).toBeTruthy()
    expect((screen.getByText('₱10') as HTMLElement).style.fontSize).toBe('22px')
  })
  it('defaults the value size to 28px', () => {
    render(<KpiStrip kpis={[{ label: 'A', value: 1, color: 'red' }]} />)
    expect((screen.getByText('1') as HTMLElement).style.fontSize).toBe('28px')
  })
})

describe('TableToolbar', () => {
  it('shows title, subtitle and its controls', () => {
    render(<TableToolbar title="Things Data Table" subtitle="3 records"><span>control</span></TableToolbar>)
    expect(screen.getByText('Things Data Table')).toBeTruthy(); expect(screen.getByText('3 records')).toBeTruthy(); expect(screen.getByText('control')).toBeTruthy()
  })
  it('ToolbarSearch reports the typed value; ToolbarAddButton reports clicks', () => {
    const onChange = vi.fn(); const onClick = vi.fn()
    render(<><ToolbarSearch value="" onChange={onChange} /><ToolbarAddButton onClick={onClick}>Add Thing</ToolbarAddButton></>)
    fireEvent.change(screen.getByPlaceholderText('Search…'), { target: { value: 'abc' } }); expect(onChange).toHaveBeenCalledWith('abc')
    fireEvent.click(screen.getByText('Add Thing')); expect(onClick).toHaveBeenCalledTimes(1)
  })
})

describe('filter selects', () => {
  const options = [{ value: 'all', label: 'All Types' }, { value: 'a', label: 'Alpha' }]
  it('NativeFilterSelect and FilterSelect both report the chosen value', () => {
    const a = vi.fn(); const b = vi.fn()
    render(<><NativeFilterSelect value="all" onChange={a} options={options} /><FilterSelect value="all" onChange={b} options={options} /></>)
    const [s1, s2] = Array.from(document.querySelectorAll('select'))
    fireEvent.change(s1, { target: { value: 'a' } }); fireEvent.change(s2, { target: { value: 'a' } })
    expect(a).toHaveBeenCalledWith('a'); expect(b).toHaveBeenCalledWith('a')
  })
})

describe('TypePill', () => { it('renders its text', () => { render(<TypePill>Education</TypePill>); expect(screen.getByText('Education')).toBeTruthy() }) })
