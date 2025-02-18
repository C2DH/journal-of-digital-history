import React, { useEffect } from 'react'
import { useArticleToCStore } from '../../store'
import { useSpring, a } from '@react-spring/web'

const ArticleToCActions = ({ children, className = '', delay = 200 }) => {
  const [style, setStyle] = useSpring(() => ({
    opacity: 0,
    // x: 300,
    delay,
  }))
  // Connect to the store on mount, disconnect on unmount, catch state-changes in a reference
  useEffect(
    () =>
      useArticleToCStore.subscribe((state) => {
        setStyle.start({
          opacity: state.visibleCellsIdx.length ? 1 : 0,
          // x: state.visibleCellsIdx.length ? 0 : 300,
          delay: state.visibleCellsIdx.length ? delay : 0,
        })
      }),
    [],
  )

  return (
    <a.div style={style} className={`ArticleToCActions ${className}`}>
      {children}
    </a.div>
  )
}

export default ArticleToCActions
