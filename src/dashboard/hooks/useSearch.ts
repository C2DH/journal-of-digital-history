import { useEffect, useState } from 'react'

type SearchResult<T> = {
  results: T[]
  loading: boolean
  error: string | null
}

export function useSearch<T = any>(
  endpoint: string,
  query: string,
  username?: string,
  password?: string,
): SearchResult<T> {
  const [results, setResults] = useState<T[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  //TODO: integrate properly with the API search
  //TODO: add debounce to avoid too many requests

  useEffect(() => {
    if (!query) {
      setResults([])
      setError(null)
      return
    }
    setLoading(true)
    setError(null)

    const fetchData = async () => {
      try {
        const params = new URLSearchParams({ q: query })
        const headers: Record<string, string> = {}
        if (username && password) {
          headers['Authorization'] = 'Basic ' + btoa(`${username}:${password}`)
        }
        const res = await fetch(`${endpoint}?${params.toString()}`, { headers })
        if (!res.ok) throw new Error('Failed to fetch')
        const data = await res.json()
        // Exact match on id or title
        const filtered = data.filter(
          (item: any) => item.id?.toString() === query || item.title === query,
        )
        setResults(filtered)
      } catch (err: any) {
        setError(err.message || 'Unknown error')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [endpoint, query, username, password])

  return { results, loading, error }
}
