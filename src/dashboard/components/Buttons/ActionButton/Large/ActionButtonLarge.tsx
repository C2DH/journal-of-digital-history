import './ActionButtonLarge.css'

import { NavArrowDown, NavArrowUp } from 'iconoir-react'
import { useEffect, useRef, useState } from 'react'

import Dropdown from '../../../Dropdown/Dropdown'
import { ActionButtonProps } from '../interface'

const ActionButtonLarge = ({ actions }: ActionButtonProps) => {
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
    <div className={`large-action-btn-wrapper`} ref={ref}>
      <button
        className={`large-action-btn`}
        onClick={() => setOpen((prev) => !prev)}
        type="button"
        data-testid="large-action-button"
      >
        Actions
        {open ? <NavArrowUp /> : <NavArrowDown />}
      </button>
      {open && <Dropdown actions={actions} setOpen={setOpen} />}
    </div>
  )
}

export default ActionButtonLarge
