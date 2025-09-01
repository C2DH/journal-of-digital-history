import { render, screen } from '@testing-library/react'
import { vi } from 'vitest'

import Toast from './Toast'

describe('Toast', () => {
  it('renders with message and submessage', () => {
    render(<Toast open={true} message="Hello World" submessage="Submessage here" type="info" />)
    expect(screen.getByText('Hello World')).toBeInTheDocument()
    expect(screen.getByText('Submessage here')).toBeInTheDocument()
  })

  it('renders CheckCircleIcon for info/success', () => {
    render(<Toast open={true} message="msg" type="info" />)
    expect(screen.getByTestId('toast-icon-check')).toBeInTheDocument()
  })

  it('renders ErrorIcon for error', () => {
    render(<Toast open={true} message="msg" type="error" />)
    expect(screen.getByTestId('toast-icon-error')).toBeInTheDocument()
  })

  it('does not render when open is false', () => {
    render(<Toast open={false} message="msg" />)
    expect(screen.queryByText('msg')).not.toBeInTheDocument()
  })

  it('calls onClose after 5 seconds', async () => {
    vi.useFakeTimers()
    const onClose = vi.fn()
    render(<Toast open={true} message="msg" onClose={onClose} />)
    vi.advanceTimersByTime(5000)
    expect(onClose).toHaveBeenCalled()
    vi.useRealTimers()
  })
})
