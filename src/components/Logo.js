import React from 'react'
const Logo = ({ color = 'black', size=50, ...rest }) => {
  return (
    <div className="Logo" {...rest}>
      <svg className="position-absolute top-0" xmlns="http://www.w3.org/2000/svg" height={size} viewBox="0 0 150 100">
        <rect x="70" y="50" width="10" height="10" rx="5" />
        <path fill={color} d="M130,40H120V20H100V10H70V30H60V20H30V50H10V90H60V80H90V90h50V40ZM40,80H20V60H30V70H40V30H50V80ZM80,70H60V40H80V20H90V70Zm50-10V80H120V60H110V80H100V30h10V50h20Z"/>
      </svg>
    </div>
  )
}

export default Logo
