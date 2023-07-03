import axios from 'axios'
import { useQuery } from '@tanstack/react-query'
import { useEffect, useRef, useState } from 'react'
import AbstractSubmission from '../../models/AbstractSubmission'
import { StatusIdle, StatusFetching, StatusSuccess, StatusNone } from '../../constants'
import { useTimeout } from '../../hooks/timeout'

export const useGetNotebookFromURL = (url, allowCached = false) => {
  const cache = useRef({})
  const [status, setStatus] = useState(StatusIdle)
  const [item, setItem] = useState(null)
  console.debug('useGetNotebookFromURL', url, item)

  useEffect(() => {
    let cancelRequest = false
    if (!url) {
      setItem(null)
      setStatus(StatusNone)
      return
    }
    const fetchData = async () => {
      setStatus(StatusFetching)
      if (cache.current[url] && allowCached === true) {
        console.debug('useGetNotebookFromURL URL cached:', url)
        const data = cache.current[url]
        data.cached = true
        if (cancelRequest) return
        setItem(data)
        setStatus(StatusSuccess)
      } else {
        const response = await axios.get(url)
        const { data } = response
        cache.current[url] = data // set response in cache;
        if (cancelRequest) return
        setItem(data)
        setStatus(StatusSuccess)
      }
    }
    fetchData()
    // "If useEffect returns a function, React will run it when it is time to clean up:"
    return function cleanup() {
      cancelRequest = true
    }
  }, [url, allowCached])
  return { status, item }
}

export const useGetAbstractSubmission = (id) => {
  const cache = useRef({})
  const [status, setStatus] = useState('idle')
  const [item, setItem] = useState(new AbstractSubmission())

  useEffect(() => {
    let cancelRequest = false
    if (!id) return
    const fetchData = async () => {
      setStatus('fetching')
      if (cache.current[id]) {
        console.log('cached')
        const data = cache.current[id]
        data.cached = true
        if (cancelRequest) return
        setItem(data)
        setStatus('fetched')
      } else {
        const response = await fetch(`/api/abstracts/${id}`)
        const data = await response.json()
        cache.current[id] = data // set response in cache;
        if (cancelRequest) return
        setItem(new AbstractSubmission(data))
        setStatus('fetched')
      }
    }
    fetchData()
    // "If useEffect returns a function, React will run it when it is time to clean up:"
    return function cleanup() {
      cancelRequest = true
    }
  }, [id])
  return { status, item }
}

export const useGetJSON = ({
  url,
  memoid = '',
  delay = 0,
  timeout = process.env.REACT_APP_API_TIMEOUT || 0,
  onDownloadProgress,
  onCompleted,
  failSilently = false,
}) => {
  const [enabled, setEnabled] = useState(false)
  console.debug('[fetchData useGetJSON] Request \n - url:', url, '\n - enabled: ', enabled)
  const response = useQuery({
    queryKey: [url ?? '', memoid],
    queryFn: () =>
      axios
        .get(url, { timeout, onDownloadProgress })
        .then(({ data }) => {
          console.debug('[fetchData useGetJSON] received data', data.length)
          return data
        })
        .catch((err) => {
          console.warn('[fetchData useGetJSON] error on url:', url, ' - error', err)
          if (failSilently) return null
          throw err
        }),
    enabled: url !== null && enabled,
  })
  useTimeout(() => {
    if (!enabled) {
      setEnabled(true)
    }
  }, delay)
  if (enabled && process.env.NODE_ENV === 'development') {
    console.debug('[fetchData useGetJSON] Response \n - url:', url, '\n - status', response.status)
  }
  if (typeof onCompleted === 'function' && response.status === 'success') {
    onCompleted()
  }
  return response
}

export const useGetRawContents = (opts) => {
  return useGetJSON({ ...opts, raw: true })
}
