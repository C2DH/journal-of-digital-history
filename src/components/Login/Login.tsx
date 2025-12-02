import { useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router'

import { userLoginRequest } from '../../logic/api/login'
import Logo from '../Logo'
import './Login.css'

const Login = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const qc = useQueryClient()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string>('')

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    try {
      const res = await userLoginRequest(username, password)
      if (res?.status === 200) {
        qc.setQueryData(['auth:me'], username)
        navigate('/', { replace: true })
      } else if (res?.status === 401) {
        setError(t('pages.login.invalidUser'))
      } else if (res?.status === 500) {
        setError(t('pages.login.cannotAuthenticate'))
      }
    } catch (err: any) {
      console.error(err)
    }
  }

  return (
    <>
      <div className="login-page">
        <form className="login-form" onSubmit={handleLogin}>
          <div className="logo-container">
            <Logo />
            <h2>Journal of Digital History</h2>
          </div>
          {error && <div className="error">{error}</div>}
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />
          <button type="submit">{t('login.button')}</button>
        </form>
      </div>
    </>
  )
}

export default Login
