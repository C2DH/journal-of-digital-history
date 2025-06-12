import { useState } from 'react'

import Card from '../components/Card/Card'
import { useFetchItems } from '../hooks/useFetch'
import { Abstract } from '../utils/types'
import '../styles/pages/pages.css'

const Abstracts = () => {
  const [sortBy, setSortBy] = useState<string>('id') // default sort field
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')
  const ordering = sortOrder === 'asc' ? sortBy : `-${sortBy}`

  const {
    data: abstracts,
    error,
    loading,
    hasMore,
    loadMore,
  } = useFetchItems<Abstract>('abstracts', ordering, 10)

  return (
    <div className="abstract page">
      <Card
        item="abstracts"
        headers={[
          'pid',
          'title',
          'callpaper',
          'submitted_date',
          'contact_lastname',
          'contact_firstname',
          'contact_affiliation',
          'status',
        ]}
        data={abstracts}
        error={error}
        loading={loading}
        hasMore={hasMore}
        loadMore={loadMore}
        sortBy={sortBy}
        sortOrder={sortOrder}
        setSortBy={setSortBy}
        setSortOrder={setSortOrder}
      />
    </div>
  )
}

export default Abstracts
