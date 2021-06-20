import React, { useEffect } from 'react'
import { useSpring, animated } from 'react-spring'
import ArticleHeader from './ArticleHeader'
import ArticleShadowHandle from './ArticleShadowHandle'
import ArticleScrollama from './ArticleScrollama'
import ArticleCell from './ArticleCell'
import { LayerHermeneutics } from '../../constants'
// left to right
// const layerTransition = (x, y, width, height) => `polygon(0px 0px, 0px ${height}px, ${x}px ${height}px, ${x}px 0px)`
// right to left
const layerTransition = (x, y, width, height) => {
  return `polygon(${x - 20}px 0px, ${x}px ${height}px, ${width}px ${height}px, ${width}px 0px)`
}

const ArticleShadowLayer = ({
  memoid='',
  width, height,
  title, abstract, keywords, contributor,
  publicationDate, url, disclaimer,
  disabled=false,
  cells=[]
}) => {
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
      minHeight: height,
    }}>
      <animated.div style={{
        position: 'fixed',
        top: 0,
        width,
        minHeight: height,
        backgroundColor: 'var(--primary)',
        zIndex: 200,
        clipPath: props.clipPath.interpolate(layerTransition),
        overflow: 'scroll',
        pointerEvents: 'all',
      }}>
        <div className="page mt-5" style={{paddingTop: 100}}>
          {cells.map((cell, i) => {
            return (
            <ArticleCell
              mmoid={memoid}
              {...cell}
              idx={cell.idx}
              active={false}
            />)
          })}
        </div>
      </animated.div>
      <ArticleShadowHandle onDrag={onDragHandler} width={width} height={height} disabled={disabled}/>
    </div>
  )
}

export default React.memo(ArticleShadowLayer)
