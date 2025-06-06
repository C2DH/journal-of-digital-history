import axios from 'axios'
import { useState } from 'react'

import './Login.css'

const Login = ({ onLogin }: { onLogin: (username: string, password: string) => void }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)

  const handleLogin = async (e) => {
    e.preventDefault()
    setError(null)
    try {
      const response = await axios.post('/api/token/', {
        username,
        password,
      })
      const { access, refresh } = response.data
      localStorage.setItem('token', access)
      //TODO: finish implement refresh token
      localStorage.setItem('refreshToken', refresh)
      console.log('Login successful - access token:', access)
      onLogin(username, password)
    } catch (err) {
      setError('Invalid username or password')
      console.error('Login error:', err)
    }
  }

  return (
    <div className="login-page">
      <form className="login-form" onSubmit={handleLogin}>
        <h2>Dashboard Login</h2>
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
  )
}

export default Login
