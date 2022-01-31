import React, { useEffect } from 'react'
import { useGetJSON } from '../logic/api/fetchData'
import { StatusSuccess, StatusFetching, StatusError } from '../constants'
import ErrorViewer from './ErrorViewer'
import { useSpring, animated, config } from 'react-spring'


const StaticPageLoader = ({ url, delay=0, Component, fakeData }) => {
  const [animatedLine, apiAnimatedLine] = useSpring(() => ({ width : 0, opacity:1, config: config.slow }))
  const { data, error, status } = useGetJSON({
    url,
    delay,
    onDownloadProgress: (e) => {
      console.debug('onDownloadProgress', e, e.total, e.loaded)
      if (e.total && e.loaded) {
        if (e.loaded < e.total) {
          apiAnimatedLine.start({ width: 100 * e.loaded / e.total })
        }
      }
    }
  })

  useEffect(() => {
    if (status === StatusFetching) {
      apiAnimatedLine.start({
        width: 10,
        opacity: 1
      })
    } else if(status === StatusSuccess) {
      apiAnimatedLine.start({
        width: 100,
        opacity: 0
      })
    } else if(status === StatusError) {
      apiAnimatedLine.start({
        width: 0,
        opacity: 0
      })
    }
  }, [status])
  console.debug('[StaticPageLoader] status:', status)
  return (
    <>
    <div className="position-fixed w-100" style={{
      top: 0,
      left: 0,
      zIndex: 3
    }}>
      <animated.div className="NotebookViewer_loading position-absolute" style={{
        opacity: animatedLine.opacity,
        width: animatedLine.width.to(x => `${x}%`),
      }}/>
      <animated.span className="NotebookViewer_loadingPercentage monospace" style={{
        opacity: animatedLine.opacity
      }}>{animatedLine.width.to(x => `${Math.round(x * 10000) / 10000}%`)}
      </animated.span>
    </div>

    {status === StatusError && <ErrorViewer error={error} errorCode={error.code} />}
    {status !== StatusError && (
      <Component
        status={status}
        data={status === StatusSuccess ? data : fakeData}
        isFake={status !== StatusSuccess}
      />
    )}
    </>
  )
}
export default StaticPageLoader
