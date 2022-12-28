import { a, useSpring } from '@react-spring/web'
import React, { useLayoutEffect, useEffect, useRef, useCallback } from 'react'
import { ArrowDown, ArrowUp } from 'react-feather'
import { debounce } from '../logic/viewport'
import '../styles/components/ToCIntoView.scss'

const IsDownBelow = 1
const IsUpAbove = -1
const IsVisible = 0

const ToCIntoView = ({
  targetRef,
  targetOffsetTop,
  targetHeight = 20,
  tooltipHeight = 24,
  verticalOffset = 5,
  onClick,
}) => {
  const [styles, api] = useSpring(() => ({ opacity: 0, y: 0, direction: IsVisible }))
  const previousDirection = useRef(IsVisible)
  const onTargetScroll = useCallback(
    () =>
      debounce(() => {
        if (targetRef.current) {
          const { height } = targetRef.current.getBoundingClientRect()
          const isDownBelow = targetOffsetTop + targetHeight - targetRef.current.scrollTop > height
          const isUpAbove = isDownBelow ? false : targetOffsetTop < targetRef.current.scrollTop

          if (isDownBelow) {
            if (previousDirection.current !== IsDownBelow) {
              api.set({ y: height - tooltipHeight - verticalOffset * 3, opacity: 0 })
            }
            api.start({
              y: height - tooltipHeight - verticalOffset,
              opacity: 1,
              direction: IsDownBelow,
            })
            previousDirection.current = IsDownBelow
          } else if (isUpAbove) {
            if (previousDirection.current !== IsUpAbove) {
              api.set({ y: verticalOffset * 3, opacity: 0 })
            }
            api.start({ y: verticalOffset, opacity: 1, direction: IsUpAbove })
            previousDirection.current = IsUpAbove
          } else {
            // if it visible, hide this out
            api.start({ opacity: 0, direction: IsVisible })
            previousDirection.current = IsVisible
          }
          // const isDownBelow = targetOffsetTop > height + targetRef.current.scrollTop
          previousDirection.current = isDownBelow ? 1 : isUpAbove ? -1 : 0

          console.debug(
            '[ToCintoView] onTargetScroll',
            '\n- scrollTop:',
            targetRef.current.scrollTop,
            '\n- scrollHeight:',
            targetRef.current.scrollHeight,
            '\n- height',
            height,
            '\n- targetOffsetTop',
            targetOffsetTop,
            '\n- isDownBelow',
            isDownBelow,
            '\n- isUpAbove',
            isUpAbove,
            '\n-previousDirection',
            previousDirection,
          )
        }
      }, 150),
    [targetOffsetTop, targetHeight],
  )

  const onClickHandler = () => {
    if (targetRef.current) {
      console.debug('[ToCintoView] @onclick')
      targetRef.current.scrollTo({ top: targetOffsetTop - verticalOffset, behavior: 'smooth' })
      if (typeof onClick === 'function') {
        onClick({ currentScrollTop: targetRef.current.scrollTop, targetOffsetTop })
      }
    }
  }

  useLayoutEffect(() => {
    // evaluate bounding box
    if (targetRef.current) {
      targetRef.current.addEventListener('scroll', onTargetScroll, { passive: true })
      onTargetScroll()
    }
    return function cleanup() {
      if (targetRef.current) {
        targetRef.current.removeEventListener('scroll', onTargetScroll)
      }
    }
  }, [])

  useEffect(() => {
    console.debug('[ToCintoView] @useEffect for targetOffsetTop')
    onTargetScroll(targetOffsetTop)
  }, [targetOffsetTop])
  return (
    <a.div
      style={{ ...styles, pointerEvents: styles.opacity.to((v) => (v < 1 ? 'none' : 'auto')) }}
      className="ToCIntoView"
    >
      <div
        className="ToCIntoView_message"
        onClick={onClickHandler}
        style={{ height: tooltipHeight }}
      >
        <a.div style={{ transform: styles.direction.to((v) => `translateY(${-24 * v}px)`) }}>
          <ArrowUp className="ToCIntoView_message_arrowup" size={15} />
          <ArrowDown className="ToCIntoView_message_arrowdown" size={15} />
        </a.div>
      </div>
    </a.div>
  )
}

export default ToCIntoView
