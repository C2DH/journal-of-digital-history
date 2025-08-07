import { fireEvent, render, screen } from '@testing-library/react'
import { vi } from 'vitest'

import Modal from './Modal'

// Mock ContactForm
vi.mock('../ContactForm/ContactForm', () => ({
  default: ({ rowData = {}, action }: { rowData?: { contactEmail?: string }; action: string }) => {
    return (
      <div data-testid="contact-form">
        {rowData.contactEmail ?? ''} - {action}
      </div>
    )
  },
}))

describe('Modal', () => {
  const onClose = vi.fn()

  beforeEach(() => {
    onClose.mockClear()
  })

  it('does not render when open is false', () => {
    render(<Modal open={false} onClose={onClose} action="Contact" />)
    expect(screen.queryByTestId('contact-form')).not.toBeInTheDocument()
  })

  it('renders modal content when open is true', () => {
    render(
      <Modal
        open={true}
        onClose={onClose}
        action="Contact"
        rowData={{ contactEmail: 'test@example.com' }}
      />,
    )

    expect(screen.getByTestId('contact-form')).toHaveTextContent('test@example.com - contact')
    expect(screen.getByRole('button', { name: /×/ })).toBeInTheDocument()
    expect(screen.getByText('Contact')).toBeInTheDocument()
  })

  it('calls onClose when clicking the close button', () => {
    render(
      <Modal
        open={true}
        onClose={onClose}
        action="Contact"
        rowData={{ contactEmail: 'test@example.com' }}
      />,
    )
    fireEvent.click(screen.getByRole('button', { name: /×/ }))
    expect(onClose).toHaveBeenCalled()
  })

  it('calls onClose when clicking the backdrop', () => {
    render(
      <Modal
        open={true}
        onClose={onClose}
        action="Contact"
        rowData={{ contactEmail: 'test@example.com' }}
      />,
    )
    fireEvent.click(screen.getByTestId('modal-backdrop'))
    expect(onClose).toHaveBeenCalled()
  })
})
