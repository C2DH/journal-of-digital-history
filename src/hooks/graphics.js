import { useRef, useState, useEffect} from 'react'


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
