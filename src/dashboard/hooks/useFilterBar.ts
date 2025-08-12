import { useEffect, useState } from 'react'

import { useCallForPapersStore, useIssuesStore } from '../store'
import { abstractStatus } from '../utils/constants/abstract'
import { articleStatus } from '../utils/constants/article'

export function useFilterBar(isAbstract: boolean) {
  const { data: callForPapers, fetchCallForPapers } = useCallForPapersStore()
  const { data: issues, fetchIssues } = useIssuesStore()

  const [filters, setFilters] = useState([
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
  ])

  useEffect(() => {
    fetchCallForPapers()
    fetchIssues()
  }, [fetchCallForPapers])

  useEffect(() => {
    setFilters((prev) =>
      prev.map((filter) =>
        filter.name === 'callpaper'
          ? {
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
          : filter.name === 'issue'
          ? {
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
          : filter,
      ),
    )
  }, [callForPapers, issues])

  // Optionally, provide a handler for filter changes
  const handleFilterChange = (name, newValue) => {
    setFilters((prev) => prev.map((f) => (f.name === name ? { ...f, value: newValue } : f)))
  }

  return { filters, handleFilterChange }
}
