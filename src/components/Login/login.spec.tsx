import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { vi } from 'vitest'

import Login from './Login'

// Mock the userLoginRequest function
vi.mock('../../logic/api/login', () => ({
  userLoginRequest: vi.fn(() => Promise.resolve()),
}))

// Mock i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}))

describe('Login', () => {
  it('renders login form', () => {
    render(<Login />)
    expect(screen.getByPlaceholderText('Username')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /login.button/i })).toBeInTheDocument()
  })

  it('shows error message on login failure', async () => {
    const { userLoginRequest } = await import('../../logic/api/login')
    ;(userLoginRequest as vi.Mock).mockImplementationOnce(() => Promise.reject(new Error('fail')))
    render(<Login />)

    fireEvent.change(screen.getByPlaceholderText('Username'), { target: { value: 'user' } })
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'pass' } })
    fireEvent.click(screen.getByRole('button', { name: /login.button/i }))

    await waitFor(() => {
      expect(screen.getByText('error.invalidUser')).toBeInTheDocument()
    })
  })

  it('reloads the page on successful login', async () => {
    const { userLoginRequest } = await import('../../logic/api/login')
    ;(userLoginRequest as vi.Mock).mockResolvedValue({ status: 200 })

    render(<Login />)
    fireEvent.change(screen.getByPlaceholderText('Username'), { target: { value: 'foo' } })
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'bar' } })
    fireEvent.click(screen.getByRole('button', { name: /login.button/i }))

    await waitFor(() => {
      expect(userLoginRequest).toHaveBeenCalledWith('foo', 'bar')
    })
  })
})
