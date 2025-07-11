import './Dropdown.css'

import { DropdownProps } from './interface'

const Dropdown = ({ actions, setOpen }: DropdownProps) => {
  return (
    <div className="action-dropdown">
      {actions.map((action, idx) => (
        <button
          key={action.label}
          className="action-dropdown-item"
          onClick={() => {
            setOpen(false)
            action.onClick()
          }}
          type="button"
        >
          {action.label}
        </button>
      ))}
    </div>
  )
}

export default Dropdown
