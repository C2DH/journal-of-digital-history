import React from 'react'

const Pointer = ({
  x, y,
  width, height,
  availableWidth, availableHeight,
  horizontal=true,
  children
}) => {
  return (
    <div className="Pointer" style={{
      top: 0,
      transform: horizontal
        ? `translate(${x}px, 0px)`
        : `translate(0px, ${y}px)`,
      height,
      width,
      background: 'var(--accent)',
      zIndex:100,
      pointerEvents: 'none'
    }}>
      <div className="position-absolute" style={{
        transform: horizontal
          ? `translate(0px, ${y}px)`
          : `translate(${x}px, 0px)`
      }}>
        {children}
      </div>
    </div>
  )
}

export default Pointer
