import './Card.css'

import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { CardProps } from './interface'

import { useInfiniteScroll } from '../../hooks/useInfiniteScroll'
import { useItemsStore } from '../../store'
import { isAbstract, isArticle } from '../../utils/helpers/itemChecker'
import { retrieveContactEmail } from '../../utils/helpers/retrieveContactEmail'
import { RowCheckboxMap } from '../../utils/types'
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
  setSort,
}: CardProps) => {
  const { t } = useTranslation()
  const loaderRef = useRef<HTMLDivElement | null>(null)
  const [modalState, setModalState] = useState<{
    open: boolean
    action?: string
    ids?: string[]
    contactEmail?: string
    id?: string
    [key: string]: any
  }>({ open: false })
  const [notification, setNotification] = useState<{
    type: 'success' | 'error'
    message: string
    submessage?: string
  } | null>(null)
  const [checkedRows, setCheckedRows] = useState<RowCheckboxMap>({})
  const isAbstractItem = isAbstract(item)
  const isArticleItem = isArticle(item)
  const isArticleOrAbstracts = isAbstractItem || isArticleItem
  const { fetchItems } = useItemsStore()

  const handleClose = () => setModalState({ open: false })
  const handleNotify = (notif) => {
    fetchItems(true)
    setNotification(notif)
  }
  const setEmail = (email: string) => {
    setModalState((prev) => ({ ...prev, contactEmail: email }))
  }

  const openRowModal = (modal: { open: boolean; action?: string; row?: any; id?: string }) => {
    setModalState(modal)
  }

  const openGeneralModal = (action: string, selectedRows: { pid: string; title: string }[]) => {
    setModalState({ open: true, action, selectedRows })
  }

  const selectedRows = (item: string) =>
    Object.keys(checkedRows)
      .filter((pid) => checkedRows[pid])
      .map((pid) => {
        if (item === 'abstracts') {
          const row = data.find((row) => String(row.pid) === pid)
          return { pid, title: row.title }
        } else if (item === 'articles') {
          const row = data.find((row) => String(row.abstract.pid) === pid)
          return { pid, title: row.data.title[0] }
        } else {
          return { pid, title: '' }
        }
      })

  useInfiniteScroll(loaderRef, loadMore, hasMore && !loading, [hasMore, loading, loadMore])
  useEffect(() => {
    if (modalState.open && modalState.id) {
      retrieveContactEmail(modalState.id, data, setEmail)
    }
  }, [modalState.open, modalState.id])

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
            {!isArticleOrAbstracts && <h1>{t(`${item}.item`)}</h1>}
          </div>

          {/* {isAbstract(item) && (
            <ActionButtonLarge
              actions={[
                {
                  label: t('actions.actions.change'),
                  onClick: () => openGeneralModal('actions.change', selectedRows(item)),
                },
              ]}
              active={checkedRows && Object.values(checkedRows).some((v) => v)}
            />
          )} */}
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
              setSort={setSort}
              setRowModal={openRowModal}
              checkedRows={checkedRows}
              setCheckedRows={setCheckedRows}
            />
            {loading && data.length > 0 && <Loading />}
            <div ref={loaderRef} />
          </>
        )}
      </div>
      <Modal
        item={item}
        open={modalState.open}
        onClose={handleClose}
        action={modalState.action || ''}
        ids={modalState.ids}
        data={modalState}
        onNotify={handleNotify}
      />
    </>
  )
}

export default Card
