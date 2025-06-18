import { useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'

export function useFilters() {
  const [searchParams, setSearchParams] = useSearchParams()

  const sortBy = searchParams.get('sortBy')
  const sortOrder = searchParams.get('sortOrder')

  const setFilters = useCallback((filters: { sortBy?: string; sortOrder?: string }) => {
    setSearchParams((params) => {
      if (filters.sortBy != undefined) {
        params.set('sortBy', filters.sortBy)
      }

      if (filters.sortOrder != undefined) {
        params.set('sortOrder', filters.sortOrder)
      }

      return params
    })
  }, [])

  return {
    sortBy,
    sortOrder,
    setFilters,
  }
}
