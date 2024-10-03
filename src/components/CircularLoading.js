import React from 'react'
import './CircularLoading.css'

const CircularLoading = ({ width = 16, height = 16, strokeWidth = 1.5 }) => {
  return (
    <svg
      className="CircularLoading"
      fill="none"
      strokeWidth={strokeWidth * 4}
      strokeLinecap="round"
      viewBox="0 0 100 100"
      width={width}
      height={height}
      color="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strikethroughThickness={0}
        stroke="currentColor"
        d="M 50 96 a 46 46 0 0 1 0 -92 46 46 0 0 1 0 92"
      />
    </svg>
  )
}

export default CircularLoading
