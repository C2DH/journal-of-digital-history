import React from 'react'
import { useTranslation } from 'react-i18next'
import { useToCStore } from './ArticleCellObserver'

// this is a refactoring of v2 ToC when the layut is flattened down.
const ArticleToC = ({ width = 100, height = 100 }) => {
  const { t } = useTranslation()
  const visibleCellsIdx = useToCStore((store) => store.visibleCellsIdx)
  return (
    <aside
      className="ArticleToC col-4"
      style={{
        position: 'fixed',
        top: 140,
        left: 0,
      }}
    >
      {t('table')} - {width} {height}
      <ul>
        {visibleCellsIdx.map((idx) => (
          <li key={idx}>{idx}</li>
        ))}
      </ul>
    </aside>
  )
}

export default React.memo(ArticleToC, (prevProps, nextProps) => {
  if (prevProps.width !== nextProps.width) {
    return false
  }
  return prevProps.memoid === nextProps.memoid
})
