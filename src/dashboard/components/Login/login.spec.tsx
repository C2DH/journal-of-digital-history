import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { vi } from 'vitest'
import Login from './Login'

// Mock translation
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}))

// Mock loginWithToken and refreshToken
vi.mock('../../utils/getToken', () => ({
  loginWithToken: vi.fn(() => Promise.resolve()),
  refreshToken: vi.fn(() => Promise.resolve()),
}))

describe('Login', () => {
  it('renders the login form', () => {
    render(<Login onLogin={() => {}} />)
    expect(screen.getByPlaceholderText('Username')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument()
  })

  it('calls onLogin with username and password on submit', async () => {
    const onLogin = vi.fn()
    render(<Login onLogin={onLogin} />)

    fireEvent.change(screen.getByPlaceholderText('Username'), { target: { value: 'user' } })
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'pass' } })
    fireEvent.click(screen.getByRole('button', { name: /login/i }))

    await waitFor(() => {
      expect(onLogin).toHaveBeenCalledWith('user', 'pass')
    })
  })

  it('shows error message on login failure', async () => {
    const { loginWithToken } = await import('../../utils/getToken')
    ;(loginWithToken as vi.Mock).mockImplementationOnce(() => Promise.reject(new Error('fail')))
    render(<Login onLogin={() => {}} />)

    fireEvent.change(screen.getByPlaceholderText('Username'), { target: { value: 'user' } })
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'pass' } })
    fireEvent.click(screen.getByRole('button', { name: /login/i }))

    await waitFor(() => {
      expect(screen.getByText('error.invalidUser')).toBeInTheDocument()
    })
  })
})
