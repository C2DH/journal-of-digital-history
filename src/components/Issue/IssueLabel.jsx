import React from 'react'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'

const IssueLabel = ({ pid = '', name = '' }) => {
  const { t } = useTranslation()
  const shortName = name.length > 16 ? name.slice(0, 16) + '...' : name
  return (
    <React.Fragment>
      {pid.replace(/jdh0+(\d+)/, (m, n) => t('numbers.issue', { n }))}
      {name.length > 0 ? (
        <>
          &nbsp;&middot;&nbsp;
          {shortName}
        </>
      ) : null}
    </React.Fragment>
  )
}

IssueLabel.propTypes = {
  pid: PropTypes.string,
  name: PropTypes.string,
}

export default IssueLabel
