import { render, screen, fireEvent } from '@testing-library/react'
import Avatar from './Avatar'
import { describe, it, expect, vi } from 'vitest'

describe('Avatar', () => {
  it('renders the first letter of the username in uppercase', () => {
    render(<Avatar username="tudor" onLogout={() => {}} />)
    expect(screen.getByText('T')).toBeTruthy()
  })

  it('does not render if username is empty', () => {
    const { container } = render(<Avatar username="" onLogout={() => {}} />)
    expect(container.firstChild).toBeNull()
  })

  it('calls onLogout when clicked', () => {
    const onLogoutMock = vi.fn()
    render(<Avatar username="tudor" onLogout={onLogoutMock} />)
    fireEvent.click(screen.getByText('T'))
    expect(onLogoutMock).toHaveBeenCalled()
  })
})
