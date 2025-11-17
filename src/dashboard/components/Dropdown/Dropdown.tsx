import './Dropdown.css'

import { useTranslation } from 'react-i18next'

import { DropdownProps } from './interface'

const Dropdown = ({ actions, setOpen }: DropdownProps) => {
  const { t } = useTranslation()

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
          {t(action.label)}
        </button>
      ))}
    </div>
  )
}

export default Dropdown
