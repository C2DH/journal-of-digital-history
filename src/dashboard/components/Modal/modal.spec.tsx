import { fireEvent, render, screen } from '@testing-library/react'
import { vi } from 'vitest'

import Modal from './Modal'

// Mock ContactForm
vi.mock('../ContactForm/ContactForm', () => ({
  default: ({
    rowData = {},
    rowAction,
  }: {
    rowData?: { contactEmail?: string }
    rowAction: string
  }) => {
    return (
      <div data-testid="contact-form">
        {rowData.contactEmail ?? ''} - {rowAction}
      </div>
    )
  },
}))

vi.mock('../SocialSchedule/SocialSchedule', () => ({
  default: ({ rowData = {}, action }: { rowData?: any; action: string }) => {
    return <div data-testid="social-schedule">Social Schedule Component - Action: {action}</div>
  },
}))

describe('Modal', () => {
  const onClose = vi.fn()

  beforeEach(() => {
    onClose.mockClear()
  })

  it('does not render when open is false', () => {
    render(<Modal item={'abstracts'} open={false} onClose={onClose} action="Contact" />)
    expect(screen.queryByTestId('contact-form')).not.toBeInTheDocument()
  })

  it('renders modal content when open is true', () => {
    render(
      <Modal
        item={'abstracts'}
        open={true}
        onClose={onClose}
        action="Abandoned"
        data={{ contactEmail: 'test@example.com' }}
      />,
    )

    expect(screen.getByTestId('contact-form')).toHaveTextContent('test@example.com - Abandoned')
    expect(screen.getByRole('button', { name: /×/ })).toBeInTheDocument()
    expect(screen.getByText('actions.Abandoned')).toBeInTheDocument()
  })

  it('calls onClose when clicking the close button', () => {
    render(
      <Modal
        item={'abstracts'}
        open={true}
        onClose={onClose}
        action="Contact"
        data={{ contactEmail: 'test@example.com' }}
      />,
    )
    fireEvent.click(screen.getByRole('button', { name: /×/ }))
    expect(onClose).toHaveBeenCalled()
  })

  it('calls onClose when clicking the backdrop', () => {
    render(
      <Modal
        item={'abstracts'}
        open={true}
        onClose={onClose}
        action="Contact"
        data={{ contactEmail: 'test@example.com' }}
      />,
    )
    fireEvent.click(screen.getByTestId('modal-backdrop'))
    expect(onClose).toHaveBeenCalled()
  })
})
