import './Card.css'

import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { CardProps } from './interface'

import { useInfiniteScroll } from '../../hooks/useFetch'
import Loading from '../Loading/Loading'
import Modal from '../Modal/Modal'
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
}: CardProps) => {
  const { t } = useTranslation()
  const loaderRef = useRef<HTMLDivElement | null>(null)
  const [modal, setModal] = useState<{ open: boolean; action?: string; row?: any }>({ open: false })

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
        <Table
          item={item}
          headers={headers}
          data={data}
          sortBy={sortBy}
          sortOrder={sortOrder}
          setSortBy={setSortBy}
          setSortOrder={setSortOrder}
          setModal={setModal}
        />
        <div ref={loaderRef} />
      </div>
      {loading && data.length > 0 && <Loading />}
      <Modal open={modal.open} onClose={() => setModal({ open: false })} title={modal.action}>
        <div>
          <p>
            Are you sure you want to <b>{modal.action}</b> this item?
          </p>
          <button onClick={() => setModal({ open: false })}>Cancel</button>
          <button
            onClick={() => {
              setModal({ open: false })
            }}
          >
            Confirm
          </button>
        </div>
      </Modal>
    </>
  )
}

export default Card
