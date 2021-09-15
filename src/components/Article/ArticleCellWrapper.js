import React, {useEffect } from 'react'
import ArticleCell from './ArticleCell'
import { useOnScreen } from '../../hooks/graphics'

const ArticleCellWrapper = ({ cell, memoid, numCell, onVisibilityChange, isNarrativeStep, ...rest }) => {
  const [{ isIntersecting, intersectionRatio }, ref] = useOnScreen({
    rootMargin: '-20% 0% -25% 0%',
    threshold: [0, 0.25, 0.75, 1]
  })
  useEffect(() => {
    if (typeof onVisibilityChange === 'function') {
      onVisibilityChange({ idx: cell.idx, isIntersecting })
    }
  }, [intersectionRatio])
  return (
    <div
      ref={ref}
      className={`ArticleCellWrapper ArticleStream_paragraph ${intersectionRatio > 0 ? 'active': ''}`}
      {...rest}
    >
      <ArticleCell
        memoid={memoid}
        {...cell}
        num={numCell}
        idx={cell.idx}
        role={cell.role}
        headingLevel={cell.isHeading ? cell.heading.level : 0}
        isNarrativeStep={isNarrativeStep}
      />
    </div>
  )
}

export default ArticleCellWrapper
