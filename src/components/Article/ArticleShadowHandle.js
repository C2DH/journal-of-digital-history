import React, { useEffect } from 'react'
import { useSpring, animated } from '@react-spring/web'
import { useGesture } from 'react-use-gesture'
import { useTranslation } from 'react-i18next'
import { Cpu } from 'react-feather'

const ArticleShadowHandle = ({ onDrag, width=0, height=0, disabled=false, isOnTarget=false }) => {
  const { t } = useTranslation()
  const [props, api] = useSpring(() => ({
    x: isOnTarget ? -width + 150 : 0,
    y: 0,
    scale: 1
  }))
  const bind = useGesture({
    onDrag: ({ active, movement: [x, y] }) => {
      // const isOnTarget = x < -width/2
      const xPos = active ? x : isOnTarget ? -width + 150 : 0
      const yPos = active ? y : 0
      api.start({ x: xPos, y: yPos, scale: active ? 1.2 : 1 })
      onDrag({ x: xPos, y:yPos, active })
    }
  }, {
    drag: { initial: () => [props.x.get(), 0] }
  })
  useEffect(() => {
    api.start({
      x: isOnTarget ? -width + 150 : 0,
      y: 0, scale: 1
    })
    // Eslint exception: we don't forward react spring api definition.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOnTarget, width])
  if (disabled) {
    return null
  }
  // Now we're just mapping the animated values to our view, that's it.
  // Btw, this component only renders once. :-)
  return (
    <animated.div className={`ArticleShadowHandle ${isOnTarget ? 'active' : ''}`} {...bind()} style={props}>
    <Cpu size="20" color="var(--white)"/>
    {/*/<svg version='1.1' viewBox='0 0 200 200'>
      <g className='cube'>
        <g transform='scale(1.2) translate(44, 35)'>
          <path fill="transparent" strokeWidth="2" stroke='#fff' d='M40,46.2 0,23.1 40,0 80,23.1 z' />
          <path fill="transparent" strokeWidth="2" stroke='#fff' d='M0,23.1 40,46.2 40,92.4 0,69.3 z' />
          <path fill="transparent" strokeWidth="2" stroke='#fff' d='M40,46.2 80,23.1 80,69.3 40,92.4 z' />
        </g>
      </g>
    </svg>*/}
    <label>{t('actions.switchToHermeneuticLayer')}</label>
    </animated.div>
  )
}

export default React.memo(ArticleShadowHandle)
