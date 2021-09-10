import React from 'react'

const ArticleKeywords = ({ keywords = []}) => {
  return (
    <div className="ArticleKeywords mb-3">
      {keywords.map((keyword, i) => (
        <span key={i}>
        <em>{keyword}</em>
        {i < keywords.length - 1 && <span>&nbsp;&bull;&nbsp;</span>}
        </span>
      ))}
    </div>
  )
}

export default ArticleKeywords
