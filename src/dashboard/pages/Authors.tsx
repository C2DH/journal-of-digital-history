import '../styles/pages/Authors.css'
import '../styles/pages/pages.css'

import { PieChart } from '@mui/x-charts/PieChart'
import { useSuspenseQuery } from '@tanstack/react-query'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'

import Card from '../components/Card/Card'
import SmallCard from '../components/SmallCard/SmallCard'
import { useSorting } from '../hooks/useSorting'
import { useItemsStore } from '../store'
import { colorsPieChart } from '../styles/theme'
import { getAuthorStats } from '../utils/api/api'

const Authors = () => {
  const { t } = useTranslation()
  const { sortBy, sortOrder, ordering, setFilters } = useSorting()
  const {
    data: authors,
    loading,
    error,
    hasMore,
    fetchItems,
    setParams,
    loadMore,
  } = useItemsStore()

  useEffect(() => {
    setParams({ endpoint: 'authors', limit: 20, ordering })
    fetchItems(true)
  }, [ordering])

  const { data } = useSuspenseQuery({
    queryKey: ['authorData'],
    queryFn: getAuthorStats,
  })

  return (
    <div className="authors page">
      <Card
        item="authors"
        headers={['lastname', 'firstname', 'abstracts', 'accepted', 'published']}
        data={authors}
        error={error}
        loading={loading}
        hasMore={hasMore}
        loadMore={loadMore}
        sortBy={sortBy ?? undefined}
        sortOrder={sortOrder ?? undefined}
        setSort={({ sortOrder, sortBy }) => setFilters({ sortOrder, sortBy })}
      />
      <SmallCard className="authors piechart chart">
        <h3>{t('authors.KPI.pieChart')}</h3>
        <PieChart
          series={[
            {
              innerRadius: 50,
              outerRadius: 100,
              data: data['first-time_vs_returning'],
              highlightScope: { fade: 'global', highlight: 'item' },
              arcLabel: (item) => (item.value != 0 ? `${item.value}` : ''),
            },
          ]}
          colors={colorsPieChart}
          width={200}
          height={200}
          slotProps={{
            legend: {
              direction: 'horizontal',
              position: {
                vertical: 'bottom',
                horizontal: 'center',
              },
              sx: {
                fontSize: 16,
                fontFamily: 'DM Sans, sans-serif',
                color: 'var(--color-deep-blue)',
              },
            },
          }}
          sx={{
            '.MuiChartsLegend-root': {
              marginTop: '40px',
              width: { xs: '100%', lg: '70%', xl: '200px' },
            },
            '.MuiPieChart-arcLabel': {
              fill: 'white',
              fontWeight: 600,
              fontSize: 14,
              fontFamily: 'DM Sans, sans-serif',
            },
          }}
        />
      </SmallCard>
    </div>
  )
}

export default Authors
