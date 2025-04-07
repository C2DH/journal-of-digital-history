import React from 'react'
import { Button } from 'react-bootstrap'

const CloseButtonItem = ({
  index,
  onRemove,
}: {
  index: number
  onRemove: (index: number) => void
}) => {
  return (
    <Button
      size="sm"
      className="d-block rounded-circle border-dark border p-0 m-3"
      style={{ height: '25px', width: '25px', lineHeight: '23px' }}
      variant="warning"
      onClick={() => onRemove(index)}
    >
      ✕
    </Button>
  )
}

export default CloseButtonItem
