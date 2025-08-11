import './Button.css'

type ButtonProps = {
  type: 'button' | 'submit' | 'reset'
  text: string
  color?: string
}

const Button = ({ type, text, color }: ButtonProps) => {
  return (
    <button className={`default-button ${color}`} type={type}>
      {text}
    </button>
  )
}

export default Button
