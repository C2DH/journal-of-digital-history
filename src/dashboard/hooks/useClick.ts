import { useEffect } from 'react'

/**
 * Closes the dropdown when clicking outside of it
 * @param ref - React ref to the dropdown element
 * @param setOpen - Set the status of the dropdown menu
 * @param open - Give the status of the dropdown : opened(true) or closed(false)
 */
export function useClick(
  ref: React.RefObject<Element | null>,
  setOpen: (value: boolean) => void,
  open: boolean,
) {
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    if (open) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [open])
}
