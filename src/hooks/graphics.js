import { useRef, useState, useEffect, useCallback, useLayoutEffect } from 'react'

/**
 * Calculate available rectangle for the given ref.
 * usage inside functional components:
 *
 *     const [bbox, ref] = useBoundingClientRect()
 *     return (<div ref="ref"></div>)
 */
export const useBoundingClientRect = () => {
  const ref = useRef()
  const [bbox, setBbox] = useState({
    width: 0,
    height: 0,
    windowDimensions: '0x0',
  })
  const setCurrentBoundingClientRect = () => {
    const boundingClientRect =
      ref && ref.current
        ? ref.current.getBoundingClientRect()
        : { width: 0, height: 0, windowDimensions: '0x0' }
    const windowDimensions = `${boundingClientRect.width}x${boundingClientRect.height}`
    if (windowDimensions !== bbox.windowDimensions) {
      // extract one dimension by one dimension, the only way
      // as the result of el.getBoundingClientRect() returns a special object
      // of type ClientRect (or DomRect apparently)
      const { top, right, bottom, left, width, height, x, y } = boundingClientRect
      setBbox({
        top,
        right,
        bottom,
        left,
        width,
        height,
        x,
        y,
        windowDimensions,
      })
    }
  }
  useLayoutEffect(() => {
    setCurrentBoundingClientRect()
    window.addEventListener('resize', setCurrentBoundingClientRect)
    return () => window.removeEventListener('resize', setCurrentBoundingClientRect)
  })
  return [bbox, ref]
}

const getWidth = () =>
  window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth

const getHeight = () =>
  window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight

const getWindowDimensions = () => ({
  width: getWidth(),
  height: getHeight(),
})

/*
  Based on
  https://dev.to/vitaliemaldur/resize-event-listener-using-react-hooks-1k0c
  consulted on 2021-02-26
*/
export const useCurrentWindowDimensions = () => {
  let [windowDimensions, setWindowDimensions] = useState(getWindowDimensions())
  useEffect(() => {
    let timeoutId = null
    const resizeListener = () => {
      clearTimeout(timeoutId)
      const dims = getWindowDimensions()
      timeoutId = setTimeout(() => setWindowDimensions(dims), 150)
      // console.info('setWindowDimensions', dims)
    }
    window.addEventListener('resize', resizeListener)

    return () => {
      window.removeEventListener('resize', resizeListener)
    }
  }, [])
  return windowDimensions
}

/*
  Based on https://gist.github.com/whoisryosuke/99f23c9957d90e8cc3eb7689ffa5757c
  consulted on 2021-02-26
  usage in components:
  const { x, y } = useMousePosition();
*/
export function useMousePosition() {
  const [mousePosition, setMousePosition] = useState({
    x: null,
    y: null,
    isValid: false,
  })
  const updateMousePosition = (ev) => {
    if (!ev) {
      return
    }
    setMousePosition({ x: ev.clientX, y: ev.clientY, isValid: true, event: ev })
  }
  useEffect(() => {
    window.addEventListener('mousemove', updateMousePosition)
    return () => window.removeEventListener('mousemove', updateMousePosition)
  }, [])
  return mousePosition
}

/**
 * @method useOnScreen
 * Based on https://stackoverflow.com/questions/45514676/react-check-if-element-is-visible-in-dom
 * consulted on 2021-04-26
 *
 * Possible values: entry.boundingClientRect
 * entry.intersectionRatio
 * entry.intersectionRect, entry.isIntersecting, entry.rootBounds,
 * entry.target,
 * entry.time
 * usage
 *   const [entry, ref] = useOnScreen()
 *   <div ref={ref}>trigger {entry.isIntersecting? 'visisble': 'not visible'}</div>
 *
 */
export function useOnScreen({ threshold = [0, 1], rootMargin = '0% 0% 0% 0%' } = {}) {
  const ref = useRef()
  const [entry, setEntry] = useState({
    intersectionRatio: 0, // this avoid entry is null error
    isIntersecting: false,
  })
  const observer = new IntersectionObserver(
    ([b]) => {
      // add debounce
      setEntry(b)
    },
    {
      threshold,
      rootMargin,
    },
  )
  useEffect(() => {
    observer.observe(ref.current, { threshold })
    // Remove the observer as soon as the component is unmounted
    return () => {
      observer.disconnect()
    }
    // eslint-disable-next-line
  }, [])

  useEffect(() => {
    function refreshIntersectionObserverHandler() {
      if (ref && ref.current) {
        observer.disconnect()
        observer.observe(ref.current, { threshold })
      }
    }
    window.addEventListener('refreshIntersectionObserver', refreshIntersectionObserverHandler)
    // Remove the observer as soon as the component is unmounted
    return () => {
      window.removeEventListener('refreshIntersectionObserver', refreshIntersectionObserverHandler)
      observer.disconnect()
    }
    // eslint-disable-next-line
  }, [])
  return [entry, ref]
}

