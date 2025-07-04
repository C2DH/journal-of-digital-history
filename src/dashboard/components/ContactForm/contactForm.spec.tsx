import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { vi } from 'vitest'

import { modifyAbstractStatus } from '../../utils/helpers/postData'
import ContactForm from './ContactForm'

// Mock dependencies
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}))
vi.mock('../../utils/helpers/postData', () => ({
  modifyAbstractStatus: vi.fn(() => Promise.resolve({ data: { message: 'Success!' } })),
}))
vi.mock('../../schemas/contactForm', () => ({
  contactFormSchema: {},
}))
vi.mock('ajv', () => ({
  default: vi.fn().mockImplementation(() => ({
    compile: vi.fn(() => () => ({ valid: true, errors: null })),
  })),
}))
vi.mock('ajv-formats', () => ({
  default: vi.fn(),
}))

describe('ContactForm', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders all fields and submits successfully', async () => {
    render(
      <ContactForm
        contactEmail="test@example.com"
        pid="PID123"
        action="accepted"
        title="Test Title"
      />,
    )

    // Check fields
    expect(screen.getByLabelText(/From/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/To/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Subject/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Message/i)).toBeInTheDocument()

    // Fill fields
    fireEvent.change(screen.getByLabelText(/From/i), { target: { value: 'sender@example.com' } })
    fireEvent.change(screen.getByLabelText(/To/i), { target: { value: 'recipient@example.com' } })
    fireEvent.change(screen.getByLabelText(/Subject/i), { target: { value: 'Hello' } })
    fireEvent.change(screen.getByLabelText(/Message/i), { target: { value: 'Test message' } })

    // Submit
    fireEvent.click(screen.getByRole('button', { name: /send/i }))

    // Wait for notification
    await waitFor(() => expect(screen.getByText(/Success!/i)).toBeInTheDocument())
  })

  it('shows error notification when API call fails', async () => {
    // Mock the API to reject with an error response
    const mockedModifyAbstractStatus = vi.mocked(modifyAbstractStatus)
    mockedModifyAbstractStatus.mockRejectedValueOnce({
      response: { data: { message: 'error' } },
    })

    render(
      <ContactForm
        contactEmail="test@example.com"
        pid="PID123"
        action="accepted"
        title="Test Title"
      />,
    )

    // Fill fields
    fireEvent.change(screen.getByLabelText(/From/i), { target: { value: 'sender@example.com' } })
    fireEvent.change(screen.getByLabelText(/To/i), { target: { value: 'recipient@example.com' } })
    fireEvent.change(screen.getByLabelText(/Subject/i), { target: { value: 'Hello' } })
    fireEvent.change(screen.getByLabelText(/Message/i), { target: { value: 'Test message' } })

    // Submit
    fireEvent.click(screen.getByRole('button', { name: /send/i }))

    // Wait for error notification
    await waitFor(() => expect(screen.getByText('error')).toBeInTheDocument())
  })
})
