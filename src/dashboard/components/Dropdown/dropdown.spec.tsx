import { fireEvent, render, screen } from '@testing-library/react'
import { vi } from 'vitest'

import Dropdown from './Dropdown'

describe('Dropdown', () => {
  const setOpen = vi.fn()
  const actions = [
    { label: 'Approve', onClick: vi.fn() },
    { label: 'Delete', onClick: vi.fn() },
  ]

  beforeEach(() => {
    setOpen.mockClear()
    actions.forEach((a) => a.onClick.mockClear())
  })

  it('renders all actions as buttons', () => {
    render(<Dropdown actions={actions} setOpen={setOpen} />)
    expect(screen.getByText('Approve')).toBeInTheDocument()
    expect(screen.getByText('Delete')).toBeInTheDocument()
  })

  it('calls setOpen and action.onClick when a button is clicked', () => {
    render(<Dropdown actions={actions} setOpen={setOpen} />)
    const approveBtn = screen.getByText('Approve')
    fireEvent.click(approveBtn)
    expect(setOpen).toHaveBeenCalledWith(false)
    expect(actions[0].onClick).toHaveBeenCalled()
  })
})
