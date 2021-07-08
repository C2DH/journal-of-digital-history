import React from 'react'
import ArticleCell from './ArticleCell'


const ArticleCellWrapper = ({ cell, id, memoid, numCell, ...rest }) => {
  return (
    <div id={id}
      className={`ArticleCellWrapper ArticleStream_paragraph`}
      {...rest}
    >
      <ArticleCell
        memoid={memoid}
        {...cell}
        num={numCell}
        idx={cell.idx}
      />
    </div>
  )
}

export default ArticleCellWrapper
