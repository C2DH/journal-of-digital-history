import React from 'react'

const Issue = ({ item }) => (
  <>
  {item.pid} &middot; <b>{new Date(item.publication_date).getFullYear()}</b>
  <h1 >{item.name}</h1>
  {item.description ? (
    <h3><span className="text-muted">{item.pid}</span>&nbsp;{item.description}</h3>
  ):null}
  </>
)

export default Issue
