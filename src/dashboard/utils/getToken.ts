import axios, { AxiosInstance } from 'axios'
import UniversalCookie from 'universal-cookie'

const cookies = new UniversalCookie()
const isSecure = window.location.protocol === 'https:'

/**
 * Creates a properly configured Axios instance with Bearer token authentication.
 */

const api: AxiosInstance = axios.create({
  baseURL: '/api/',
  withCredentials: true,
})

// Always get the latest token from the cookie
api.interceptors.request.use((config) => {
  const token = cookies.get('token')
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      try {
        await refreshToken()
        const newToken = cookies.get('token')
        if (newToken) {
          originalRequest.headers['Authorization'] = `Bearer ${newToken}`
        }
        return api(originalRequest)
      } catch (refreshError) {
        cookies.remove('token')
        cookies.remove('refreshToken')
      }
    }
    return Promise.reject(error)
  },
)

/**
 * Authenticates a user with the provided username and password,
 * retrieves access and refresh tokens, and stores them in cookies.
 *
 * @param username - The user's username.
 * @param password - The user's password.
 */
export async function loginWithToken(username: string, password: string) {
  const response = await axios.post(
    '/api/token/',
    { username, password },
    { withCredentials: true },
  )
  const { access, refresh } = response.data
  cookies.set('token', access, { maxAge: 86400, secure: isSecure })
  cookies.set('refreshToken', refresh, {
    maxAge: 86400,
    secure: isSecure,
  })
}

/**
 * Refreshes the authentication token using the stored refresh token.
 * Updates the access token cookie upon success.
 */
export async function refreshToken() {
  const refresh = cookies.get('refreshToken')
  const response = await axios.post('/api/token/refresh/', { refresh }, { withCredentials: true })
  cookies.set('token', response.data.access, {
    maxAge: 86400,
    secure: isSecure,
  })
}

export default api
