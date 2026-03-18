import './ActionButton.css'

import { MoreHoriz } from 'iconoir-react'
import { useRef, useState } from 'react'

import { useClick } from '../../../../hooks/useClick'
import Dropdown from '../../../Dropdown/Dropdown'
import { ActionButtonProps } from '../interface'

const ActionButton = ({ actions, active }: ActionButtonProps) => {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useClick(ref, setOpen, open)

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
