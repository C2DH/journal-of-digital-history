import axios, { AxiosInstance } from 'axios'

/**
 * Creates a properly configured Axios instance with Bearer token authentication.
 */
const api: AxiosInstance = axios.create({
  baseURL: '/api/',
  headers: {
    Authorization: `Bearer ${localStorage.getItem('token')}`,
  },
  withCredentials: true,
})

export async function refreshToken() {
  const refresh = localStorage.getItem('refreshToken')
  if (!refresh) throw new Error('No refresh token available')
  const response = await axios.post('/api/token/refresh/', { refresh })
  localStorage.setItem('token', response.data.access)
  return response.data.access
}

export default api
