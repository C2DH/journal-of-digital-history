export type ButtonProps = {
  text: string
  type?: 'button' | 'submit' | 'reset'
  color?: string
  onClick?: () => void
}
