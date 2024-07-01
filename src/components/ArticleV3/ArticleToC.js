import React from 'react'
import { useTranslation } from 'react-i18next'

// this is a refactoring of v2 ToC when the layut is flattened down.
const ArticleToC = ({ width = 100, height = 100 }) => {
  const { t } = useTranslation()
  return (
    <aside>
      {t('hello')} - {width} {height}
    </aside>
  )
}

export default React.memo(ArticleToC, (prevProps, nextProps) => {
  if (prevProps.width !== nextProps.width) {
    return false
  }
  return prevProps.memoid === nextProps.memoid
})
