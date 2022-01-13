import axios from 'axios'
import { useEffect, useRef, useState } from 'react'
import AbstractSubmission from '../../models/AbstractSubmission'
import { StatusIdle, StatusFetching, StatusSuccess, StatusNone, StatusError } from '../../constants'


export const useGetNotebookFromURL = (url, allowCached=false) => {
  const cache = useRef({});
  const [status, setStatus] = useState(StatusIdle);
  const [item, setItem] = useState(null);
  console.debug('useGetNotebookFromURL', url, item)

  useEffect(() => {
    let cancelRequest = false;
    if (!url) {
      setItem(null);
      setStatus(StatusNone);
      return;
    }
    const fetchData = async () => {
      setStatus(StatusFetching);
      if (cache.current[url] && allowCached=== true) {
          console.debug('useGetNotebookFromURL URL cached:', url)
          const data = cache.current[url];
          data.cached = true;
          if (cancelRequest) return;
          setItem(data);
          setStatus(StatusSuccess);
      } else {
          const response = await axios.get(url)
          const {data} = response
          cache.current[url] = data // set response in cache;
          if (cancelRequest) return;
          setItem(data)
          setStatus(StatusSuccess);
      }
    }
    fetchData()
    // "If useEffect returns a function, React will run it when it is time to clean up:"
    return function cleanup() {
      cancelRequest = true;
		}
  }, [url, allowCached])
  return { status, item };
}

export const useGetAbstractSubmission = (id) => {
  const cache = useRef({});
  const [status, setStatus] = useState('idle');
  const [item, setItem] = useState(new AbstractSubmission());

  useEffect(() => {
    let cancelRequest = false;
    if (!id) return;
    const fetchData = async () => {
      setStatus('fetching');
      if (cache.current[id]) {
          console.log('cached')
          const data = cache.current[id];
          data.cached = true;
          if (cancelRequest) return;
          setItem(data);
          setStatus('fetched');
      } else {
          const response = await fetch(`/api/abstracts/${id}`)
          const data = await response.json()
          cache.current[id] = data // set response in cache;
          if (cancelRequest) return;
          setItem(new AbstractSubmission(data))
          setStatus('fetched');
      }
    }
    fetchData();
    // "If useEffect returns a function, React will run it when it is time to clean up:"
    return function cleanup() {
      cancelRequest = true;
		}
  }, [id]);
  return { status, item };
}


export const useGetJSON = ({
  url,
  allowCached=true,
  delay=0,
  onDownloadProgress,
  timeout=process.env.REACT_APP_API_TIMEOUT || 0,
  raw=false
}) => {
  const cache = useRef({});
  const [response, setResponse] = useState({
    data: null,
    error: null,
    status: StatusIdle
  });
  if (process.env.NODE_ENV === 'development') {
    console.debug('useGetDataset url:', url, 'response', response)
  }
  useEffect(() => {
    let cancelRequest = false
    let timer = null
    if (!url) {
      setResponse({
        data: null,
        error: null,
        status: StatusNone
      });
      return;
    }
    const fetchData = async () => {
      setResponse({
        data: null,
        error: null,
        status: StatusFetching
      });
      if (cache.current[url] && allowCached=== true) {
          console.debug('useGetDataset allowCached url:', url)
          const data = cache.current[url];
          if (!raw) {
            data.cached = true;
          }
          if (cancelRequest) return;
          setResponse({
            data: data,
            error: null,
            status: StatusSuccess
          });
      } else {
          console.debug('useGetDataset load fresh url:', url, 'timeout', timeout)
          return axios.get(url, { timeout, onDownloadProgress })
            .then(({data}) => {
              cache.current[url] = data // set response in cache;
              if (cancelRequest) return;
              setResponse({
                data: data,
                error: null,
                status: StatusSuccess
              });
            }).catch((err) => {
              if (cancelRequest) return;

              setResponse({
                data: null,
                error: err,
                errorCode: err.response?.status || err.code,
                status: StatusError
              });
            })
      }
    }
    if (delay) {
      timer = setTimeout(() => {
        fetchData()
      }, delay)
    } else {
      fetchData()
    }

    // "If useEffect returns a function, React will run it when it is time to clean up:"
    return function cleanup() {
      cancelRequest = true;
      clearTimeout(timer)
		}
  }, [url, allowCached, delay])
  return response
}

export const useGetRawContents = (opts) => {
  return useGetJSON({... opts, raw:true })
}
