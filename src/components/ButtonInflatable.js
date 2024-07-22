import React, { useLayoutEffect, useRef } from 'react'
import './ButtonInflatable.css'
const ButtonInflatable = ({ label = '', className, children, ...props }) => {
  const labelRef = useRef(null)

  useLayoutEffect(() => {
    if (labelRef.current) {
      labelRef.current.style.width = `${labelRef.current.scrollWidth}px`
    }
    labelRef.current.innerText = label
    labelRef.current.style.width = label.length + 'ch'
  }, [label])

  return (
    <button {...props} className={`ButtonInflatable ${className}`}>
      {children}
      <div ref={labelRef} className="ButtonInflatable__label"></div>
    </button>
  )
}
export default ButtonInflatable
