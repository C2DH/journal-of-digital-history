import { useEffect, useState } from 'react'

/**
 * Fetches items from the specified URL using the Fetch API.
 *
 * @param url - The endpoint from which to fetch data.
 * @returns A promise that resolves to the parsed JSON response.
 * @throws Will throw an error if the network response is not ok.
 */
export async function fetchItems(url: string, username?: string, password?: string) {
  const credentials = btoa(`${username}:${password}`) || ''
  const response = await fetch(url, {
    headers: {
      Authorization: `Basic ${credentials}`,
    },
  })
  if (!response.ok) {
    throw new Error(`Failed to fetch from ${url}: ${response.statusText}`)
  }
  return response.json()
}

/**
 * Custom React hook to fetch items from a given API endpoint.
 *
 * @template T - The type of items to fetch.
 * @param endpoint - The API endpoint to fetch data from.
 * @param limit - Optional limit for pagination.
 * @param offset - Optional offset for pagination.
 * @param username - Optional username for authentication.
 * @param password - Optional password for authentication.
 * @returns An object containing the fetched data, error message (if any), and loading state.
 */
export function useFetchItems<T>(
  endpoint: string,
  limit?: number,
  offset?: number,
  username?: string,
  password?: string,
) {
  const [data, setData] = useState<T[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const result = await fetchItems(
          `${endpoint}?limit=${limit}&offset=${offset}`,
          username,
          password,
        )
        setData(result.results)
        setError(null)
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message)
        } else {
          setError(String(error))
        }
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [endpoint, username, password])

  return { data, error, loading }
}
