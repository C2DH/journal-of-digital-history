import { WarningCircleSolid } from 'iconoir-react'
import React from 'react'

const Error = (props: React.ComponentProps<typeof WarningCircleSolid>) => (
  <WarningCircleSolid width={'24px'} {...props} />
)

export default Error
