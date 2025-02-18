import React from 'react'
import '../../styles/components/Article/ArticleKeywords.css'

const ArticleKeywords = ({ keywords = [], className = '' }) => {
  return (
    <div className={`ArticleKeywords mb-3 ${className}`}>
      {keywords.map((keyword, i) => (
        <span className="ArticleKeywords_keyword" key={i}>
          {keyword}
        </span>
      ))}
    </div>
  )
}

export default ArticleKeywords
