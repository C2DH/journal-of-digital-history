import create from 'zustand'

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
