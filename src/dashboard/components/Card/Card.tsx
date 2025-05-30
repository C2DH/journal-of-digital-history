import './Card.css'

import { useRef } from 'react'
import { useTranslation } from 'react-i18next'

import { useInfiniteScroll } from '../../hooks/fetchData'
import ProgressionTable from '../ProgressionTable/ProgressionTable'
import Spinner from '../Spinner/Spinner'
import Table from '../Table/Table'

import './Card.css'

const Card = ({ item, headers, data, error, loading, hasMore, loadMore }) => {
  const loaderRef = useRef<HTMLDivElement | null>(null)
  const { t } = useTranslation()

  useInfiniteScroll(loaderRef, loadMore, hasMore && !loading, [hasMore, loading, loadMore])

  if (loading && data.length === 0) {
    return <Spinner />
  }

  if (error) {
    return (
      <div className="card card-error">
        <h1>{t('error.title', 'Error')}</h1>
        <p>{error}</p>
        <p>{error.response}</p>
      </div>
    )
  }

  return (
    <>
      <div className="card">
        <h1>{t(`${item}.item`)}</h1>
        {item === 'articles' ? (
          <ProgressionTable title={item} headers={headers} data={data} />
        ) : (
          <Table title={item} headers={headers} data={data} />
        )}
        <div ref={loaderRef} />
      </div>
      {loading && data.length > 0 && <Spinner />}
    </>
  )
}

export default Card
