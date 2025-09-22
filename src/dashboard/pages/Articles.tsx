import '../styles/pages/pages.css'

import { useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router-dom'

import Card from '../components/Card/Card'
import Counter from '../components/Counter/Counter'
import FilterBar from '../components/FilterBar/FilterBar'
import { useSorting } from '../hooks/useSorting'
import { useFilterBarStore, useItemsStore, useSearchStore } from '../store'

const Articles = () => {
  const { t } = useTranslation()
  const [searchParams, setSearchParams] = useSearchParams()
  const { sortBy, sortOrder, ordering, setFilters } = useSorting()
  const query = useSearchStore((state) => state.query)
  const {
    count,
    data: articles,
    loading,
    error,
    hasMore,
    fetchItems,
    setParams,
    loadMore,
  } = useItemsStore()
  const { initFilters, updateFromStores, changeFilters } = useFilterBarStore()
  const filterConfig = useFilterBarStore((state) => state.filters)

  useEffect(() => {
    if (!filters || filters.length === 0) {
      initFilters()
    }
    updateFromStores(false)
  }, [])
  // Reset to first page when filters, search or sorting

  const filters = useMemo(() => {
    return filterConfig.map((filter) => {
      const paramValue = searchParams.get(filter.name) || ''
      return {
        ...filter,
        value: paramValue,
      }
    })
  }, [filterConfig, searchParams])

  useEffect(() => {
    const params = filters.reduce((acc, filter) => {
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
    setParams({ endpoint: 'articles', limit: 20, ordering, search: query, params })
    fetchItems(true)
  }, [setParams, fetchItems, ordering, query, filters])

  return (
    <div className="articles page">
      <div className="card-header-title">
        <h1>{t(`articles.item`)}</h1>
        {count && <Counter value={count} />}
      </div>
      <FilterBar filters={filters} onFilterChange={changeFilters} />
      <Card
        item="articles"
        headers={[
          'abstract__pid',
          'abstract__title',
          'publication_date',
          'abstract__contact_lastname',
          'abstract__contact_firstname',
          'status',
          'repository_url',
        ]}
        count={count}
        data={articles}
        error={error}
        loading={loading}
        hasMore={hasMore}
        loadMore={loadMore}
        sortBy={sortBy || undefined}
        sortOrder={sortOrder || undefined}
        setSort={({ sortOrder, sortBy }) => setFilters({ sortOrder, sortBy })}
      />
    </div>
  )
}

export default Articles
