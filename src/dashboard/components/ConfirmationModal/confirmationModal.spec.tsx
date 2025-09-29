import { fireEvent, render, screen } from '@testing-library/react'
import { vi } from 'vitest'

import ConfirmationModal from './ConfirmationModal'

describe('ConfirmationModal', () => {
  const onCancel = vi.fn()
  const onConfirm = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('does not render when isOpen is false', () => {
    render(
      <ConfirmationModal isOpen={false} message="" onCancel={onCancel} onConfirm={onConfirm} />,
    )
    expect(screen.queryByTestId('confirmation-modal')).not.toBeInTheDocument()
  })

  it('renders correctly when isOpen is true', () => {
    render(
      <ConfirmationModal
        isOpen={true}
        message="Are you sure?"
        onCancel={onCancel}
        onConfirm={onConfirm}
      />,
    )
    expect(screen.getByTestId('confirmation-modal')).toBeInTheDocument()
    expect(screen.getByText('Are you sure?')).toBeInTheDocument()
    expect(screen.getByTestId('confirmation-modal-send-button')).toBeInTheDocument()
    expect(screen.getByTestId('confirmation-modal-cancel-button')).toBeInTheDocument()
  })

  it('renders correctly and then it closes with the Close button', async () => {
    render(
      <ConfirmationModal
        isOpen={true}
        message="Are you sure?"
        onCancel={onCancel}
        onConfirm={onConfirm}
      />,
    )
    expect(screen.getByTestId('confirmation-modal')).toBeInTheDocument()
    const closeButton = screen.getByTestId('confirmation-modal-close-button')

    fireEvent.click(closeButton)
    expect(onCancel).toHaveBeenCalledTimes(1)
  })

  it('renders correctly and then it closes with the Cancel button', async () => {
    render(
      <ConfirmationModal
        isOpen={true}
        message="Are you sure?"
        onCancel={onCancel}
        onConfirm={onConfirm}
      />,
    )
    expect(screen.getByTestId('confirmation-modal')).toBeInTheDocument()
    const cancelButton = screen.getByTestId('confirmation-modal-cancel-button')

    fireEvent.click(cancelButton)
    expect(onCancel).toHaveBeenCalledTimes(1)
  })
})
