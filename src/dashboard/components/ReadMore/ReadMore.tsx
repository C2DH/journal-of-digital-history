import './ReadMore.css'

import { useState } from 'react'

const ReadMore = ({ text, maxLength = 100 }) => {
  const [isExpanded, setIsExpanded] = useState(false)

  const toggleReadMore = () => {
    setIsExpanded(!isExpanded)
  }

  const displayText = isExpanded ? text : text.slice(0, maxLength)

  return (
    <div className="read-more">
      <p>
        {displayText}
        {text.length > maxLength && !isExpanded && '...'}
      </p>
      {text.length > maxLength && (
        <button onClick={toggleReadMore} className="read-more-button">
          {isExpanded ? 'less' : 'more'}
        </button>
      )}
    </div>
  )
}

export default ReadMore
