import React from 'react'
import { useArticleStore } from '../../store'

const ArticleCellAccordionAnchors = ({ cells, cellsIndices, anchorPrefix }) => {
  const visibleShadowCellsIdx = useArticleStore(state=>state.visibleShadowCellsIdx)
  const isVisible = cellsIndices.some((d) => visibleShadowCellsIdx.indexOf(cells[d].idx) !== -1)

  if (isVisible) {
    return null
  }
  return (
    <div className="position-relative">
      {cellsIndices.map((d,i) => <a key={i} id={`${anchorPrefix}${cells[d].idx}`} className="anchor" />)}
    </div>
  )
}

export default ArticleCellAccordionAnchors
