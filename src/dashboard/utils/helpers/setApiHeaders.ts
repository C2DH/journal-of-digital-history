import axios, { AxiosInstance } from 'axios'
import UniversalCookie from 'universal-cookie'

/**
 * Creates a properly configured Axios instance with Bearer token authentication.
 */

const api: AxiosInstance = axios.create({
  withCredentials: true,
})

// Always get the latest token from the cookie
api.interceptors.request.use((config) => {
  const csrfToken = new UniversalCookie().get('csrftoken')

  if (csrfToken) {
    config.headers['X-CSRFToken'] = `${csrfToken}`
  } else {
    console.error('[Authorization] No csrf token available. Csrf Token :', csrfToken)
  }
  console.info('[AxiosInstance] - Request headers:', config.headers)
  return config
})

export default api
