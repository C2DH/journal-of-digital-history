import React, { useEffect } from 'react'
import { useSpring, animated } from 'react-spring'
import ArticleHeader from './ArticleHeader'
import ArticleScrollama from './ArticleScrollama'
import ArticleShadowHandle from './ArticleShadowHandle'
import { setBodyNoScroll } from '../../logic/viewport'
import { DisplayLayerHermeneutics } from '../../constants'
import { useQueryParam, StringParam} from 'use-query-params'
// left to right
// const layerTransition = (x, y, width, height) => `polygon(0px 0px, 0px ${height}px, ${x}px ${height}px, ${x}px 0px)`
// right to left
const layerTransition = (x, y, width, height) => {
  return `polygon(${x - 20}px 0px, ${x}px ${height}px, ${width}px ${height}px, ${width}px 0px)`
}

const labelTransition = (x, y, width, height) => {
  return `translate(${x - 50}px, ${height / 2}px) rotate(90deg)`
}
const ArticleShadowLayer = ({
  memoid='',
  width, height,
  title, abstract, keywords, contributor,
  publicationDate, url, disclaimer,
  disabled=false,
  cells=[], onDataHrefClick
}) => {
  const [props, setProps] = useSpring(() => ({ clipPath: [width, 50, width, height], x:0, y:0 }))//, config: { mass: 1, tension: 50, friction: 10 } }))
  const [displayLayer, setDisplayLayer] = useQueryParam('layer', StringParam)

  const onDragHandler = ({ x, y, active }) => {
    // Beware! we use negative width because of the clipPath. The handler appears on the left
    // of the screen when its x is -width, and appear on the **right** when x is 0
    if (x < -width / 2) {
      if (displayLayer !== DisplayLayerHermeneutics) {
        setDisplayLayer(DisplayLayerHermeneutics)
        // setBodyNoScroll(true)
      }
    } else {
      if (displayLayer === DisplayLayerHermeneutics) {
        // toggle
        setDisplayLayer(null)
        // setBodyNoScroll(false)
      }
    }
    if (active) {
       setProps({ clipPath: [Math.min(width + x, width - 50), y, width, height], x, y })
    } else {
      if (displayLayer === DisplayLayerHermeneutics) {
        setProps({ clipPath: [0, y, width, height], x:-width, y })
      } else {
        setProps({ clipPath: [width, 50, width, height], x, y })
      }
    }
  }

  useEffect(() => {
    if (displayLayer === DisplayLayerHermeneutics) {
      setProps({ clipPath: [0, 50, width, height], x:-width, height })
    } else {
      setProps({ clipPath: [width, 50, width, height], x:-width, height })
    }
  }, [width, height, setProps, displayLayer])

  useEffect(() => {
    setBodyNoScroll(displayLayer === DisplayLayerHermeneutics)
  }, [displayLayer])

  if (disabled) {
    return null
  }
  return (
    <div className="ArticleShadowLayer" style={{
      width,
      minHeight: height
    }}>
      <animated.div className="ArticleShadowLayer_animatedLabel" style={{
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: 3,
        transform: props.clipPath.interpolate(labelTransition),
      }}><b>... go to heremeneutic layer...</b></animated.div>
      <animated.div style={{
        position: 'fixed',
        top: 0,
        width,
        height,
        backgroundColor: 'var(--primary)',
        zIndex: 2,
        clipPath: props.clipPath.interpolate(layerTransition),
      }}>
        <div className="page pt-5 h-100" style={{
          marginTop: 100,
          pointerEvents:'auto',
          overflow: 'scroll',
        }}>
        <ArticleHeader
          title={title}
          contributor={contributor}
          publicationDate={publicationDate}
        />
        <ArticleScrollama
          memoid={memoid}
          cells={cells}
          shadowLayers={[]}
          onDataHrefClick={onDataHrefClick}
          onStepChange={()=>{}}
        />
        </div>
      </animated.div>
      <ArticleShadowHandle
        onDrag={onDragHandler}
        width={width} height={height}
        disabled={disabled}
        isOnTarget={displayLayer===DisplayLayerHermeneutics}/>
    </div>
  )
}

export default ArticleShadowLayer
