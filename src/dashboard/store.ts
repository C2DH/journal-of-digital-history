import create from 'zustand'

import api from './utils/api/headers'
import { abstractStatus } from './utils/constants/abstract'
import { articleStatus } from './utils/constants/article'
import {
  CallForPapersState,
  Filter,
  FilterBarState,
  FormState,
  IssuesState,
  ItemsState,
  ItemState,
  NotificationState,
  SearchState,
  SetSearchParams,
} from './utils/types'

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
export const useItemStore = create<ItemState<any>>((set) => ({
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
      const response = await api.get('/api/callforpaper?ordering=-id')
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
  fetchIssues: async (revert: boolean) => {
    try {
      const response = await api.get(`/api/issues?ordering=${revert ? '-' : ''}pid`)
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
/**
 * useFilterBarStore
 * Zustand store for filtering articles or abstracts.
 * - filters: array of filters objects
 * - initFilters: initializes filters with default values
 * - syncFiltersWithURL: synchronize the filters with the url query parameters
 * - changeQueryParams: change the params according to the filters
 * - changeFilters: change the filters according to the url query parameters
 * - updateFromStores: fetches call for papers and issues to populate filter options
 * - resetFilters: reset all filters
 * - resetSpecificFilters : reset a specific filter
 */
export const useFilterBarStore = create<FilterBarState>((set, get) => ({
  filters: [],
  initFilters: () => {
    const newFilters = [
      {
        name: 'callpaper',
        label: 'Call for Paper',
        value: '',
        options: [{ key: 0, value: '', label: '-' }],
      },
      {
        name: 'issue',
        label: 'Issue',
        value: '',
        options: [{ key: 0, value: '', label: '-' }],
      },
      {
        name: 'status',
        label: 'Status',
        value: '',
        options: [{ key: 0, value: '', label: '-' }],
      },
    ]
    set({
      filters: newFilters,
    })
    return newFilters
  },
  syncFiltersWithURL: (searchParam: URLSearchParams) => {
    let currentFilters = get().filters

    if (!currentFilters || currentFilters.length === 0) {
      currentFilters = get().initFilters()
    }

    const updatedFilters = currentFilters.map((filter) => ({
      ...filter,
      value: searchParam.get(filter.name) || '',
    }))

    set({ filters: updatedFilters })
  },
  changeQueryParams: (isAbstract: boolean) => {
    const filters = get().filters
    let params
    if (isAbstract) {
      params = filters.reduce((acc, filter) => {
        if (filter.value) {
          if (filter.name === 'issue') {
            //exception for sorting on 'issues' it should call 'article__issue'
            acc['article__issue'] = filter.value.replace(/^jdh0+/, '')
          } else {
            acc[filter.name] = filter.value
          }
        }
        return acc
      }, {})
    } else {
      params = filters.reduce((acc, filter) => {
        if (filter.value) {
          if (filter.name === 'callpaper') {
            //exception for sorting on 'call for paper' it should call 'abstract__callpaper'
            acc['abstract__callpaper'] = filter.value
          } else if (filter.name === 'issue') {
            acc['issue'] = filter.value.replace(/^jdh0+/, '')
          } else {
            acc[filter.name] = filter.value
          }
        }
        return acc
      }, {})
    }
    return params
  },
  changeFilters: (name: string, value: string, searchParams, setSearchParams) => {
    const newParams = new URLSearchParams(searchParams)

    if (value) {
      newParams.set(name, value)
    } else {
      newParams.delete(name)
    }

    setSearchParams(newParams, { replace: true })
  },
  updateFromStores: async (isAbstract: boolean) => {
    await Promise.all([
      useCallForPapersStore.getState().fetchCallForPapers(),
      useIssuesStore.getState().fetchIssues(true),
    ])
    const { data: callForPapers } = useCallForPapersStore.getState()
    const { data: issues } = useIssuesStore.getState()

    set((state) => ({
      filters: state.filters.map((filter) => {
        if (filter.name === 'callpaper') {
          return {
            ...filter,
            options: [
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
              ...issues.map((issue) => ({
                key: issue.id,
                value: String(issue.pid),
                label: String(issue.pid + ' ' + issue.name),
              })),
            ],
          }
        }
        if (filter.name === 'status') {
          return {
            ...filter,
            options: isAbstract ? abstractStatus : articleStatus,
          }
        }
        return filter
      }),
    }))
  },
  resetFilters: (
    searchParams: URLSearchParams,
    setSearchParams: SetSearchParams,
    filterConfig: Filter[],
  ) => {
    const newParams = new URLSearchParams(searchParams)
    filterConfig.forEach((filter) => newParams.delete(filter.name))
    setSearchParams(newParams, { replace: true })
  },
  resetSpecificFilter: (
    searchParams: URLSearchParams,
    setSearchParams: SetSearchParams,
    name: string,
  ) => {
    const newParams = new URLSearchParams(searchParams)
    newParams.delete(name)
    setSearchParams(newParams, { replace: true })
  },
}))

// FORM MODAL STORE
/**
 * useFormStore
 * Zustand store for managing form modal state.
 * - isModalOpen: if the modal is open
 * - formData: data for the form
 * - setFormData: updates form data
 * - openModal: action to open the modal
 * - closeModal: action to close the modal
 */
export const useFormStore = create<FormState>((set) => ({
  isModalOpen: false,
  formData: {},
  setFormData: (data: any) => set({ formData: data }),
  openModal: () => set({ isModalOpen: true }),
  closeModal: () => set({ isModalOpen: false }),
}))

//NOTIFICATION STORE
/**
 * useNotificationStore
 * Zustand store for managing notification state.
 * - isVisible: if the notification should be displayed
 * - notification: notification data (type, message, submessage)
 * - setNotification: updates notification data and shows it
 * - clearNotification: clears notification data
 */
export const useNotificationStore = create<NotificationState>((set) => ({
  isVisible: false,
  notification: { type: 'info', message: '', submessage: '' },
  setNotification: (notification) => {
    set({ notification, isVisible: true })
    setTimeout(() => set({ isVisible: false }), 5000)
  },
  clearNotification: () => set({ notification: { type: 'info', message: '', submessage: '' } }),
}))
