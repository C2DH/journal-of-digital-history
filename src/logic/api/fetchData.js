import { useEffect, useRef, useState } from 'react'
import AbstractSubmission from '../../models/AbstractSubmission'


const useGetAbstractSubmission = (id) => {
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

export { useGetAbstractSubmission }