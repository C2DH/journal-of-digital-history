import './StatusButton.css'

import { NavArrowDown, NavArrowUp } from 'iconoir-react'
import { useRef, useState } from 'react'

import { useClick } from '../../../hooks/useClick'
import Dropdown from '../../Dropdown/Dropdown'
import Status from '../../Status/Status'

const StatusButton = ({ actions, value }: { actions: any; value: string }) => {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useClick(ref, setOpen, open)

  return (
    <div className="status-button-container" ref={ref}>
      <button className="status-button-btn" type="button" onClick={() => setOpen((prev) => !prev)}>
        <Status value={String(value)} /> {open ? <NavArrowUp /> : <NavArrowDown />}
      </button>
      {open && <Dropdown actions={actions} setOpen={setOpen} />}
    </div>
  )
}

export default StatusButton