/**
 * @method useRefWithCallback
 * Guarantees that the DOM is ready before calling the
 * onMount callback.
 * Usage:
 * ```
 * const refWithCallback = useRefWithCallback(...)
 *
 * return (
 *   <div ref={refWithCallback}> ...</div>
 * )
 * ```
 * @return
 */
export function useRefWithCallback(onMount, onUnmount) {
  const nodeRef = useRef(null)
  const setRef = useCallback(
    (node) => {
      if (nodeRef.current && typeof onUnmount === 'function') {
        onUnmount(nodeRef.current)
      }
      nodeRef.current = node
      if (nodeRef.current && typeof onMount === 'function') {
        onMount(nodeRef.current)
      }
    },
    [onMount, onUnmount],
  )
  return setRef
}

export function useInjectTrustedJavascript({
  id = '',
  isTrusted = false,
  contents = [],
  onMount,
  onUnmount,
}) {
  const setRefWithCallback = useRefWithCallback(
    (node) => {
      if (isTrusted && contents.length) {
        console.debug('useInjectTrustedJavascript', id, contents.length)
        let scriptDomElement = document.getElementById(id)
        if (scriptDomElement === null) {
          const script = document.createElement('script')
          script.setAttribute('id', id)
          script.appendChild(
            document.createTextNode(
              [
                'try{',
                ...contents,
                '} catch(e) { console.error("Error inside the script attached useInjectTrustedJavascript!\\n\\n", e)}',
              ].join('\n'),
            ),
          )
          try {
            node.appendChild(script)
          } catch (e) {
            console.error(e)
          }
        } else {
          console.debug('script already attached, upgrade it...')
          scriptDomElement.innerHTML = [
            'try{',
            ...contents,
            '} catch(e) { console.error("Error inside the script attached useInjectTrustedJavascript!\\n\\n", e)}',
          ].join('\n')
        }
      }
      if (node && typeof onMount === 'function') {
        onMount(node)
      }
    },
    (node) => {
      if (isTrusted && contents.length) {
        let scriptDomElement = document.getElementById(id)
        try {
          node.removeChild(scriptDomElement)
        } catch (e) {
          console.warn('document.body.removeChild failed with id:', id, e.message)
        }
        if (node && typeof onUnmount === 'function') {
          onUnmount(node)
        }
      }
    },
  )

  return setRefWithCallback
}

export const useImage = ({ src, initialize = true, delay = 1000 }) => {
  const consumed = useRef(false)
  const [result, setResult] = useState({
    isLoading: false,
    isLoaded: false,
    error: null,
    hasStartedInitialFetch: false,
  })

  useEffect(() => {
    if (!initialize || !src || src.length === 0) {
      console.debug('[useImage] not initialized or src is empty.')
      return
    }
    if (consumed.current === src) {
      console.debug('[useImage] already loaded...')
      return
    }
    setResult({
      isLoading: true,
      isLoaded: false,
      error: null,
      hasStartedInitialFetch: true,
    })
    console.debug('[useImage] @useEffect start fetching...')
    // Here's where the magic happens.
    const image = new Image()

    consumed.current = src
    let timer1 = setTimeout(() => {
      image.src = src
    }, delay)

    const handleError = (err) => {
      setResult({
        isLoading: true,
        isLoaded: false,
        error: err,
        hasStartedInitialFetch: true,
      })
    }

    const handleLoad = () => {
      setResult({
        isLoading: false,
        isLoaded: true,
        error: null,
        hasStartedInitialFetch: false,
      })
    }

    image.onerror = handleError
    image.onload = handleLoad

    return () => {
      clearTimeout(timer1)
      image.removeEventListener('error', handleError)
      image.removeEventListener('load', handleLoad)
    }
  }, [src, initialize, delay])

  return result
}
