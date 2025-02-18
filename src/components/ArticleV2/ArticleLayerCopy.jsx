import React from 'react'
import { LayerNarrative } from '../../constants'
import { useGesture } from "react-use-gesture"
import { useSpring, animated, config } from '@react-spring/web'
import ArticleCell from '../Article/ArticleCell'

const ArticleLayer = ({
  memoid='',
  layer=LayerNarrative,
  cells=[],
  onPlaceholderClick,
  ...rest
}) => {
  const [styles,api] = useSpring(() => ({ y:0, config: config.stiff}))
  // const runSprings = useCallback((y, vy) => {
  //   console.info('ArticleLayer', layer, y, vy)
  //   api.start({ y: -y })
  // }, [])
  // const wheelOffset = useRef(0)
  // const dragOffset = useRef(0)
  const bind = useGesture({
    onWheel: ({ offset: [, y], vxvy: [, vy] }) => {
      console.info('onWheel', vy)
      api.start({ y: -y })
    }
    // onDrag: ({ offset: [x], vxvy: [vx] }) => vx && ((dragOffset.current = -x), runSprings(wheelOffset.current + -x, -vx)),
    // onWheel: ({ offset: [, y], vxvy: [, vy] }) => vy && ((wheelOffset.current = Math.max(0, y)), runSprings(dragOffset.current + Math.max(0, y), vy))
  })
  return (
    <animated.div {...bind()} className="position-absolute border border-dark" {...rest}>
      {layer}
      <animated.div style={styles}>
      {cells.map((cell, i) => {
        if (cell.isPlaceholder) {
          return (
            <div onClick={onPlaceholderClick} key={i}>PLACEHOLDER! {cell.layer} {cell.idx}</div>
          )
        }
        return (
          <div key={i}>{cell.layer} {cell.idx}
          <ArticleCell
            memoid={memoid}
            {...cell}
            num={cell.num}
            idx={cell.idx}
            role={cell.role}
            headingLevel={cell.isHeading ? cell.heading.level : 0}
          />
          </div>

        )
      })}
      </animated.div>
    </animated.div>
  )
}

export default ArticleLayer
