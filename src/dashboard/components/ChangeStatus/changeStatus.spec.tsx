import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { vi } from 'vitest'

import ChangeStatus from './ChangeStatus'

const mockOnClose = vi.fn()
const mockOnNotify = vi.fn()

const selectedRows = [
  { pid: 'abc1237635', title: 'First Abstract' },
  { pid: 'def456yu3y', title: 'Second Abstract' },
]

vi.mock('../../utils/api/api', () => ({
  modifyStatus: vi.fn(() => Promise.resolve({ data: { message: 'success' } })),
}))

describe('ChangeStatus', () => {
  beforeEach(() => {
    mockOnClose.mockClear()
    mockOnNotify.mockClear()
  })

  it('renders selected rows and dropdown', () => {
    render(
      <ChangeStatus
        item="abstracts"
        selectedRows={selectedRows}
        onClose={mockOnClose}
        onNotify={mockOnNotify}
      />,
    )
    expect(screen.getByText('First Abstract')).toBeInTheDocument()
    expect(screen.getByText('Second Abstract')).toBeInTheDocument()
    expect(screen.getByLabelText(/Select new status/i)).toBeInTheDocument()
  })

  it('calls onClose when Cancel is clicked', () => {
    render(
      <ChangeStatus
        item="abstracts"
        selectedRows={selectedRows}
        onClose={mockOnClose}
        onNotify={mockOnNotify}
      />,
    )
    fireEvent.click(screen.getByText(/Cancel/i))
    expect(mockOnClose).toHaveBeenCalled()
  })

  it('shows validation error if status is not selected', () => {
    render(
      <ChangeStatus
        item="abstracts"
        selectedRows={selectedRows}
        onClose={mockOnClose}
        onNotify={mockOnNotify}
      />,
    )
    fireEvent.click(screen.getByText(/Send/i))
    expect(mockOnNotify).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'error',
        message: expect.any(String),
      }),
    )
  })

  it('submits when status is selected', async () => {
    render(
      <ChangeStatus
        item="abstracts"
        selectedRows={selectedRows}
        onClose={mockOnClose}
        onNotify={mockOnNotify}
      />,
    )
    fireEvent.change(screen.getByLabelText(/Select new status/i), {
      target: { value: 'submitted' },
    })
    fireEvent.click(screen.getByRole('button', { name: /Send/i }))

    await waitFor(() => {
      expect(mockOnClose).toHaveBeenCalled()
      expect(mockOnNotify).toHaveBeenCalled()
    })
  })
})
