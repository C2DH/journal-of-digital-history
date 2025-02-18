import React, { useLayoutEffect, useRef } from 'react'
import { useSpring, a } from '@react-spring/web'
import './ArticleToCTitle.css'

function reduceTitleWithEllipsis(title = '') {
  const maxTitleLength = 50
  if (typeof title === 'string' && title.length > maxTitleLength) {
    return title.slice(0, title.lastIndexOf(' ', maxTitleLength)) + '...'
  }
  return title
}

const ArticleToCTitle = ({ children, plainTitle = '', delay = 500 }) => {
  const ref = useRef()
  const isCollapsed = useRef(true)
  const [style, api] = useSpring(() => ({
    height: 0,
    opacity: 0,
    transform: 'translate3d(0, 0, 0)',
    delay,
  }))

  useLayoutEffect(() => {
    const collapse = () => {
      if (isCollapsed.current) {
        return
      }
      isCollapsed.current = true
      api.start({
        height: 0,
        opacity: 0,
      })
    }
    const expand = () => {
      if (!isCollapsed.current) {
        return
      }
      const height = Math.min(ref.current.scrollHeight, 100)
      isCollapsed.current = false
      api.start({
        height: height,
        opacity: 1,
        delay,
      })
    }
    // if window scroll is more than 100px; show the title
    const onScroll = () => {
      if (!ref.current) return
      if (window.scrollY < 100) {
        collapse()
        return
      }
      expand()
    }
    if (window.scrollY > 100) {
      expand()
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <a.div style={style} ref={ref} title={plainTitle} className="ArticleToCTitle text-end">
      <h1 className=" h5 text-dark mb-2 px-1 ">{reduceTitleWithEllipsis(plainTitle)}</h1>
      {children}
    </a.div>
  )
}

export default ArticleToCTitle
