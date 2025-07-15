import './AccordeonCard.css'

import { ArrowDown, ArrowUp } from 'iconoir-react'
import { useTranslation } from 'react-i18next'

import { AccordeonCardProps } from './interface'

import Collapse from '../../../components/Collapse/Collapse'
import Table from '../Table/Table'

const AccordeonCard = ({
  title,
  item,
  headers,
  data,
  error,
  collapsable = true,
  collapsed = true,
}: AccordeonCardProps) => {
  const { t } = useTranslation()

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
        <h1 className="accordeon-title">{title}</h1>
        <Collapse
          className="accordeon"
          collapsed={collapsed}
          collapsable={collapsable}
          iconOpen={ArrowDown}
          iconClosed={ArrowUp}
          iconSize={36}
          iconStrokeWidth={2}
        >
          <Table item={item} headers={headers} data={data} />
        </Collapse>
      </div>
    </>
  )
}

export default AccordeonCard
