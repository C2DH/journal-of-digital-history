import { useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'

export function useSorting() {
  const [searchParams, setSearchParams] = useSearchParams()

  const sortBy = searchParams.get('sortBy')
  const sortOrder = searchParams.get('sortOrder')

  const setFilters = useCallback(
    (filters: { sortBy?: string; sortOrder?: string }) => {
      setSearchParams((prevParams) => {
        const params = new URLSearchParams(prevParams)
        if (filters.sortBy !== undefined) {
          params.set('sortBy', filters.sortBy)
        }
        if (filters.sortOrder !== undefined) {
          params.set('sortOrder', filters.sortOrder)
        }
        return params
      })
    },
    [setSearchParams],
  )

  const ordering =
    sortBy == null ? `BLABLA` : sortOrder === 'asc' || !sortOrder ? sortBy : `-${sortBy}`

  return {
    sortBy,
    sortOrder,
    ordering,
    setFilters,
  }
}
