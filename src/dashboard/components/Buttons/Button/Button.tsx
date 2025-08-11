import './Button.css'

type ButtonProps = {
  text: string
  type?: 'button' | 'submit' | 'reset'
  color?: string
  onClick?: () => void
}

const Button = ({ text, type, color, onClick }: ButtonProps) => {
  return (
    <button type={type} className={`default-button ${color}`} onClick={onClick}>
      {text}
    </button>
  )
}

export default Button
