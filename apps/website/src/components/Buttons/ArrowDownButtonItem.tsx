import React from 'react'
import { Button } from 'react-bootstrap'

const ArrowUpButtonItem = ({
  index,
  moveItem,
}: {
  index: number
  moveItem: (fromIndex: number, toIndex: number) => void
}) => {
  return (
    <Button
      size="sm"
      className="d-block rounded-circle p-0 m-3"
      style={{ height: '25px', width: '25px', lineHeight: '25px' }}
      variant="secondary"
      onClick={() => moveItem(index, index + 1)}
    >
      ↓
    </Button>
  )
}

export default ArrowUpButtonItem
