import './Button.css'

type ButtonProps = {
  type: 'button' | 'submit' | 'reset'
  text: string
  color?: string
}

const Button = ({ type, text, color }: ButtonProps) => {
  return (
    <button
      className="default-button"
      type={type}
      style={{ color: `${color}`, borderColor: `${color}` }}
    >
      {text}
    </button>
  )
}

export default Button
