import './Card.css'

import { useTranslation } from 'react-i18next'

import ProgressionTable from '../ProgressionTable/ProgressionTable'
import Table from '../Table/Table'

import './Card.css'

const Card = ({ item, headers, data, error, loading }) => {
  const { t } = useTranslation()

  if (loading) {
    return (
      <div className="card card-loading">
        <div className="progress-bar">
          <div className="progress-bar-inner" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="card card-error">
        <h1>{t('error.title', 'Error')}</h1>
        <p>{error}</p>
        <p>{error.response}</p>
      </div>
    )
  }

  return (
    <div className="card">
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
