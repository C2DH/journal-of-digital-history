import React from 'react'
import { useSpring, animated } from '@react-spring/web'
import { useDrag } from 'react-use-gesture'
import { useTranslation } from 'react-i18next'


const ArticleShadowHandle = ({ onDrag, width=0, height=0, disabled=false }) => {
  const { t } = useTranslation()
  const [props, api] = useSpring(() => ({
    x: 0,
    y: 0,
    scale: 1
  }))
  const bind = useDrag(({ last, active, movement: [x, y] }) => {
    const isOnTarget = x < -width/2
    const xPos = active ? x : isOnTarget ? -width + 100 : 0
    const yPos = active ? y : 0
    api.start({ x: xPos, y: yPos, scale: active ? 1.2 : 1 })
    onDrag({ x: xPos, y:yPos, active })
  })
  if (disabled) {
    return null
  }
  // Now we're just mapping the animated values to our view, that's it.
  // Btw, this component only renders once. :-)
  return (
    <animated.div className="ArticleShadowHandle" {...bind()} style={props}>
    <svg version='1.1' viewBox='0 0 200 200'>
      <g className='cube'>
        <g transform='scale(1.8) translate(14, 10)'>
          <path fill="transparent" strokeWidth="2" stroke='#fff' d='M40,46.2 0,23.1 40,0 80,23.1 z' />
          <path fill="transparent" strokeWidth="2" stroke='#fff' d='M0,23.1 40,46.2 40,92.4 0,69.3 z' />
          <path fill="transparent" strokeWidth="2" stroke='#fff' d='M40,46.2 80,23.1 80,69.3 40,92.4 z' />
        </g>
      </g>
    </svg>
    <label>{t('actions.switchToHermeneuticLayer')}</label>
    </animated.div>
  )
}

export default React.memo(ArticleShadowHandle)
