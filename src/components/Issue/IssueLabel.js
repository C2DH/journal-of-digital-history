import React from 'react'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'

const IssueLabel = ({ pid = '', name }) => {
  const { t } = useTranslation()
  return (
    <React.Fragment>
      {pid.replace(/jdh0+(\d+)/, (m, n) => t('numbers.issue', { n }))}
      &nbsp;&middot;&nbsp;
      {name}
    </React.Fragment>
  )
}

IssueLabel.propTypes = {
  pid: PropTypes.string,
  name: PropTypes.string,
}

export default IssueLabel
