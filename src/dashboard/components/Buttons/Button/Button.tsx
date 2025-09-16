import './Button.css'

import { ButtonProps } from './interface'

const Button = ({ text, type, variant, onClick }: ButtonProps) => {
  return (
    <button type={type} className={`default-button ${variant}`} onClick={onClick}>
      {text}
    </button>
  )
}

export default Button
