import React from 'react'
import { useTranslation } from 'react-i18next'

const Issue = ({ item }) => {
  const { t } = useTranslation()
  return (
    <>
    <span>{item.pid.replace(/jdh0+(\d+)/, (m,n) => t('numbers.issue', {n}))}</span> &middot; <b>{new Date(item.publication_date).getFullYear()}</b>
    <h2 >{item.name}</h2>
    {item.description ? (
      <h3><span className="text-muted">{item.pid}</span>&nbsp;{item.description}</h3>
    ):null}
    </>
  )
}

export default Issue
