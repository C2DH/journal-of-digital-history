import React from 'react'
import { useTranslation } from 'react-i18next'
import ErrorContent from './ErrorContent'

const ArticleCellError = ({ idx, errors, hideLabel = false }) => {
  const outputTypeClassName = `ArticleCellOutput_${errors[0].output_type}`
  const { t } = useTranslation()

  return (
    <blockquote
      className={`${outputTypeClassName}`}
      style={{ width: '100%', whiteSpace: 'break-spaces' }}
    >
      {hideLabel ? null : (
        <div>
          <div className="label" style={{ color: 'tomato' }}>
            {t(outputTypeClassName)}
          </div>
        </div>
      )}
      <ErrorContent errors={errors} idx={idx} />
    </blockquote>
  )
}

export default ArticleCellError
