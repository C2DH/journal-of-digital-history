import React from 'react'
import { useTranslation } from 'react-i18next'
import Ansi from '@curvenote/ansi-to-react'

const ArticleCellError = ({ idx, errors, hideLabel = false }) => {
  const outputTypeClassName = `ArticleCellOutput_${errors[0].output_type}`
  const { t } = useTranslation()

  console.log('ArticleCellError', errors)

  return (
    <blockquote
      className={`${outputTypeClassName}`}
      style={{ backgroundColor: 'pink', borderLeftColor: 'red' }}
    >
      {hideLabel ? null : (
        <div>
          <div className="label" style={{ color: 'red' }}>
            {t(outputTypeClassName)}
          </div>
        </div>
      )}
      {errors.map((error, j) => (
        <div key={`error-${idx}-${j}`}>
          <div>
            {error.ename} - {error.evalue}
          </div>
          <Ansi useClasses>{error.traceback.join('\n')}</Ansi>
        </div>
      ))}
    </blockquote>
  )
}

export default ArticleCellError
