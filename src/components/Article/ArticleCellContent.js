import React from 'react'


const ArticleCellContent = React.memo(({ idx, content, num, className, hideNum=false, hideIdx=false}) => {
  return (
    <div className="ArticleCellContent" id={`P${num}`}>
      {!hideNum && (<div className="ArticleCellContent_num">{num}</div>)}
      <div dangerouslySetInnerHTML={{__html: content}}></div>
    </div>
  )
})

export default ArticleCellContent
