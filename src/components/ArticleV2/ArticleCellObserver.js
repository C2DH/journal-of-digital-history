import React, {useEffect } from 'react'
import { useOnScreen } from '../../hooks/graphics'

const ArticleCellObserver = ({ cell, children, onCellIntersectionChange, className, ...rest }) => {
  const [{ isIntersecting, intersectionRatio }, ref] = useOnScreen({
    rootMargin: '-20% 0% -25% 0%',
    threshold: [0, 0.25, 0.75, 1]
  })
  useEffect(() => {
    if (typeof onCellIntersectionChange === 'function') {
      onCellIntersectionChange({ idx: cell.idx, isIntersecting })
    } else {
      console.debug('[ArticleCellObserver] cell:', cell.idx, isIntersecting ? 'is in view' : 'disappeared' )
    }
  }, [intersectionRatio, isIntersecting])
  return (
    <div ref={ref} {...rest} className={`ArticleCellObserver ${className} ${isIntersecting ? 'active' : ''}`}>
      {children}
    </div>
  )
}

export default ArticleCellObserver
