import './Button.css'

import { ButtonProps } from './interface'

const Button = ({ text, type, variant, onClick, style, dataTestId = '' }: ButtonProps) => {
  return (
    <button
      type={type}
      className={`default-button ${variant}`}
      onClick={onClick}
      data-testid={dataTestId}
      style={style}
    >
      {text}
    </button>
  )
}

export default Button
