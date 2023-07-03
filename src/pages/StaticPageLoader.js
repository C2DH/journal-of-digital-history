import React, { useEffect } from 'react'
import { useGetJSON } from '../logic/api/fetchData'
import { StatusSuccess, StatusFetching, StatusError } from '../constants'
import ErrorViewer from './ErrorViewer'
import { usePropsStore } from '../store'

const StaticPageLoader = ({ url, delay = 0, Component, fakeData, raw = false, ...rest }) => {
  const setLoadingProgress = usePropsStore((state) => state.setLoadingProgress)

  const { data, error, status } = useGetJSON({
    url,
    delay,
    raw,
    onDownloadProgress: (e) => {
      console.debug('[StaticPageLoader] onDownloadProgress url', url, e.total, e.loaded)
      if (!e.total && e.loaded > 0) {
        // euristic average zise of a notebook
        setLoadingProgress(e.loaded / 23810103, url)
      } else if (e.total && e.loaded) {
        if (e.loaded < e.total) {
          setLoadingProgress(e.loaded / e.total, url)
        }
      }
    },
  })

  useEffect(() => {
    if (status === StatusFetching) {
      setLoadingProgress(0.05, url)
    } else if (status === StatusSuccess) {
      setLoadingProgress(1, url)
    } else if (status === StatusError) {
      setLoadingProgress(0, url)
    }
  }, [status])
  console.info('[StaticPageLoader] url:', url)
  return (
    <>
      {status === StatusError && <ErrorViewer error={error} errorCode={error.code} />}
      {status !== StatusError && (
        <Component
          status={status}
          url={url}
          data={status === StatusSuccess ? data : fakeData}
          isFake={status !== StatusSuccess}
          {...rest}
        />
      )}
    </>
  )
}
export default StaticPageLoader
