import { useEffect, useState } from 'react'

export function useTooltipPlacement() {
  const [tooltipPlacement, setTooltipPlacement] = useState<'auto' | 'right'>('right')

  useEffect(() => {
    const updatePlacement = () => {
      if (window.innerWidth < 768) {
        setTooltipPlacement('auto')
      } else {
        setTooltipPlacement('right')
      }
    }
    updatePlacement()
    window.addEventListener('resize', updatePlacement)
    return () => {
      window.removeEventListener('resize', updatePlacement)
    }
  }, [])

  return tooltipPlacement
}
