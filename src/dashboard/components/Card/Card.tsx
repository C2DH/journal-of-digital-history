import './Card.css'

import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { CardProps } from './interface'

import { useInfiniteScroll } from '../../hooks/useInfiniteScroll'
import { useItemsStore } from '../../store'
import { retrieveContactEmail } from '../../utils/helpers/retrieveContactEmail'
import { ModalInfo } from '../../utils/types'
import Counter from '../Counter/Counter'
import Loading from '../Loading/Loading'
import Modal from '../Modal/Modal'
import Table from '../Table/Table'
import Toast from '../Toast/Toast'

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
  const [notification, setNotification] = useState<{
    type: 'success' | 'error'
    message: string
    submessage?: string
  } | null>(null)

  const { fetchItems } = useItemsStore()

  const handleClose = () => setRowData({ open: false })
  const handleNotify = (notif) => {
    fetchItems(true)
    setNotification(notif)
  }
  const setEmail = (email: string) => {
    setRowData((prev) => ({ ...prev, contactEmail: email }))
  }

  useInfiniteScroll(loaderRef, loadMore, hasMore && !loading, [hasMore, loading, loadMore])
  useEffect(() => {
    if (rowData.open && rowData.id) {
      retrieveContactEmail(rowData.id, data, setEmail)
    }
  }, [rowData.open])

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
      <Toast
        open={!!notification}
        message={notification?.message || ''}
        submessage={notification?.submessage || ''}
        type={notification?.type}
        onClose={() => setNotification(null)}
      />
      <div className={`${item} card`}>
        <div className="card-header">
          <div className="card-header-title">
            <h1>{t(`${item}.item`)}</h1>
            <div>{count ? <Counter value={count} /> : ''}</div>
          </div>
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
        {loading && data.length > 0 && <Loading />}
        <div ref={loaderRef} />
      </div>

      <Modal
        open={rowData.open}
        onClose={handleClose}
        action={rowData.action || ''}
        rowData={rowData}
        onNotify={handleNotify}
      />
    </>
  )
}

export default Card
