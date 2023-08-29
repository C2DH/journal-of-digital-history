import React, { useEffect, useLayoutEffect } from 'react'
import { useArticleToCStore } from '../../store'
import { useSpring, a } from '@react-spring/web'
import '../../styles/components/Article2/ArticleToCTitle.scss'

function reduceTitleWithEllipsis(title) {
  const maxTitleLength = 50
  if (title.length > maxTitleLength) {
    return title.slice(0, title.lastIndexOf(' ', maxTitleLength)) + '...'
  }
  return title
}

const ArticleToCTitle = ({
  children,
  plainTitle = '',
  maxHeight = 0,
  enableMaxHeight = true,
  delay = 500,
  yDelta = -5,
}) => {
  const ref = React.useRef()
  const initialStyle = enableMaxHeight
    ? {
        height: maxHeight,
        overflow: 'hidden',
      }
    : {
        opacity: 0,
        y: yDelta,
        // height: maxHeight,
      }

  const [style, setStyle] = useSpring(() => ({
    ...initialStyle,
    transform: 'translate3d(0, 0, 0)',

    delay,
  }))
  useLayoutEffect(() => {
    if (enableMaxHeight && ref.current) {
      const height = ref.current.scrollHeight
      console.debug('[ArticleToCTitle] height:', height)
      if (height > maxHeight) {
        setStyle({
          height: maxHeight,
          overflow: 'hidden',
          delay,
        })
      }
    }
  }, [ref.current])
  // Connect to the store on mount, disconnect on unmount, catch state-changes in a reference
  useEffect(
    () =>
      useArticleToCStore.subscribe((state) => {
        if (enableMaxHeight && ref.current) {
          const height = ref.current.scrollHeight
          console.debug('[ArticleToCTitle] height:', height)
          setStyle({
            height: state.visibleCellsIdx.length ? height : maxHeight,
            delay: state.visibleCellsIdx.length ? delay : 0,
          })
        } else if (ref.current) {
          setStyle.start({
            opacity: state.visibleCellsIdx.length ? 1 : 0,
            y: state.visibleCellsIdx.length ? 0 : yDelta,
            // height: state.visibleCellsIdx.length ? ref.current.scrollHeight : maxHeight,
            delay: state.visibleCellsIdx.length ? delay : 0,
            // x: state.visibleCellsIdx.length ? 0 : 300,
          })
        }
      }),
    [],
  )

  return (
    <a.div style={style} ref={ref} className="ArticleToCTitle text-end">
      <h1 className=" h5 text-dark mb-2 pe-3">{reduceTitleWithEllipsis(plainTitle)}</h1>
      {children}
    </a.div>
  )
}

export default ArticleToCTitle
