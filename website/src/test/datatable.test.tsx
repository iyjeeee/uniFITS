// test/datatable.test.tsx — DataTable rows are only clickable when a page opts in with onRowClick
import { describe, it, expect, vi } from 'vitest'
import { render, fireEvent } from '@testing-library/react'
import { DataTable } from '../components/ui'
import type { Column } from '../types'

interface Row { id: string; name: string }
const columns: Column<Row>[] = [{ label: 'Name', key: 'name', accessor: 'name' }]
const data: Row[] = [{ id: '1', name: 'Ana' }, { id: '2', name: 'Ben' }]

describe('DataTable onRowClick', () => {
  it('calls the handler with the clicked row and shows a pointer cursor', () => {
    const onRowClick = vi.fn()
    const v = render(<DataTable columns={columns} data={data} onRowClick={onRowClick} />)
    const rows = v.container.querySelectorAll('tbody tr')
    expect((rows[1] as HTMLElement).style.cursor).toBe('pointer')
    fireEvent.click(rows[1])
    expect(onRowClick).toHaveBeenCalledWith(data[1])
  })

  it('keeps plain tables unchanged: no pointer cursor and nothing happens on click', () => {
    const v = render(<DataTable columns={columns} data={data} />)
    const row = v.container.querySelector('tbody tr') as HTMLElement
    expect(row.style.cursor).toBe('')
    expect(() => fireEvent.click(row)).not.toThrow()
  })
})
