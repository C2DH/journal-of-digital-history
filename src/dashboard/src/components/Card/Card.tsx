import Table from '../Table/Table'

import './Card.css'

const Card = ({title, headers, data }) => {
  return (
    <div className="card">
      {' '}
      <h1>{title} </h1>
      <Table headers={headers} data={data} />
    </div>
  )
}

export default Card
