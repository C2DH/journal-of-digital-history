import { useTranslation } from 'react-i18next'
import Table from '../Table/Table'

import './Card.css'

const Card = ({ item, headers, data }) => {
  const {t} = useTranslation()

  return (
    <div className="card">
      {' '}
      <h1>{t(`${item}.title`)}</h1>
      <Table title={item} headers={headers} data={data} />
    </div>
  )
}

export default Card
