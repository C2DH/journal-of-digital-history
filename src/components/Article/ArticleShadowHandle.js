import React from 'react'
import { useSpring, animated } from '@react-spring/web'
import { useDrag } from 'react-use-gesture'

const ArticleShadowHandle = ({ onDrag, width=0, height=0 }) => {
  console.info('rendering ArticleShadowHandle')
  const [props, api] = useSpring(() => ({
    x: 0,
    y: 0,
    scale: 1
  }))
  const bind = useDrag(({ last, active, movement: [x, y] }) => {
    api.start({
      x: active ? x : 0,
      y: active ? y : 0,
      scale: active ? 1.2 : 1
    })
    onDrag({
      x: active ? x : 0,
      y: active ? y : 0,
      active,
    })
  })
  // Now we're just mapping the animated values to our view, that's it.
  // Btw, this component only renders once. :-)
  return (
    <animated.div className="ArticleShadowHandle" {...bind()} style={props}>
    <svg version='1.1' viewBox='0 0 200 200'>
      <g class='cube'>
        <g transform=''>
          <path fill='rgb(222,222,222)' d='M40,46.2 0,23.1 40,0 80,23.1 z' />
          <path fill='rgb(181,181,181)' d='M0,23.1 40,46.2 40,92.4 0,69.3 z' />
          <path fill='rgb(155,155,155)' d='M40,46.2 80,23.1 80,69.3 40,92.4 z' />
        </g>
      </g>
    </svg>
    <label>drag me</label>
    </animated.div>
  )
}

export default React.memo(ArticleShadowHandle)
