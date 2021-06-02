import React from 'react'
import { useTranslation } from 'react-i18next'

const ArticleFigure = ({ figure, children }) => {
  const { t } = useTranslation()
  // figure number, for translation label.
  const n = figure.ref ? figure.ref.split('-').pop() : figure.num
  return (
    <figcaption className="ArticleFigure position-relative">
      <div className="ArticleFigure_figcaption_num">
        <div className="mr-2">{t('numbers.figure', { n })}</div>
      </div>
      {children}
    </figcaption>
  )
}

export default ArticleFigure
