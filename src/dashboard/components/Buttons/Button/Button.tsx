import './Button.css'

type ButtonProps = {
  type: 'button' | 'submit' | 'reset'
  text: string
}

const Button = ({ type, text }: ButtonProps) => {
  return (
    <button className="default-button" type={type}>
      {text}
    </button>
  )
}

export default Button
