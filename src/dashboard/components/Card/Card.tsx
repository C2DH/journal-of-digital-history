import './Card.css'

import { useTranslation } from 'react-i18next'

import ProgressionTable from '../ProgressionTable/ProgressionTable'
import Table from '../Table/Table'

const Card = ({ item, headers, data }) => {
  const { t } = useTranslation()

  return (
    <div className="card">
      {' '}
      <h1>{t(`${item}.item`)}</h1>
      {item === 'articles' ? (
        <ProgressionTable title={item} headers={headers} data={data} />
      ) : (
        <Table title={item} headers={headers} data={data} />
      )}
    </div>
  )
}

export default Card
