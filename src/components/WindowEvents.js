import { useEffect } from 'react'
import { debounce } from '../logic/viewport'
import { useWindowStore } from '../store'
const setScrollPosition = useWindowStore.getState().setScrollPosition
const setWindowDimensions = useWindowStore.getState().setWindowDimensions
/**
 * React hook that reacts to window resize and scrolling events, and implements debounce to prevent too many calls for both events.
 * @param {Object} options - An object containing optional parameters.
 * @param {number} options.debounceTime - The time in milliseconds to wait before executing the callback function after the last event.
 * @param {boolean} options.debounceResize - Whether to debounce the window resize event.
 * @param {boolean} options.debounceScroll - Whether to debounce the window scroll event.
 * @returns {Object} - An object containing the window dimensions and scroll position.
 */
const WindowEvents = ({ debounceTime = 150, debounceResize = true, debounceScroll = true }) => {
  /**
   * This React component reacts to window resize event and scrolling event. it implements debounce to prevent too many calls for both events and store the results in the useWindowStore.
   */
  useEffect(() => {
    const handleResize = debounce(() => {
      console.debug(
        '[WindowEvents] debounced resize',
        '\n - window.innerWidth',
        window.innerWidth,
        '\n - window.innerHeight',
        window.innerHeight,
      )
      setWindowDimensions(window.innerWidth, window.innerHeight)
    }, debounceTime)
    const handleScroll = debounce(() => {
      console.debug(
        '[WindowEvents] debounced scroll',
        '\n - window.scrollX',
        window.scrollX,
        '\n - window.scrollY',
        window.scrollY,
      )
      setScrollPosition(window.scrollX, window.scrollY)
    }, debounceTime)
    if (debounceResize) {
      window.addEventListener('resize', handleResize)
    } else {
      window.addEventListener('resize', () => {
        setWindowDimensions(window.innerWidth, window.innerHeight)
      })
    }
    if (debounceScroll) {
      window.addEventListener('scroll', handleScroll)
    } else {
      window.addEventListener('scroll', () => {
        setScrollPosition(window.scrollX, window.scrollY)
      })
    }
    return () => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [debounceTime, debounceResize, debounceScroll])

  return null
}

export default WindowEvents
