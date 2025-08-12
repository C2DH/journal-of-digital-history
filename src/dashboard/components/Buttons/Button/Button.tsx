import './Button.css'

import { ButtonProps } from './interface'

const Button = ({ text, type, color, onClick }: ButtonProps) => {
  return (
    <button type={type} className={`default-button ${color}`} onClick={onClick}>
      {text}
    </button>
  )
}

export default Button
