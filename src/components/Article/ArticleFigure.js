import React from 'react'
import { useTranslation } from 'react-i18next'
import { DisplayLayerCellIdxQueryParam } from '../../constants'
import { useQueryParam, NumberParam } from 'use-query-params'
import './ArticleFigure.scss'
const ArticleFigure = ({ figure, children }) => {
  const { t } = useTranslation()
  const [, set] = useQueryParam(DisplayLayerCellIdxQueryParam, NumberParam)
  // figure number, for translation label.
  return (
    <figcaption className="ArticleFigure position-relative">
      <div className="ArticleFigure__figcaption_num">
        {figure.ref ? (
          <button onClick={() => set(figure.idx)} className="btn btn-link mr-2">
            {t(figure.tNLabel, { n: figure.tNum })}
          </button>
        ) : (
          <div className="mr-2">{t(figure.tNLabel, { n: figure.tNum })}</div>
        )}
      </div>
      {children}
    </figcaption>
  )
}

export default ArticleFigure
