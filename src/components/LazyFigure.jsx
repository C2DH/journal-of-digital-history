import React, { useLayoutEffect } from 'react'
import { useImage, useOnScreen } from '../hooks/graphics'
import '../styles/components/LazyFigure.scss'

const DefaultBase64Image =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNUUlayBwABfgCoNp4e8AAAAABJRU5ErkJggg=='

const LazyFigure = ({
  aspectRatio = 'auto', // numeric or string
  height = 0, // if there's no aspectRatio!
  src = '', // actual url...
  base64 = DefaultBase64Image,
  delay = 1000,
  withTransition = false,
  onClick,
}) => {
  const [{ isIntersecting }, ref] = useOnScreen()
  const { isLoaded } = useImage({ src, initialize: isIntersecting && src.length, delay })
  const hasSrc = src.length > 0
  const isFigureReady = src.length ? isLoaded : isIntersecting

  useLayoutEffect(() => {
    console.debug('[LazyFigure] \n - isIntersecting:', isIntersecting)
  }, [isIntersecting])

  console.debug('[LazyFigure] \n - src:', src)
  return (
    <figure
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
      {hasSrc ? (
        <>
          <div
            className={`LazyFigure_preloader ${isIntersecting || isLoaded ? 'active' : ''} ${
              withTransition ? 'with-transition' : ''
            }`}
            onClick={onClick}
            style={{
              backgroundImage: `url(${base64})`,
            }}
          />
          <div
            className={`LazyFigure_image ${isFigureReady ? 'active' : ''} ${
              withTransition ? 'with-transition' : ''
            }`}
            style={
              isFigureReady
                ? {
                    backgroundImage: `url(${src})`,
                  }
                : {}
            }
          />
        </>
      ) : (
        <div
          className={`LazyFigure_image ${isIntersecting ? 'active' : ''} ${
            withTransition ? 'with-transition' : ''
          }`}
          style={
            isIntersecting
              ? {
                  backgroundImage: `url(${base64})`,
                }
              : {}
          }
        />
      )}
    </figure>
  )
}

export default LazyFigure