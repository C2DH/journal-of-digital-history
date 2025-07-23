import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import Avatar from './Avatar'

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
