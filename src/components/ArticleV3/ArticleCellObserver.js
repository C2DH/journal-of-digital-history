import React, { useRef } from 'react'
import { useEffect } from 'react'
import { useToCStore } from './store'
/**
 * React component that observes the visibility of an article cell.
 * It uses InteractinObserver so it shuld be fast and reliable.
 * @component
 * @param {Object} props - The component props.
 * @param {Object} props.cell - The article cell object.
 * @param {number} props.cell.idx - The index of the article cell.
 * @param {number} [props.threshold=0.25] - The threshold for intersection ratio.
 * @param {string} [props.rootMargin='0% 0% 0% 0%'] - The root margin for intersection observer.
 * @param {string} [props.className=''] - The additional CSS class name for the component.
 * @returns {JSX.Element} - The ArticleCellObserver component.
 */
const ArticleCellObserver = ({
  cell = { idx: -1 },
  threshold = 0.25,
  rootMargin = '0% 0% 0% 0%',
  className = '',
  ...rest
}) => {
  const ref = useRef(null)
  const [addVisibleCellIdx, removeVisibleCellIdx] = useToCStore((store) => [
    store.addVisibleCellIdx,
    store.removeVisibleCellIdx,
  ])
  useEffect(() => {
    console.debug('[ArticleCellObserver] creating observer for cell:', cell.idx)
    const observer = new IntersectionObserver(
      ([b]) => {
        console.debug(
          '[ArticleCellObserver] cell:',
          'num:',
          cell.num,
          'idx:',
          cell.idx,
          'level',
          cell.level,
          b.isIntersecting ? 'is in view' : 'disappeared',
          b.intersectionRatio,
        )
        if (b.isIntersecting) {
          addVisibleCellIdx(cell.idx)
        } else {
          removeVisibleCellIdx(cell.idx)
        }
      },
      {
        threshold,
        rootMargin,
      },
    )
    observer.observe(ref.current)
    // Remove the observer as soon as the component is unmounted
    return () => {
      observer.disconnect()
    }
  }, [threshold, rootMargin])

  return <div ref={ref} {...rest} className={`ArticleCellObserver ${className}`} />
}

export default ArticleCellObserver
