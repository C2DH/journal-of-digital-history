import './Card.css'

import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { CardProps } from './interface'

import { useInfiniteScroll } from '../../hooks/useFetch'
import { useSearchStore } from '../../store'
import { Abstract, ModalInfo } from '../../utils/types'
import Loading from '../Loading/Loading'
import Modal from '../Modal/Modal'
import Search from '../Search/Search'
import Table from '../Table/Table'

function retrieveContactEmail(
  id: string = '',
  data: Abstract[],
  setEmail: (email: string) => void,
) {
  data.forEach((row) => {
    if (row.pid === id) {
      setEmail(row.contact_email)
    }
  })
}

const Card = ({
  item,
  headers,
  count,
  data,
  error,
  loading,
  hasMore,
  loadMore,
  sortBy,
  sortOrder,
  setSortBy,
  setSortOrder,
}: CardProps) => {
  const { t } = useTranslation()
  const loaderRef = useRef<HTMLDivElement | null>(null)
  const [rowData, setRowData] = useState<ModalInfo>({ open: false })

  const setSearch = useSearchStore((state) => state.setQuery)

  useInfiniteScroll(loaderRef, loadMore, hasMore && !loading, [hasMore, loading, loadMore])

  useEffect(() => {
    if (rowData.open && rowData.id) {
      retrieveContactEmail(rowData.id, data, (email: string) => {
        setRowData((prev) => ({ ...prev, contactEmail: email }))
      })
    }
  }, [rowData.open, rowData.id, data])

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
        <div className="card-header">
          <div className="card-header-title">
            <h1>{t(`${item}.item`)}</h1>
            <div>{count ? `${count} ${item}` : ''}</div>
          </div>
          <Search
            onSearch={setSearch}
            activeRoutes={['/abstracts', '/articles']}
            placeholder={t('search.placeholder')}
          />
        </div>
        <Table
          item={item}
          headers={headers}
          data={data}
          sortBy={sortBy}
          sortOrder={sortOrder}
          setSortBy={setSortBy}
          setSortOrder={setSortOrder}
          setModal={setRowData}
        />
        <div ref={loaderRef} />
      </div>
      {loading && data.length > 0 && <Loading />}
      <Modal
        open={rowData.open}
        onClose={() => setRowData({ open: false })}
        action={rowData.action || ''}
        rowData={rowData}
      />
    </>
  )
}

export default Card
