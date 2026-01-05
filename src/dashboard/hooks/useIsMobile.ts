import { useEffect } from 'react'

export function useIsMobile(setIsMobile: (isMobile: boolean) => void) {
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 767)
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])
}
