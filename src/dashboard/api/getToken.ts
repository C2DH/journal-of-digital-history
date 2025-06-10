import axios, { AxiosInstance } from 'axios'
import Cookies from 'js-cookie'

/**
 * Creates a properly configured Axios instance with Bearer token authentication.
 */

const api: AxiosInstance = axios.create({
  baseURL: '/api/',
  withCredentials: true,
})

// Always get the latest token from the cookie
api.interceptors.request.use((config) => {
  const token = Cookies.get('token')
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
        const newToken = Cookies.get('token')
        if (newToken) {
          originalRequest.headers['Authorization'] = `Bearer ${newToken}`
        }
        return api(originalRequest)
      } catch (refreshError) {
        Cookies.remove('token')
        Cookies.remove('refreshToken')
      }
    }
    return Promise.reject(error)
  },
)

export async function loginWithToken(username: string, password: string) {
  const response = await axios.post('/api/token/', { username, password })
  const { access, refresh } = response.data
  Cookies.set('token', access, { expires: 1, secure: true, sameSite: 'strict' })
  Cookies.set('refreshToken', refresh, { expires: 1, secure: true, sameSite: 'strict' })
}

export async function refreshToken() {
  const refresh = Cookies.get('refreshToken')
  const response = await axios.post('/api/token/refresh/', { refresh })
  Cookies.set('token', response.data.access, { expires: 1, secure: true, sameSite: 'strict' })
}

export default api
