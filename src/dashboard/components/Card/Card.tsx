import './Card.css'

import { useRef } from 'react'
import { useTranslation } from 'react-i18next'

import { useInfiniteScroll } from '../../hooks/useFetch'
import Loading from '../Loading/Loading'
import ProgressionTable from '../ProgressionTable/ProgressionTable'
import Table from '../Table/Table'

const Card = ({
  item,
  headers,
  data,
  error,
  loading,
  hasMore,
  loadMore,
  sortBy,
  sortOrder,
  setSortBy,
  setSortOrder,
}) => {
  const { t } = useTranslation()
  const loaderRef = useRef<HTMLDivElement | null>(null)

  useInfiniteScroll(loaderRef, loadMore, hasMore && !loading, [hasMore, loading, loadMore])

  if (error) {
    return (
      <div className="card card-error">
        <h1>{t('error.title', 'Error')}</h1>
        <p>{error?.response}</p>
      </div>
    )
  }

  return (
    <>
      <div className={`${item} card`}>
        <h1>{t(`${item}.item`)}</h1>
        {item === 'articles' ? (
          <ProgressionTable
            title={item}
            headers={headers}
            data={data}
            sortBy={sortBy}
            sortOrder={sortOrder}
            setSortBy={setSortBy}
            setSortOrder={setSortOrder}
          />
        ) : (
          <Table
            title={item}
            headers={headers}
            data={data}
            sortBy={sortBy}
            sortOrder={sortOrder}
            setSortBy={setSortBy}
            setSortOrder={setSortOrder}
          />
        )}
        <div ref={loaderRef} />
      </div>
      {loading && data.length > 0 && <Loading />}
    </>
  )
}

export default Card
