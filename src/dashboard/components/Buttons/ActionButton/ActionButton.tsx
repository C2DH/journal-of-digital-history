import { useEffect, useRef, useState } from 'react'
import './ActionButton.css'

type Action = {
  label: string
  onClick: () => void
}

type ActionButtonProps = {
  actions: Action[]
}

const ActionButton = ({ actions }: ActionButtonProps) => {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

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

  return (
    <div className="action-btn-wrapper" ref={ref}>
      <button
        className="action-btn"
        onClick={() => setOpen((prev) => !prev)}
        aria-label="Actions"
        type="button"
      >
        {/* <span className="action-dot"> ... </span> */}
      </button>
    </div>
  )
}

export default ActionButton
