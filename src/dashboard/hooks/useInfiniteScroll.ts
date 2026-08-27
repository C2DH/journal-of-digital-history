import { useEffect, useRef } from 'react'

export function useInfiniteScroll(
  ref: React.RefObject<Element | null>,
  callback: () => void,
  enabled: boolean | undefined,
  deps: any[] = [],
  delay: number,
) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (!enabled) return

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]

        if (entry.isIntersecting) {
          // Start timer when element becomes visible
          timerRef.current = setTimeout(() => {
            callback()
          }, delay)
        } else {
          // Cancel timer if element scrolls out of view before delay
          if (timerRef.current) {
            clearTimeout(timerRef.current)
            timerRef.current = null
          }
        }
      },
      {
        threshold: 1, // Trigger when just 100% is visible
        rootMargin: '0px 0px -50px 0px', // Preload 50px after bottom
      },
    )

    const current = ref.current
    if (current) {
      observer.observe(current)
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }
      if (current) {
        observer.unobserve(current)
      }
      observer.disconnect()
    }
  }, [ref, callback, enabled, delay, ...deps])
}
