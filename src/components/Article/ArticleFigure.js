import React from 'react'
import { useTranslation } from 'react-i18next'

const ArticleFigure = ({ figure, children }) => {
  const { t } = useTranslation()
  // figure number, for translation label.
  const n = figure.ref ? figure.ref.split('-').pop() : figure.num
  return (
    <figcaption className="ArticleFigure position-relative">
      <div className="ArticleFigure_figcaption_num">
        { figure.ref
          ? (
            <a href={`#${figure.ref}`} className="mr-2">
              {t(figure.isTable ? 'numbers.table': 'numbers.figure', { n })}
            </a>
          )
          : (
            <div className="mr-2">
              {t(figure.isTable ? 'numbers.table': 'numbers.figure', { n })}
            </div>
          )
        }
      </div>
      {children}
    </figcaption>
  )
}

export default ArticleFigure
