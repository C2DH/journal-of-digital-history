import create from 'zustand'

import { abstractStatus } from './utils/constants/abstract'
import { articleStatus } from './utils/constants/article'
import api from './utils/helpers/setApiHeaders'
import { CallForPapersState, IssuesState, ItemsState, ItemState, SearchState } from './utils/types'

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
  params: {},

  fetchItems: async (reset = false) => {
    const { endpoint, limit, ordering, search, offset, data, params } = get()
    if (!endpoint) return

    set({ loading: true, error: null })

    let finalOrdering = ordering
    if (ordering === 'callpaper_title') {
      finalOrdering = 'callpaper__title'
    }

    try {
      const dynamicParams = params
        ? Object.entries(params)
            .filter(([_, v]) => v !== undefined && v !== '')
            .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v as string)}`)
            .join('&')
        : ''

      const pagedUrl =
        `/api/${endpoint}/` +
        '?' +
        [
          search ? `search=${search}` : '',
          ordering ? `ordering=${finalOrdering}` : null,
          `limit=${limit}`,
          `offset=${reset ? 0 : offset}`,
          dynamicParams,
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
  setParams: (params) => {
    set((state) => ({
      endpoint: params.endpoint === undefined ? state.endpoint : params.endpoint,
      limit: params.limit === undefined ? state.limit : params.limit,
      ordering: params.ordering === undefined ? state.ordering : params.ordering,
      search: params.search === undefined ? state.search : params.search,
      params: params.params === undefined ? state.params : params.params,
    }))
  },
  reset: () =>
    set({
      count: 0,
      data: [],
      error: null,
      loading: true,
      offset: 0,
      hasMore: true,
    }),
  loadMore: async () => {
    const { fetchItems, loading, hasMore } = get()
    if (loading || !hasMore) return
    await fetchItems()
  },
}))

// SINGLE ITEM FETCHING STORE
/**
 * useItemStore
 * Zustand store for fetching and storing a single item by id.
 * - data: the fetched item
 * - loading: loading state
 * - error: error state
 * - fetchItem: fetches an item by id and endpoint
 * - reset: resets store state
 */
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

// CALL FOR PAPERS STORE
/**
 * useCallForPapersStore
 * Zustand store for fetching all call for papers.
 * - data: array of call for paper objects
 * - error: error state
 * - fetchCallForPapers: fetches all call for papers
 * - reset: resets store state
 */

export const useCallForPapersStore = create<CallForPapersState>((set) => ({
  data: [],
  error: null,
  fetchCallForPapers: async () => {
    try {
      const response = await api.get('/api/callforpaper/')
      const result = response.data
      set({
        data: result.results || [],
        error: null,
      })
    } catch (err: any) {
      set({
        error: err instanceof Error ? err.message : String(err),
      })
    }
  },
  reset: () => set({ data: [], error: null }),
}))

// ISSUES STORE
/**
 * useIssuesStore
 * Zustand store for fetching all issues.
 * - data: array of issue objects
 * - error: error state
 * - fetchIssues: fetches all issues
 * - reset: resets store state
 */

export const useIssuesStore = create<IssuesState>((set) => ({
  data: [],
  error: null,
  fetchIssues: async () => {
    try {
      const response = await api.get('/api/issues/')
      const result = response.data
      set({
        data: result.results || [],
        error: null,
      })
    } catch (err: any) {
      set({ error: err instanceof Error ? err.message : String(err) })
    }
  },
  reset: () => set({ data: [], error: null }),
}))

// FILTER BAR STORE

type FilterOption = { key: number; value: string; label: string }
type Filter = { name: string; value: string; options: FilterOption[] }

interface FilterBarState {
  filters: Filter[]
  setFilter: (name: string, newValue: string) => void
  resetFilters: () => void
  initFilters: (isAbstract: boolean) => void
  updateFromStores: () => void
}

export const useFilterBarStore = create<FilterBarState>((set, get) => ({
  filters: [],
  initFilters: (isAbstract: boolean) => {
    set({
      filters: [
        {
          name: 'callpaper',
          value: '',
          options: [{ key: 0, value: '', label: 'Call for Paper' }],
        },
        {
          name: 'issue',
          value: '',
          options: [{ key: 0, value: '', label: 'Issue' }],
        },
        {
          name: 'status',
          value: '',
          options: isAbstract ? abstractStatus : articleStatus,
        },
      ],
    })
  },
  setFilter: (name: string, newValue: string) => {
    set((state) => ({
      filters: state.filters.map((f) => (f.name === name ? { ...f, value: newValue } : f)),
    }))
  },
  resetFilters: () => {
    set((state) => ({
      filters: state.filters.map((f) => ({ ...f, value: '' })),
    }))
  },
  updateFromStores: async () => {
    await Promise.all([
      useCallForPapersStore.getState().fetchCallForPapers(),
      useIssuesStore.getState().fetchIssues(),
    ])
    const { data: callForPapers } = useCallForPapersStore.getState()
    const { data: issues } = useIssuesStore.getState()

    set((state) => ({
      filters: state.filters.map((filter) => {
        if (filter.name === 'callpaper') {
          return {
            ...filter,
            options: [
              { key: 0, value: '', label: 'Call for Paper' },
              ...callForPapers.map((cfp) => ({
                key: cfp.id,
                value: String(cfp.id),
                label: cfp.title,
              })),
            ],
          }
        }
        if (filter.name === 'issue') {
          return {
            ...filter,
            options: [
              { key: 0, value: '', label: 'Issue' },
              ...issues.map((issue) => ({
                key: issue.id,
                value: String(issue.pid),
                label: String(issue.pid + ' ' + issue.name),
              })),
            ],
          }
        }
        return filter
      }),
    }))
  },
}))
