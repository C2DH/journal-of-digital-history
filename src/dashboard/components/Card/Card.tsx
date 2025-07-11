import './Card.css'

import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { CardProps } from './interface'

import { useInfiniteScroll } from '../../hooks/useFetch'
import { Abstract, ModalInfo } from '../../utils/types'
import Loading from '../Loading/Loading'
import Modal from '../Modal/Modal'
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
  const [modal, setModal] = useState<ModalInfo>({ open: false })
  const [email, setEmail] = useState<string>('')

  useInfiniteScroll(loaderRef, loadMore, hasMore && !loading, [hasMore, loading, loadMore])

  useEffect(() => {
    retrieveContactEmail(modal.id, data, setEmail)
  }, [modal.open])

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
      <Modal
        open={modal.open}
        onClose={() => setModal({ open: false })}
        action={modal.action || ''}
        title={modal.title || ''}
        pid={modal.id}
        contactEmail={email}
      />
    </>
  )
}

export default Card
