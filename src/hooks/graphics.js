import { useRef, useState, useEffect} from 'react'

/**
 * Calculate available rectangle for the given ref.
 * usage inside functional components:
 *
 *     const [bbox, ref] = useBoundingClientRect()
 *     return (<div ref="ref"></div>)
 */
export const useBoundingClientRect = () => {
  const ref = useRef();
  const [bbox, setBbox] = useState({
    width: 0, height: 0, windowDimensions: '0x0'
  });
  const setCurrentBoundingClientRect = () => {
    const boundingClientRect = ref && ref.current
      ? ref.current.getBoundingClientRect()
      : { width: 0, height: 0, windowDimensions: '0x0' }
    const windowDimensions = `${boundingClientRect.width}x${boundingClientRect.height}`
    if (windowDimensions !== bbox.windowDimensions) {
      // extract one dimension by one dimension, the only way
      // as the result of el.getBoundingClientRect() returns a special object
      // of type ClientRect (or DomRect apparently)
      const {top, right, bottom, left, width, height, x, y} = boundingClientRect
      setBbox({
        top, right, bottom, left, width, height, x, y,
        windowDimensions,
      })
    }
  };
  useEffect(() => {
    setCurrentBoundingClientRect()
    window.addEventListener('resize', setCurrentBoundingClientRect);
    return () => window.removeEventListener('resize', setCurrentBoundingClientRect);
  });
  return [bbox, ref];
};

const getWidth = () => window.innerWidth
  || document.documentElement.clientWidth
  || document.body.clientWidth;

const getHeight = () => window.innerHeight
    || document.documentElement.clientHeight
    || document.body.clientHeight;

const getWindowDimensions = () => ({
  width: getWidth(),
  height: getHeight()
})

/*
  Based on
  https://dev.to/vitaliemaldur/resize-event-listener-using-react-hooks-1k0c
  consulted on 2021-02-26
*/
export const useCurrentWindowDimensions = () => {
  let [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());
  useEffect(() => {
    let timeoutId = null;
    const resizeListener = () => {
      clearTimeout(timeoutId);
      const dims = getWindowDimensions()
      timeoutId = setTimeout(() => setWindowDimensions(dims), 150);
      console.info('setWindowDimensions', dims)
    };
    window.addEventListener('resize', resizeListener);

    return () => {
      window.removeEventListener('resize', resizeListener);
    }
  }, [])
  return windowDimensions;
}


/*
  Based on https://gist.github.com/whoisryosuke/99f23c9957d90e8cc3eb7689ffa5757c
  consulted on 2021-02-26
  usage in components:
  const { x, y } = useMousePosition();
*/
export function useMousePosition() {
  const [mousePosition, setMousePosition] = useState({ x: null, y: null, isValid: false });
  const updateMousePosition = ev => {
    if (!ev) {
      return
    }
    setMousePosition({ x: ev.clientX, y: ev.clientY, isValid: true, event: ev });
  };
  useEffect(() => {
    window.addEventListener("mousemove", updateMousePosition);
    return () => window.removeEventListener("mousemove", updateMousePosition);
  }, []);
  return mousePosition;
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
export function useOnScreen({ threshold = [0, 1], rootMargin='0% 0% 0% 0%'} = {}) {
  const ref = useRef();
  const [entry, setEntry] = useState({
    intersectionRatio: 0, // this avoid entry is null error
    isIntersecting: false,
  })
  const observer = new IntersectionObserver(([b]) => {
    setEntry(b)
  }, {
    threshold,
    rootMargin
  })
  useEffect(() => {
    observer.observe(ref.current, { threshold })
    // Remove the observer as soon as the component is unmounted
    return () => { observer.disconnect() }
    // eslint-disable-next-line
  }, [])
  return [entry, ref];
}
