import React from 'react'


const ArticleCellContent = ({
  idx, className='',
  content,
  num,
  layer,
  hideNum=false,
  hideIdx=true,
  headingLevel=0,
  onNumClick,
}) => {
  const numClassNames = [
    headingLevel > 0 ? `level_H${headingLevel}`: '',
    typeof onNumClick === 'function'? 'selectable': ''
  ].join(' ')
  const onClickHandler = (e) => {
    if (typeof onNumClick === 'function') {
      onNumClick(e, { idx, layer })
    }
  }
  return (
    <div className={`ArticleCellContent ${className}`}>
      {!hideIdx && (<div className="ArticleCellContent_idx">{idx}</div>)}
      {!hideNum && (
        <div className={`ArticleCellContent_num ${numClassNames}`} onClick={onClickHandler}
        >
          {num}
        </div>
      )}
      <div dangerouslySetInnerHTML={{__html: content}}></div>
    </div>
  )
}

export default React.memo(ArticleCellContent)
