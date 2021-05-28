import React, { useEffect } from 'react'
import { useSpring, animated } from 'react-spring'
import ArticleHeader from './ArticleHeader'
import ArticleShadowHandle from './ArticleShadowHandle'
// left to right
// const layerTransition = (x, y, width, height) => `polygon(0px 0px, 0px ${height}px, ${x}px ${height}px, ${x}px 0px)`
// right to left
const layerTransition = (x, y, width, height) => {
  return `polygon(${x - 20}px 0px, ${x}px ${height}px, ${width}px ${height}px, ${width}px 0px)`
}

const ArticleShadowLayer = ({ width, height, title, abstract, keywords, contributor, publicationDate, url, disclaimer, disabled=false }) => {
  const [props, setProps] = useSpring(() => ({ clipPath: [width, 50, width, height], x:0, y:0 }))//, config: { mass: 1, tension: 50, friction: 10 } }))
  const onDragHandler = ({ x, y, active }) => {
    if (x < width / 2) {
      setProps({ clipPath: [width + x, y, width, height], x, y })
    } else {
      setProps({ clipPath: [width + x, y, width, height], x, y })
    }
  }
  useEffect(() => {
    setProps({ clipPath: [width, 50, width, height] })
  }, [width, height, setProps])

  if (disabled) {
    return null
  }
  return (
    <div className="ArticleShadowLayer" style={{
      width,
      minHeight: height
    }}>
      <animated.div style={{
        position: 'fixed',
        top: 0,
        width,
        minHeight: height,
        backgroundColor: 'var(--primary)',
        zIndex: 2,
        clipPath: props.clipPath.interpolate(layerTransition),
      }}>
        <div className="page mt-5" style={{paddingTop: 100}}>
          <ArticleHeader variant="text-white"
            title={title}
            keywords={keywords}
            contributor={contributor}
            publicationDate={publicationDate}
            url={url}
            disclaimer={disclaimer}
          />
        </div>
      </animated.div>
      <ArticleShadowHandle onDrag={onDragHandler} width={width} height={height} disabled={disabled}/>
    </div>
  )
}

export default ArticleShadowLayer
