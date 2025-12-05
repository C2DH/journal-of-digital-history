import './Button.css'

import { ButtonProps } from './interface'

const Button = ({
  text,
  className,
  form,
  type,
  variant,
  onClick,
  style,
  dataTestId = '',
}: ButtonProps) => {
  return (
    <button
      type={type}
      form={form}
      className={`default-button ${variant} ${className}`}
      onClick={onClick}
      data-testid={dataTestId}
      style={style}
    >
      {text}
    </button>
  )
}

export default Button
