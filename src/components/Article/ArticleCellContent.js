import React from 'react'


const ArticleCellContent = ({ idx, className='', content, num, hideNum=false, hideIdx=true, headingLevel=0}) => {
  return (
    <div className={`ArticleCellContent ${className}`}>
      {!hideIdx && (<div className="ArticleCellContent_idx">{idx}</div>)}
      {!hideNum && (<div className={`ArticleCellContent_num ${headingLevel > 0? `level_H${headingLevel}`:''}`}>{num}</div>)}
      <div dangerouslySetInnerHTML={{__html: content}}></div>
    </div>
  )
}

export default React.memo(ArticleCellContent)
