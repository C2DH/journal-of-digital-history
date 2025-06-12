import { useEffect, useReducer, useCallback } from 'react'

import api from '../utils/getData'

type State<T> = {
  data: T[]
  error: string | null
  loading: boolean
  offset: number
  hasMore: boolean
}

type Action<T> =
  | { type: 'LOAD_START' }
  | { type: 'LOAD_SUCCESS'; payload: { results: T[]; limit: number } }
  | { type: 'LOAD_ERROR'; payload: string }
  | { type: 'RESET' }

function reducer<T>(state: State<T>, action: Action<T>): State<T> {
  switch (action.type) {
    case 'LOAD_START':
      return { ...state, loading: true }
    case 'LOAD_SUCCESS':
      return {
        ...state,
        loading: false,
        data: [...state.data, ...action.payload.results],
        offset: state.offset + action.payload.limit,
        hasMore: action.payload.results.length === action.payload.limit,
        error: null,
      }
    case 'LOAD_ERROR':
      return { ...state, loading: false, error: action.payload, hasMore: false }
    case 'RESET':
      return { data: [], error: null, loading: false, offset: 0, hasMore: true }
    default:
      return state
  }
}

/**
 * Custom React hook for fetching paginated data with infinite scroll support.
 *
 * @template T The type of the items being fetched.
 * @param endpoint - The API endpoint to fetch data from.
 * @param username - Optional username for basic authentication.
 * @param password - Optional password for basic authentication.
 * @param limit - The number of items to fetch per page (default is 10).
 * @returns An object containing:
 *   - `data`: The accumulated array of fetched items.
 *   - `error`: Any error message encountered during fetching.
 *   - `loading`: Whether a fetch operation is in progress.
 *   - `hasMore`: Whether there are more items to load.
 *   - `loadMore`: Function to fetch the next page of items.
 *
 * @remarks
 * This hook automatically resets and fetches data when the endpoint,
 * credentials, or limit changes. It handles authentication via HTTP Basic Auth.
 */
export function useFetchItems<T>(endpoint: string, ordering: string, limit = 10) {
  const [state, dispatch] = useReducer(reducer<T>, {
    data: [],
    error: null,
    loading: false,
    offset: 0,
    hasMore: true,
  })

  const loadMore = useCallback(async () => {
    dispatch({ type: 'LOAD_START' })

    try {
      const pagedUrl =
        endpoint +
        '?' +
        [ordering ? `ordering=${ordering}` : null, `limit=${limit}`, `offset=${state.offset}`]
          .filter(Boolean)
          .join('&')
      const response = await api.get(pagedUrl)

      const result = response.data
      dispatch({ type: 'LOAD_SUCCESS', payload: { results: result.results, limit } })
    } catch (err) {
      dispatch({
        type: 'LOAD_ERROR',
        payload: err instanceof Error ? err.message : String(err),
      })
    }
  }, [endpoint, limit, ordering, state.offset])

  useEffect(() => {
    dispatch({ type: 'RESET' })
  }, [endpoint, limit, ordering])

  return {
    data: state.data,
    error: state.error,
    loading: state.loading,
    hasMore: state.hasMore,
    loadMore,
  }
}

/**
 * Triggers callback when the ref element is visible in the viewport.
 * @param ref - React ref to the loader element
 * @param callback - Function to call when the element is visible
 * @param enabled - Should the observer be active
 * @param deps - Dependency array for useEffect
 */
export function useInfiniteScroll(
  ref: React.RefObject<Element | null>,
  callback: () => void,
  enabled: boolean,
  deps: any[] = [],
) {
  useEffect(() => {
    if (!enabled) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          callback()
        }
      },
      { threshold: 1 },
    )

    const current = ref.current
    if (current) {
      observer.observe(current)
    }

    return () => {
      if (current) {
        observer.unobserve(current)
      }
      observer.disconnect()
    }
  }, [ref, callback, enabled, ...deps])
}

type SingleState<T> = {
  data: T | null
  error: string | null
  loading: boolean
}

type SingleAction<T> =
  | { type: 'LOAD_START' }
  | { type: 'LOAD_SUCCESS'; payload: T }
  | { type: 'LOAD_ERROR'; payload: string }
  | { type: 'RESET' }

function singleReducer<T>(state: SingleState<T>, action: SingleAction<T>): SingleState<T> {
  switch (action.type) {
    case 'LOAD_START':
      return { ...state, loading: true }
    case 'LOAD_SUCCESS':
      return { data: action.payload, loading: false, error: null }
    case 'LOAD_ERROR':
      return { ...state, loading: false, error: action.payload }
    case 'RESET':
      return { data: null, error: null, loading: false }
    default:
      return state
  }
}

/**
 * Custom React hook for fetching a single item by ID.
 *
 * @template T The type of the item being fetched.
 * @param endpoint - The API endpoint to fetch data from (should include the ID).
 * @param username - Optional username for basic authentication.
 * @param password - Optional password for basic authentication.
 * @returns An object containing:
 *   - `data`: The fetched item or null.
 *   - `error`: Any error message encountered during fetching.
 *   - `loading`: Whether a fetch operation is in progress.
 */
export function useFetchItem<T>(endpoint: string, username?: string, password?: string) {
  const [state, dispatch] = useReducer(singleReducer<T>, {
    data: null,
    error: null,
    loading: false,
  })

  useEffect(() => {
    if (!endpoint) return
    dispatch({ type: 'LOAD_START' })
    const fetchData = async () => {
      try {
        const credentials = btoa(`${username}:${password}`) || ''
        const response = await fetch(endpoint, {
          headers: { Authorization: `Basic ${credentials}` },
        })
        if (!response.ok) throw new Error(`Failed to fetch: ${response.statusText}`)
        const result = await response.json()
        dispatch({ type: 'LOAD_SUCCESS', payload: result })
      } catch (err) {
        dispatch({
          type: 'LOAD_ERROR',
          payload: err instanceof Error ? err.message : String(err),
        })
      }
    }
    fetchData()
    // Optionally reset on endpoint change
    return () => dispatch({ type: 'RESET' })
  }, [endpoint, username, password])

  return {
    data: state.data,
    error: state.error,
    loading: state.loading,
  }
}
