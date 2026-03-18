import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import ContactForm from './ContactForm'

const mockCloseModal = vi.fn()
const mockOpenModal = vi.fn()
const mockSetFormData = vi.fn()

let mockIsModalOpen = false
let mockFormData = {
  pid: 'K7b2L9mP4zQ1',
  from: 'jdh.admin@uni.lu',
  to: 'test@example.com',
  subject: 'Test Submission',
  body: 'email.accepted.body',
  status: 'accepted',
}

vi.mock('../../store', () => ({
  useFormStore: () => ({
    isModalOpen: mockIsModalOpen,
    openModal: mockOpenModal.mockImplementation(() => {
      mockIsModalOpen = true
    }),
    closeModal: mockCloseModal.mockImplementation(() => {
      mockIsModalOpen = false
    }),
    setFormData: mockSetFormData.mockImplementation((data) => {
      mockFormData = { ...mockFormData, ...data }
    }),
    formData: mockFormData,
  }),
}))

vi.mock('../../utils/api/api', () => ({
  modifyAbstractStatusWithEmail: vi.fn(() =>
    Promise.resolve({ data: { message: 'Message sent successfully!' } }),
  ),
  patchArticleStatus: vi.fn(() => Promise.resolve({ message: 'Status updated' })),
  sendArticleToCopyeditor: vi.fn(() => Promise.resolve({ message: 'Sent to copyeditor' })),
}))

vi.mock('../../utils/helpers/notification', () => ({
  notify: vi.fn(),
}))

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, fallback?: string) => fallback ?? key,
  }),
}))

const mockData = {
  id: 'K7b2L9mP4zQ1',
  contactEmail: 'test@example.com',
  title: 'Test Submission',
  row: ['K7b2L9mP4zQ1', '', '', '', 'John', 'Doe'],
}
const mockOnClose = vi.fn()

describe('ContactForm', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockIsModalOpen = false
  })

  it('renders the form with all fields', () => {
    render(<ContactForm rowData={mockData} rowAction="accepted" onClose={mockOnClose} />)

    expect(screen.getByLabelText(/From/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/To/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Subject/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Body/i)).toBeInTheDocument()
    expect(screen.getByTestId('contact-form-send-button')).toBeInTheDocument()
  })

  it('does not render the To field for copyediting action', () => {
    render(<ContactForm rowData={mockData} rowAction="copyediting" onClose={mockOnClose} />)

    expect(screen.queryByLabelText(/To/i)).not.toBeInTheDocument()
  })

  it('updates formData when user types in a field', () => {
    render(<ContactForm rowData={mockData} rowAction="accepted" onClose={mockOnClose} />)

    fireEvent.change(screen.getByLabelText(/To/i), { target: { value: 'new@example.com' } })

    expect(mockSetFormData).toHaveBeenCalledWith(expect.objectContaining({ to: 'new@example.com' }))
  })

  it('calls openModal when form is submitted', () => {
    render(<ContactForm rowData={mockData} rowAction="accepted" onClose={mockOnClose} />)

    fireEvent.click(screen.getByTestId('contact-form-send-button'))

    expect(mockOpenModal).toHaveBeenCalled()
  })

  it('calls closeModal and onClose when cancel is clicked on confirmation modal', async () => {
    mockIsModalOpen = true
    render(<ContactForm rowData={mockData} rowAction="accepted" onClose={mockOnClose} />)

    const cancelButton = await screen.findByTestId('confirmation-modal-cancel-button')
    fireEvent.click(cancelButton)

    expect(mockCloseModal).toHaveBeenCalled()
  })

  it('sends sucessfully an email', async () => {
    const { modifyAbstractStatusWithEmail } = await import('../../utils/api/api')
    const { notify } = await import('../../utils/helpers/notification')

    mockIsModalOpen = true
    render(<ContactForm rowData={mockData} rowAction="accepted" onClose={mockOnClose} />)

    const confirmButton = await screen.findByTestId('confirmation-modal-send-button')
    fireEvent.click(confirmButton)

    await waitFor(() => {
      expect(modifyAbstractStatusWithEmail).toHaveBeenCalledWith(mockFormData.pid, mockFormData)
      expect(mockCloseModal).toHaveBeenCalled()
      expect(mockOnClose).toHaveBeenCalled()
      expect(notify).toHaveBeenCalledWith(
        'success',
        expect.any(String),
        'Message sent successfully!',
      )
    })
  })

  it('calls notify with error when api call fails', async () => {
    const { modifyAbstractStatusWithEmail } = await import('../../utils/api/api')
    const { notify } = await import('../../utils/helpers/notification')
    vi.mocked(modifyAbstractStatusWithEmail).mockRejectedValueOnce({ error: 'API Error' })

    mockIsModalOpen = true
    render(<ContactForm rowData={mockData} rowAction="accepted" onClose={mockOnClose} />)

    const confirmButton = await screen.findByTestId('confirmation-modal-send-button')
    fireEvent.click(confirmButton)

    await waitFor(() => {
      expect(notify).toHaveBeenCalledWith('error', expect.any(String), 'API Error')
    })
  })

  it('calls notify with validation error when form data is invalid', async () => {
    const { notify } = await import('../../utils/helpers/notification')
    mockFormData = { ...mockFormData, to: 'not-an-email' }
    mockIsModalOpen = true

    render(<ContactForm rowData={mockData} rowAction="accepted" onClose={mockOnClose} />)

    const confirmButton = await screen.findByTestId('confirmation-modal-send-button')
    fireEvent.click(confirmButton)

    await waitFor(() => {
      expect(notify).toHaveBeenCalledWith('error', expect.any(String), expect.any(String))
    })
  })
})
