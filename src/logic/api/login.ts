import axios from 'axios'
import UniversalCookie from 'universal-cookie'

/**
 * Fetches the current user's username from the backend API.
 * @returns A promise that resolves to the username as a string.
 * @throws If the username is not found in the response or the request fails.
 */
export async function fetchUsername(): Promise<string> {
  const csrfToken = new UniversalCookie().get('csrftoken')
  try {
    const response = await axios.get('/api/me', {
      headers: {
        'X-CSRFToken': csrfToken,
      },
    })
    const username = response.data?.username
    if (!username) {
      throw new Error('Username not found in response')
    }
    return username
  } catch (error) {
    throw new Error('Failed to fetch username')
  }
}

/**
 * Fetches a CSRF token from the server.
 * @returns A promise that resolves to the CSRF token string.
 */
export async function fetchCsrfToken(): Promise<string> {
  const response = await axios.get('/api/csrf/', { withCredentials: true })
  const csrfToken = response.data.csrfToken
  console.log('CSRF Token:', csrfToken)
  return csrfToken
}

/**
 * Sends a login request with the provided username and password.
 * Fetches a CSRF token and includes it in the request headers.
 *
 * @param username - The user's username.
 * @param password - The user's password.
 */
export async function userLoginRequest(username: string, password: string) {
  const csrfToken = await fetchCsrfToken()

  try {
    const res = await axios.post(
      '/api/login/',
      { username, password },
      {
        headers: {
          'X-CSRFToken': csrfToken,
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      },
    )
    return res
  } catch (error) {
    console.error('Login failed:', error)
  }
}

/**
 * Sends a logout request to the server, invalidating the current user session.
 * Fetches a CSRF token before making the request for security.
 * Logs an error to the console if the logout fails.
 */
export async function userLogoutRequest() {
  const csrfToken = await fetchCsrfToken()

  try {
    await axios.post(
      '/api/logout/',
      {},
      {
        headers: {
          'X-CSRFToken': csrfToken,
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      },
    )
    console.info('Logout successful')
  } catch (error) {
    console.error('Logout failed:', error)
  }
}
