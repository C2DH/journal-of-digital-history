import React from 'react'
import { useTranslation } from 'react-i18next'

const ArticleFigure = ({ figure, children }) => {
  const { t } = useTranslation()
  // figure number, for translation label.
  return (
    <figcaption className="ArticleFigure position-relative">
      <pre>{JSON.stringify(figure, null, 2)}</pre>
      <div className="ArticleFigure_figcaption_num">
        {figure.ref ? (
          <a href={`#${figure.idx}`} className="mr-2">
            {t(figure.tNLabel, { n: figure.tNum })}
          </a>
        ) : (
          <div className="mr-2">{t(figure.tNLabel, { n: figure.tNum })}</div>
        )}
      </div>
      {children}
    </figcaption>
  )
}

export default ArticleFigure
