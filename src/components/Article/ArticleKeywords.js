import React from 'react'

const ArticleKeywords = ({ keywords=[], className=''}) => {
  return (
    <div className={`ArticleKeywords mb-3 ${className}`}>
      {keywords.map((keyword, i) => (
        <span key={i}>
        <em>{keyword}</em>
        {i < keywords.length - 1 && <span> &bull; </span>}
        </span>
      ))}
    </div>
  )
}

export default ArticleKeywords
