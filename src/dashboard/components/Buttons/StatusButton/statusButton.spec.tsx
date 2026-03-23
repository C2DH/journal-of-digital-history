import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import StatusButton from './StatusButton'

// Mock child components
vi.mock('../../Status/Status', () => ({
  default: ({ value }: { value: string }) => <span data-testid="status">{value}</span>,
}))

vi.mock('../../Dropdown/Dropdown', () => ({
  default: ({ actions, setOpen }: { actions: any; setOpen: any }) => (
    <div data-testid="dropdown">
      {actions.map((action: any, index: number) => (
        <button key={index} onClick={() => action.onClick()}>
          {action.label}
        </button>
      ))}
    </div>
  ),
}))

vi.mock('iconoir-react', () => ({
  NavArrowDown: () => <span data-testid="arrow-down" />,
  NavArrowUp: () => <span data-testid="arrow-up" />,
}))

vi.mock('../../../hooks/useClick', () => ({
  useClick: vi.fn(),
}))

describe('StatusButton', () => {
  const mockActions = [
    { label: 'Approve', onClick: vi.fn() },
    { label: 'Reject', onClick: vi.fn() },
  ]

  it('renders the status with the given value', () => {
    render(<StatusButton actions={mockActions} value="published" />)

    expect(screen.getByTestId('status')).toHaveTextContent('published')
  })

  it('renders the down arrow when dropdown is closed', () => {
    render(<StatusButton actions={mockActions} value="published" />)

    expect(screen.getByTestId('arrow-down')).toBeInTheDocument()
    expect(screen.queryByTestId('arrow-up')).not.toBeInTheDocument()
  })

  it('does not render the dropdown when closed', () => {
    render(<StatusButton actions={mockActions} value="published" />)

    expect(screen.queryByTestId('dropdown')).not.toBeInTheDocument()
  })

  it('opens the dropdown and shows up arrow when button is clicked', () => {
    render(<StatusButton actions={mockActions} value="published" />)

    const button = screen.getByRole('button', { name: /published/i })
    fireEvent.click(button)

    expect(screen.getByTestId('dropdown')).toBeInTheDocument()
    expect(screen.getByTestId('arrow-up')).toBeInTheDocument()
    expect(screen.queryByTestId('arrow-down')).not.toBeInTheDocument()
  })

  it('closes the dropdown when button is clicked again', () => {
    render(<StatusButton actions={mockActions} value="published" />)

    const button = screen.getByRole('button', { name: /published/i })

    // Open
    fireEvent.click(button)
    expect(screen.getByTestId('dropdown')).toBeInTheDocument()

    // Close
    fireEvent.click(button)
    expect(screen.queryByTestId('dropdown')).not.toBeInTheDocument()
    expect(screen.getByTestId('arrow-down')).toBeInTheDocument()
  })

  it('passes actions to the dropdown component', () => {
    render(<StatusButton actions={mockActions} value="draft" />)

    const button = screen.getByRole('button', { name: /draft/i })
    fireEvent.click(button)

    expect(screen.getByText('Approve')).toBeInTheDocument()
    expect(screen.getByText('Reject')).toBeInTheDocument()
  })

  it('converts value to string for the Status component', () => {
    render(<StatusButton actions={mockActions} value="pending" />)

    expect(screen.getByTestId('status')).toHaveTextContent('pending')
  })
})
