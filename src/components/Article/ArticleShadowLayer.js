import React, { useEffect, useState } from 'react'
import { useMousePosition } from '../../hooks/graphics'
import { useSpring, animated } from 'react-spring'
import ArticleHeader from './ArticleHeader'
import ArticleShadowHandle from './ArticleShadowHandle'
// left to right
// const layerTransition = (x, y, width, height) => `polygon(0px 0px, 0px ${height}px, ${x}px ${height}px, ${x}px 0px)`
// right to left
const layerTransition = (x, y, width, height) => {
  return `polygon(${x - 20}px 0px, ${x}px ${height}px, ${width}px ${height}px, ${width}px 0px)`
}

const ArticleShadowLayer = ({ width, height, title, abstract, keywords, contributor, publicationDate, url, disclaimer }) => {
  const [props, setProps] = useSpring(() => ({ clipPath: [width, 50, width, height] }))//, config: { mass: 1, tension: 50, friction: 10 } }))
  const onDragHandler = ({x, y}) => {
    setProps({ clipPath: [width + x, y, width, height] })
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
        <div className="page mt-5 d-flex " style={{paddingTop: 100}}>
          <h1>Hidden layer with hermeneutic related</h1>
        </div>
      </animated.div>
      <ArticleShadowHandle onDrag={onDragHandler} width={width} height={height}/>
    </div>
  )
}

const ArticleShadowLayerDep = ({ width, height, title, abstract, keywords, contributor, publicationDate, url, disclaimer }) => {
  const [isActive, setIsActive] = useState(false)
  const [isMousedown, setIsMousedown] = useState(false)
  const [props, setProps] = useSpring(() => ({ clipPath: [width, 0, width, height] }))//, config: { mass: 1, tension: 50, friction: 10 } }))
  const { x, y } = useMousePosition();
  useEffect(() => {
    if (typeof x === "number" && typeof y === "number") {
      if (isMousedown) {
        setProps({ clipPath: [x, y, width, height] })
      } else {
        if (isActive) {
          setProps({ clipPath: [0, y, width, height] })
        } else {
          setProps({ clipPath: [width, y, width, height] })
        }
      }
      // if (isActive){
      //   return `polygon(${20}px 0px, ${0}px ${height}px, ${width}px ${height}px, ${width}px 0px)`
      // }
      // if(isMousedown) {
      //   return `polygon(${x + 20}px 0px, ${x}px ${height}px, ${width}px ${height}px, ${width}px 0px)`
      // }

    }
  })
  const mousedownListener = () => {
    setIsMousedown(true)
  };
  const mouseupListener = (e) => {
    setIsMousedown(false)
    console.info('@mouseupListene', e.clientX, width)
    if (e.clientX < width/2) {
      setIsActive(true)
    } else if (isActive) {
      setIsActive(false)
    }
  };
  console.info(isMousedown, isActive, x)
  useEffect(() => {
    window.addEventListener('mousedown', mousedownListener)
    window.addEventListener('mouseup', mouseupListener)
    return () => {
      window.removeEventListener('mousedown', mousedownListener);
      window.removeEventListener('mouseup', mouseupListener);
    }
  }, [])

  return (
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
      <ArticleHeader variant="text-white" {... {title, abstract, keywords, contributor, publicationDate, url, disclaimer }} />
    </div>
    </animated.div>)
}

export default ArticleShadowLayer
