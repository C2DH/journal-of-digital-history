import React from 'react'


const ArticleCellContent = React.memo(({ idx, content, num, layer, className, hideNum=false, hideIdx=true}) => {
  return (
    <div className="ArticleCellContent">
      {!hideIdx && (<div className="ArticleCellContent_idx">{idx}</div>)}
      {!hideNum && (<div className="ArticleCellContent_num">{num}</div>)}
      <div dangerouslySetInnerHTML={{__html: content}}></div>
    </div>
  )
})

export default ArticleCellContent
