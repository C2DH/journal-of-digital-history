import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { vi } from 'vitest'

import ContactForm from './ContactForm'

// Mock the async helper
vi.mock('../../utils/helpers/postData', () => ({
  modifyAbstractStatus: vi.fn(() =>
    Promise.resolve({ data: { message: 'Message sent successfully!' } }),
  ),
}))

const mockData = {
  id: '123',
  contactEmail: 'test@example.com',
  title: 'Test Submission',
  row: ['123', '', '', '', 'John', 'Doe'],
}
const mockAction = 'accepted'
const mockOnClose = vi.fn()
const mockOnNotify = vi.fn()

describe('ContactForm', () => {
  it('calls onNotify with success message on valid submit', async () => {
    render(
      <ContactForm
        data={mockData}
        action={mockAction}
        onClose={mockOnClose}
        onNotify={mockOnNotify}
      />,
    )
    // Fill all required fields (if needed)
    fireEvent.change(screen.getByLabelText(/To/i), { target: { value: 'test@example.com' } })
    fireEvent.change(screen.getByLabelText(/Body/i), { target: { value: 'this is a body' } })
    fireEvent.click(screen.getByRole('button', { name: /Send/i }))

    await waitFor(() => {
      expect(mockOnNotify).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'success',
          message: 'Message sent successfully!',
        }),
      )
    })
  })
  it('calls onNotify with error on invalid submit', async () => {
    render(
      <ContactForm
        data={mockData}
        action={mockAction}
        onClose={mockOnClose}
        onNotify={mockOnNotify}
      />,
    )
    // Clear required field
    fireEvent.change(screen.getByLabelText(/To/i), {
      target: { value: 'this is not an email address' },
    })
    fireEvent.click(screen.getByRole('button', { name: /Send/i }))
    expect(mockOnNotify).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'error', message: 'Validation failed.' }),
    )
  })
})
