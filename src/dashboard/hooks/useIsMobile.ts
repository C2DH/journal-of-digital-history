// Source - https://stackoverflow.com/
// Posted by ians19
// Retrieved 2025-12-05, License - CC BY-SA 4.0

import { useEffect, useState } from 'react'

const DEFAULT_MOBILE_BREAKPOINT = 1000

export const useIsMobile = (breakpoint = DEFAULT_MOBILE_BREAKPOINT) => {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const onResize = () => {
      setIsMobile(window.innerWidth < breakpoint)
    }
    window.addEventListener('resize', onResize)
    onResize()
    return () => window.removeEventListener('resize', onResize)
  }, [])
  return isMobile
}
