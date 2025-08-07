import './DropdownMenu.css'

import ArrowDownInCircle from '../../../assets/icons/ArrowDownInCircle'

const DropdownMenu = ({ options, value, onChange }) => {
  return (
    <div className="dropdown-menu">
      <div className="dropdown-wrapper">
        <select
          className="dropdown-select"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        <ArrowDownInCircle className="dropdown-icon" width="20px" />
      </div>
    </div>
  )
}

export default DropdownMenu
