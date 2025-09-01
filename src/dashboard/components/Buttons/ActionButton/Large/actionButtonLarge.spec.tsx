import { fireEvent, render, screen } from '@testing-library/react'
import { vi } from 'vitest'

import ActionButtonLarge from './ActionButtonLarge'

vi.mock('../../../Dropdown/Dropdown', () => ({
  default: ({ actions, setOpen }: any) => (
    <div data-testid="dropdown">
      {actions.map((a: any) => (
        <button key={a.label} onClick={a.onClick}>
          {a.label}
        </button>
      ))}
    </div>
  ),
}))

describe('ActionButtonLarge', () => {
  const actions = [
    { label: 'Approve', onClick: vi.fn() },
    { label: 'Delete', onClick: vi.fn() },
  ]

  it('renders MoreHoriz icon', () => {
    render(<ActionButtonLarge actions={actions} active={true} />)
    expect(screen.getByTestId('large-action-button')).toBeInTheDocument()
  })

  it('shows dropdown on icon click and calls action', () => {
    render(<ActionButtonLarge actions={actions} active={true} />)
    const icon = screen.getByTestId('large-action-button')
    fireEvent.click(icon)
    expect(screen.getByTestId('dropdown')).toBeInTheDocument()
    const approveBtn = screen.getByText('Approve')
    fireEvent.click(approveBtn)
    expect(actions[0].onClick).toHaveBeenCalled()
  })

  it('closes dropdown when clicking outside', () => {
    render(<ActionButtonLarge actions={actions} active={true} />)
    const icon = screen.getByTestId('large-action-button')
    fireEvent.click(icon)
    expect(screen.getByTestId('dropdown')).toBeInTheDocument()
    // Simulate click outside
    fireEvent.mouseDown(document)
    expect(screen.queryByTestId('dropdown')).not.toBeInTheDocument()
  })
})
