import { render, screen } from '@testing-library/react'
import { vi } from 'vitest'

import { useNotificationStore } from '../../store'
import Toast from './Toast'

vi.mock('../../store.ts', () => ({
  useNotificationStore: vi.fn(),
}))

const createMockStore = (override = {}) => {
  return {
    notification: {
      type: 'success',
      message: 'Hello World',
      submessage: 'Submessage here',
    },
    isVisible: true,
    setNotification: vi.fn(),
    ...override,
  }
}

describe('Toast', () => {
  beforeEach(() => {
    vi.mocked(useNotificationStore).mockImplementation(() => createMockStore())
  })

  it('renders with message and submessage', () => {
    renderToast()
    expect(screen.getByText('Hello World')).toBeInTheDocument()
    expect(screen.getByText('Submessage here')).toBeInTheDocument()
  })

  it('renders CheckCircleIcon for info/success', () => {
    renderToast()
    expect(screen.getByTestId('toast-icon-check')).toBeInTheDocument()
  })

  it('renders ErrorIcon for error', () => {
    vi.mocked(useNotificationStore).mockImplementation(() =>
      createMockStore({
        notification: {
          type: 'error',
          message: 'This is an error message',
          submessage: 'Error details',
        },
      }),
    )

    renderToast()
    expect(screen.getByTestId('toast-icon-error')).toBeInTheDocument()
  })

  it('does not render when open is false', () => {
    vi.mocked(useNotificationStore).mockImplementation(() => createMockStore({ isVisible: false }))
    renderToast()
    expect(screen.queryByText('msg')).not.toBeInTheDocument()
  })
})

const renderToast = () => {
  render(<Toast />)
}
