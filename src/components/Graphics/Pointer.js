import React from 'react'

const Pointer = ({ x, y, width, height, availableWidth, availableHeight, children }) => {
  return (
    <div className="Pointer" style={{
      top: 0,
      transform: `translate(${x}px, 0px)`,
      height,
      width,
      background: 'var(--accent)',
      zIndex:100,
    }}>
      <div class="position-absolute" style={{
        transform: `translate(0px, ${y}px)`
      }}>
        {children}
      </div>
    </div>
  )
}

export default Pointer
