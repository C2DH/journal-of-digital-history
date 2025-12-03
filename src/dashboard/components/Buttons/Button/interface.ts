import React from 'react'

export type ButtonProps = {
  text: string
  form: string
  type?: 'button' | 'submit' | 'reset'
  variant?: 'primary' | 'secondary' | 'tertiary'
  onClick?: () => void
  style?: React.CSSProperties
  dataTestId?: string
}
