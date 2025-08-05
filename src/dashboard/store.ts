import create from 'zustand'

import api from './utils/helpers/setApiHeaders'

// SEARCH STORE
/**
 * useSearchStore
 * Zustand store for managing search state and actions.
 * - query: current search string
 * - results: array of search results
 * - loading: search loading state
 * - error: search error state
 * - setQuery, setResults, setLoading, setError: actions to update state
 */

type SearchState = {
  query: string
  results: any[]
  loading: boolean
  error: any
  setQuery: (query: string) => void
  setResults: (results: any[]) => void
  setLoading: (loading: boolean) => void
  setError: (error: any) => void
}

export const useSearchStore = create<SearchState>((set) => ({
  query: '',
  results: [],
  loading: false,
  error: null,
  setQuery: (query: string) => set({ query }),
  setResults: (results: any[]) => set({ results }),
  setLoading: (loading: boolean) => set({ loading }),
  setError: (error: any) => set({ error }),
}))

// ITEMS FETCHING STORE
/**
 * useItemsStore
 * Zustand store for managing paginated list data (e.g. articles, abstracts).
 * - count: total items
 * - data: array of items
 * - error: error state
 * - loading: loading state
 * - offset: pagination offset
 * - hasMore: if more items can be loaded
 * - endpoint, limit, ordering, search: API params
 * - fetchItems: fetches items (reset for first page)
 * - setParams: updates API params
 * - reset: resets store state
 * - loadMore: fetches next page
 */
type ItemsState<T> = {
  count: number
  data: T[]
  error: string | null
  loading: boolean
  offset: number
  hasMore: boolean
  endpoint: string
  limit: number
  ordering?: string
  search?: string
  fetchItems: (reset?: boolean) => Promise<void>
  setParams: (params: {
    ordering?: string | undefined
    endpoint?: string | undefined
    limit?: number | undefined
    search?: string | undefined
  }) => void
  reset: () => void
  loadMore: () => Promise<void>
}

type ItemState<T> = {
  data: T | null
  loading: boolean
  error: string | null
}

export const useItemsStore = create<ItemsState<any>>((set, get) => ({
  count: 0,
  data: [],
  error: null,
  loading: false,
  offset: 0,
  hasMore: true,
  endpoint: '',
  limit: 10,
  ordering: undefined,
  search: undefined,

  fetchItems: async (reset = false) => {
    const { endpoint, limit, ordering, search, offset, data } = get()
    if (!endpoint) return

    set({ loading: true, error: null })

    let finalOrdering = ordering
    if (ordering === 'callpaper_title') {
      finalOrdering = 'callpaper__title'
    }

    try {
      const pagedUrl =
        `/api/${endpoint}/` +
        '?' +
        [
          search ? `search=${search}` : '',
          ordering ? `ordering=${finalOrdering}` : null,
          `limit=${limit}`,
          `offset=${reset ? 0 : offset}`,
        ]
          .filter(Boolean)
          .join('&')
      const response = await api.get(pagedUrl)
      const result = response.data

      set({
        count: result.count,
        data: reset ? result.results : [...data, ...result.results],
        offset: (reset ? 0 : offset) + limit,
        hasMore: result.results.length === limit,
        loading: false,
        error: null,
      })
    } catch (err: any) {
      set({
        loading: false,
        error: err instanceof Error ? err.message : String(err),
        hasMore: false,
      })
    }
  },
  setParams: (params) =>
    set((state) => ({
      endpoint: params.endpoint !== undefined ? params.endpoint : state.endpoint,
      limit: params.limit !== undefined ? params.limit : state.limit,
      ordering: params.ordering !== undefined ? params.ordering : state.ordering,
      search: params.search !== undefined ? params.search : state.search,
    })),
  reset: () =>
    set({
      count: 0,
      data: [],
      error: null,
      loading: false,
      offset: 0,
      hasMore: true,
    }),
  loadMore: async () => {
    const { fetchItems, loading, hasMore } = get()
    if (loading || !hasMore) return
    await fetchItems()
  },
}))

export const useItemStore = create<ItemState<any>>((set, get) => ({
  data: null,
  loading: false,
  error: null,

  fetchItem: async (id: string, endpoint: string) => {
    if (!id || !endpoint) throw new Error('ID and endpoint are required to fetch an item')
    set({ loading: true, error: null })

    try {
      const pagedUrl = `/api/${endpoint}/${id}`
      const response = await api.get(pagedUrl)

      const result = response.data
      if (!response.status) throw new Error(`Failed to fetch: ${response.statusText}`)

      set({ data: result, loading: false, error: null })
    } catch (err) {
      set({
        loading: false,
        error: err instanceof Error ? err.message : String(err),
      })
    }
  },
  reset: () => set({ data: null, loading: false, error: null }),
}))
