import './ActionButton.css'

import { MoreHoriz } from 'iconoir-react'
import { useEffect, useRef, useState } from 'react'

import Dropdown from '../../../Dropdown/Dropdown'
import { ActionButtonProps } from '../interface'

const ActionButton = ({ actions, active }: ActionButtonProps) => {
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
        className={`action-icon ${active ? 'active' : 'inactive'}`}
        onClick={active ? () => setOpen((prev) => !prev) : undefined}
        type="button"
        data-testid="action-button"
      />
      {open && <Dropdown actions={actions} setOpen={setOpen} />}
    </div>
  )
}

export default ActionButton
