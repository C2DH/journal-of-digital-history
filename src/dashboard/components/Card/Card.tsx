import './Card.css'

import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { CardProps } from './interface'

import { useInfiniteScroll } from '../../hooks/useInfiniteScroll'
import { useItemsStore } from '../../store'
import { retrieveContactEmail } from '../../utils/helpers/retrieveContactEmail'
import api from '../../utils/helpers/setApiHeaders'
import { ModalInfo } from '../../utils/types'
import ActionButtonLarge from '../Buttons/ActionButton/Large/ActionButtonLarge'
import Counter from '../Counter/Counter'
import Feedback from '../Feedback/Feedback'
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

  const handleChangeStatus = (action: string, ids: string[]) => {
    api.post(`/api/dashboard/change-status/${item}/${ids}/`, { action })
  }

  useInfiniteScroll(loaderRef, loadMore, hasMore && !loading, [hasMore, loading, loadMore])
  useEffect(() => {
    if (rowData.open && rowData.id) {
      retrieveContactEmail(rowData.id, data, setEmail)
    }
  }, [rowData.open])

  if (error) {
    return <Feedback type="error" message={error} />
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
            <Counter value={count === undefined ? 0 : count} />
          </div>
          <ActionButtonLarge
            actions={[{ label: t('actions.change'), onClick: () => fetchItems(true) }]}
            active={true}
          />
        </div>
        {count === 0 ? (
          <Feedback type="warning" message={'No item corresponds to your search'} />
        ) : (
          <>
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
            <Modal
              open={rowData.open}
              onClose={handleClose}
              action={rowData.action || ''}
              rowData={rowData}
              onNotify={handleNotify}
            />
          </>
        )}
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
