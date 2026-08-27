import './Card.css'

import { useRef } from 'react'
import { useTranslation } from 'react-i18next'

import { CardProps } from './interface'

import { useInfiniteScroll } from '../../hooks/useInfiniteScroll'
import { useActionStore, useFilterBarStore } from '../../store'
import { isAbstract, isArticle } from '../../utils/helpers/checkItem'
import ScrollButton from '../Buttons/ScrollButton/ScrollButton'
import Feedback from '../Feedback/Feedback'
import Modal from '../Modal/Modal'
import Table from '../Table/Table'

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
  const isFilterOpen = useFilterBarStore((state) => state.isFilterOpen)
  const { modal, setModal, closeModal } = useActionStore()
  const isAbstractItem = isAbstract(item)
  const isArticleItem = isArticle(item)
  const isArticleOrAbstracts = isAbstractItem || isArticleItem

  useInfiniteScroll(
    loaderRef,
    loadMore ?? (() => {}),
    hasMore && !loading,
    [hasMore, loading, loadMore],
    1000,
  )

  if (error) {
    return <Feedback type="error" message={error} />
  }

  return (
    <>
      <div className={`${item} card ${isFilterOpen && isArticleOrAbstracts ? 'with-filter' : ''}`}>
        <div className="card-header">
          <div className="card-header-title">
            {!isArticleOrAbstracts && <h1>{t(`${item}.item`)}</h1>}
          </div>
        </div>
        {count === 0 && !loading ? (
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
              setRowModal={setModal}
            />

            {/* The sentinel wraps your button so it has real dimensions */}
            {hasMore && (
              <div ref={loaderRef} className="scroll-sentinel" data-testid="scroll-sentinel">
                <ScrollButton />
              </div>
            )}
          </>
        )}
      </div>
      <Modal
        item={item}
        open={modal.open}
        onClose={closeModal}
        action={modal.action}
        data={modal}
      />
    </>
  )
}

export default Card
