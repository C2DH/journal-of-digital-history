import React from 'react'
import { useTranslation } from 'react-i18next'

const ArticleFigure = ({ figure, children }) => {
  const { t } = useTranslation()
  // figure number, for translation label.
  return (
    <figcaption className="ArticleFigure position-relative">
      <div className="ArticleFigure_figcaption_num">
        { figure.ref
          ? (
            <a href={`#${figure.ref}`} className="mr-2">
              {t(figure.tNLabel, { n: figure.tNum })}
            </a>
          )
          : (
            <div className="mr-2">
              {t(figure.tNLabel, { n: figure.tNum })}
            </div>
          )
        }
      </div>
      {children}
    </figcaption>
  )
}

export default ArticleFigure
