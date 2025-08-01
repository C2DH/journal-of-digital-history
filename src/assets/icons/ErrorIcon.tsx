import { WarningCircleSolid } from 'iconoir-react'
import React from 'react'

const ErrorIcon = (props: React.ComponentProps<typeof WarningCircleSolid>) => (
  <WarningCircleSolid width={'24px'} {...props} />
)

export default ErrorIcon
