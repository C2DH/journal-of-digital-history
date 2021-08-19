import React from 'react'
import { useArticleStore } from '../../store'

const ArticleCellAccordionAnchors = ({ cells, cellsIndices }) => {
  const visibleShadowCellsIdx = useArticleStore(state=>state.visibleShadowCellsIdx)
  const isVisible = cellsIndices.some((d) => visibleShadowCellsIdx.indexOf(cells[d].idx) !== -1)

  if (isVisible) {
    return null
  }
  return (
    <>
      {cellsIndices.map((d,i) => <a key={i} id={`C-${cells[d].idx}`} className="anchor" />)}
    </>
  )
}

export default ArticleCellAccordionAnchors
