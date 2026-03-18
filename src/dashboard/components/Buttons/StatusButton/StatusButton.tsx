import { useRef, useState } from 'react'

import { useClick } from '../../../hooks/useClick'
import Dropdown from '../../Dropdown/Dropdown'
import Status from '../../Status/Status'

const actions = ['Published', '']

const StatusButton = ({ value }: { value: string }) => {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useClick(ref, setOpen, open)

  return (
    <div ref={ref}>
      <Status value={String(value)} />
      {open && <Dropdown actions={actions} setOpen={setOpen} />}
    </div>
  )
}

export default StatusButton
