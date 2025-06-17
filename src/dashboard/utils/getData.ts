import axios, { AxiosInstance } from 'axios'
import UniversalCookie from 'universal-cookie'

const csrfToken = new UniversalCookie().get('csrftoken')

/**
 * Creates a properly configured Axios instance with Bearer token authentication.
 */

const api: AxiosInstance = axios.create({
  baseURL: '/api/',
  withCredentials: true,
})

// Always get the latest token from the cookie
api.interceptors.request.use((config) => {
  if (csrfToken) {
    config.headers['Authorization'] = `Bearer ${csrfToken}`
  } else {
    console.error('[Authorization] No csrf token available. Csrf Token :', csrfToken)
  }
  return config
})

export default api
