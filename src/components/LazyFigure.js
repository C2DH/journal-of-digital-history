import React from 'react'
import { useLayoutEffect } from 'react'
import { useImage, useOnScreen } from '../hooks/graphics'
import '../styles/components/LazyFigure.scss'

const LazyFigure = ({
  aspectRatio = 'auto', // numeric or string
  height = 0, // if thre's no aspectRatio!
  src = '', // actual url...
  base64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNUUlayBwABfgCoNp4e8AAAAABJRU5ErkJggg==',
  delay = 1000,
  onClick,
}) => {
  const [{ isIntersecting }, ref] = useOnScreen()
  const { isLoaded } = useImage({ src, initialize: isIntersecting, delay })
  useLayoutEffect(() => {
    console.debug('[LazyFigure] \n - isIntersecting:', isIntersecting)
  }, [isIntersecting])

  console.debug('[LazyFigure] \n - src:', src)
  return (
    <div
      ref={ref}
      className="LazyFigure"
      style={
        !isNaN(aspectRatio)
          ? {
              paddingTop: `${aspectRatio * 100}%`,
            }
          : {
              minHeight: height,
            }
      }
    >
      <div
        className={`LazyFigure_preloader bg-dark ${isIntersecting || isLoaded ? 'active' : ''}`}
        onClick={onClick}
        style={{
          backgroundImage: `url(${base64})`,
        }}
      />
      <div
        className={`LazyFigure_image ${isLoaded ? 'active' : ''}`}
        style={
          isLoaded
            ? {
                backgroundImage: `url(${src})`,
              }
            : {}
        }
      />
    </div>
  )
}

export default LazyFigure
