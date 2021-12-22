import React from 'react'
import {Link} from 'react-feather'

const ArticleToCBookmark = ({ onClick, style, children }) => {
  return(
    <div className="ArticleToCBookmark p-0 position-absolute pointer-events-auto border-top border-secondary" style={{
      ...style,
      width: 35,
      height: 1,
      right: 10,
      backgroundColor: 'var(--dark)',

    }}>
    <div
      onClick={onClick}
      className="pill text-center text-white"
      style={{
        position: 'absolute',
        top: -10,
        right: -5,
        height: 20,
        width: 20,
        lineHight: '20px',
        fontSize: '10px',
        backgroundColor: 'var(--dark)',
        cursor: 'pointer'
      }}
    >{children ? children : <Link size={14}/>}</div>
  </div>
  )
}

export default ArticleToCBookmark
