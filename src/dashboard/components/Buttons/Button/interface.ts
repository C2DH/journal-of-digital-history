export type ButtonProps = {
  text: string
  type?: 'button' | 'submit' | 'reset'
  variant?: 'primary' | 'secondary'
  onClick?: () => void
  dataTestId?: string
}
