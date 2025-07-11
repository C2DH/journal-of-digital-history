import { MoreHoriz } from 'iconoir-react'
import { useEffect, useRef, useState } from 'react'
import './ActionButton.css'

import { ActionButtonProps } from './interface'

import Dropdown from '../../Dropdown/Dropdown'

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
      <MoreHoriz
        className={`action-icon ${open ? 'active' : ''}`}
        onClick={() => setOpen((prev) => !prev)}
        type="button"
        data-testid="action-button"
      />
      {open && <Dropdown actions={actions} setOpen={setOpen} />}
    </div>
  )
}

export default ActionButton
