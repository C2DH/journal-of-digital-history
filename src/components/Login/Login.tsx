import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { userLoginRequest } from '../../logic/api/login'

import './Login.css'

const Login = () => {
  const { t } = useTranslation()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)

  const handleLogin = async (e) => {
    e.preventDefault()
    setError(null)
    try {
      const res = await userLoginRequest(username, password)
      if (res && res.status === 200) {
        window.location.reload()
      }
    } catch (err) {
      setError(t('error.invalidUser'))
      console.error('Login error:', err)
    }
  }

  return (
    <>
      <p className="login-version">Tartempion v0.1</p>
      <div className="login-page">
        <form className="login-form" onSubmit={handleLogin}>
          <h2>Admin login</h2>

          {error && <div className="error">{error}</div>}
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Login</button>
        </form>
      </div>
    </>
  )
}

export default Login
