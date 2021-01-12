import React from 'react'

const Pointer = ({ x, y, width, height, availableWidth, availableHeight, children }) => {
  return (
    <div className="Pointer" style={{
      transform: `translate(${x}px, ${y}px)`,
      height
    }}>
      {children}
    </div>
  )
}

export default Pointer
