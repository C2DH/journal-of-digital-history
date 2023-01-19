import React from 'react'
import { useTranslation } from 'react-i18next'

const IssueLabel = ({ pid, publication_date }) => {
  const { t } = useTranslation()
  return (
    <React.Fragment>
      {pid.replace(/jdh0+(\d+)/, (m, n) => t('numbers.issue', { n }))}
      &nbsp;&middot;&nbsp;
      {new Date(publication_date).getFullYear()}
    </React.Fragment>
  )
}

export default IssueLabel
