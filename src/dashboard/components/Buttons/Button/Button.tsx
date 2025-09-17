import './Button.css'

import { ButtonProps } from './interface'

const Button = ({ text, type, variant, onClick, dataTestId = '' }: ButtonProps) => {
  return (
    <button
      type={type}
      className={`default-button ${variant}`}
      onClick={onClick}
      data-testid={dataTestId}
    >
      {text}
    </button>
  )
}

export default Button
