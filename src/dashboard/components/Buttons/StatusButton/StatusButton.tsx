import './StatusButton.css'

import { NavArrowDown, NavArrowUp } from 'iconoir-react'
import { useRef, useState } from 'react'

import { useClick } from '../../../hooks/useClick'
import Dropdown from '../../Dropdown/Dropdown'
import Status from '../../Status/Status'

const actions = [
  { label: 'published', onClick: () => console.log('published') },
  { label: 'design review', onClick: () => console.log('design review') },
  { label: 'copy editing', onClick: () => console.log('copy editing') },
  { label: 'peer review', onClick: () => console.log('peer review') },
  { label: 'tech review', onClick: () => console.log('tech review') },
]

const StatusButton = ({ value }: { value: string }) => {
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
