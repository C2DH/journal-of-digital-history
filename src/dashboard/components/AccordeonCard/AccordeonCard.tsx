import './AccordeonCard.css'

import { ArrowDown, ArrowUp } from 'iconoir-react'
import { useRef } from 'react'
import { useTranslation } from 'react-i18next'

import { AccordeonCardProps } from './interface'

import Collapse from '../../../components/Collapse/Collapse'
import { useInfiniteScroll } from '../../hooks/useFetch'
import Table from '../Table/Table'

const AccordeonCard = ({
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
  collapsable = true,
  collapsed = true,
}: AccordeonCardProps) => {
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
      <div className={`${item} accordeon-card`}>
        <h1 className="accordeon-title">{t(`${item}.item`)}</h1>
        <Collapse
          className="accordeon"
          collapsed={collapsed}
          collapsable={collapsable}
          iconOpen={ArrowDown}
          iconClosed={ArrowUp}
          iconSize={36}
          iconStrokeWidth={2}
        >
          <Table
            item={item}
            headers={headers}
            data={data}
            sortBy={sortBy}
            sortOrder={sortOrder}
            setSortBy={setSortBy}
            setSortOrder={setSortOrder}
          />
          <div ref={loaderRef} />
        </Collapse>
      </div>
    </>
  )
}

export default AccordeonCard
