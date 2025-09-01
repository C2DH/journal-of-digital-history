import './Checkbox.css'

import { CheckboxProps } from './interface'

const Checkbox = ({ checked, onChange, disabled, isHeader }: CheckboxProps) => (
  <label className={`checkbox-root${disabled ? ' disabled' : ''} `}>
    <input
      type="checkbox"
      className="checkbox-input"
      checked={checked}
      disabled={disabled}
      onChange={(e) => onChange(e.target.checked)}
    />
    <span className={`checkbox-custom ${isHeader ? ' header' : ''}`} />
  </label>
)

export default Checkbox
