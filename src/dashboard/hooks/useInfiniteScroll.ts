import { useEffect } from 'react'

/**
 * Triggers callback when the ref element is visible in the viewport.
 * @param ref - React ref to the loader element
 * @param callback - Function to call when the element is visible
 * @param enabled - Should the observer be active
 * @param deps - Dependency array for useEffect
 */
export function useInfiniteScroll(
  ref: React.RefObject<Element | null>,
  callback: () => void,
  enabled: boolean,
  deps: any[] = [],
) {
  useEffect(() => {
    if (!enabled) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          callback()
        }
      },
      { threshold: 1 },
    )

    const current = ref.current
    if (current) {
      observer.observe(current)
    }

    return () => {
      if (current) {
        observer.unobserve(current)
      }
      observer.disconnect()
    }
  }, [ref, callback, enabled, ...deps])
}
