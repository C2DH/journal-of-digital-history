import React from 'react'

import { useHistory } from 'react-router-dom'
import { RoleHidden } from '../../constants'

const ArticleTocLine = ({ steps, step, active, headingsPositions }) => {
  const history = useHistory()
  const handleClick = (idx) => {
    // check ArticleText component. Each Sscrollama step has an identifier
    // that identifies the non hidden cell using the ArticleCell `idx` property
    // It is prefixed with `C-``
    history.push(`#C-${idx}`)
  }
  let previousHeadingIdx = -1;
  let nextHeadingIdx = -1;
  //
  for(let i = 0; i < headingsPositions.length; i++) {
    if (headingsPositions[i] <= step) {
      previousHeadingIdx = headingsPositions[i]
    } else if (nextHeadingIdx === -1 && headingsPositions[i] > step) {
      nextHeadingIdx = headingsPositions[i]
    } else {
      break
    }
  }
  console.info('previousHeadingIdx', previousHeadingIdx, 'nextHeadingIdx', nextHeadingIdx,headingsPositions, step)
  return (
    <>
    {steps.map((d,i) => {
      if (d.type === 'group' || d.role === RoleHidden) {
        return null
      }
      if (steps.length > 50 && !['H1', 'H2', 'H3'].includes(d.level)) {
        return null
      }
      const levelClassName = `ArticleToc_Level_${d.level}`
      const typeClassName = `ArticleToc_Type_${d.type}`
      // let inbetweenHeadingsClassName = ''
      // if (d.isHeading && nextHeadingIdx === -1 && i > step) {
      //   inbetweenHeadingsClassName = 'ArticleToc_afterNextHeading'
      // }
      const inbetweenHeadingsClassName = d.idx < previousHeadingIdx
        ? 'ArticleToc_beforePreviousHeading'
        :  parseInt(d.idx) < nextHeadingIdx
          ? 'ArticleToc_beforeNextHeading'
          : 'ArticleToc_afterNextHeading'
      return (
        <div key={i}
          onClick={() => handleClick(d.idx) }
          className={`my-3 position-relative ${levelClassName} ${typeClassName} ${inbetweenHeadingsClassName}`}
          style={{
            backgroundColor: d.idx < step
              ? 'var(--secondary)'
              : d.idx === step
                ? 'var(--primary)'
                : 'transparent',
            border: '1px solid',
          }}
          >
          {d.heading
            ? <div className={`position-absolute ArticleToc_Heading ${previousHeadingIdx === d.idx ? 'active' : null}`}>{d.heading.content}</div>
            : null
          }
          <div className="position-absolute" style={{left: 15, top:0, lineHeight: '5px'}}>
            {d.idx===step && <span>&larr;</span>}
            {!!d.references.length && <div className="position-absolute ArticleToc_References" style={{left: -7, top:0}} />}
          </div>
        </div>
      )
    })}
    </>
  )

}

const MemoizedArticleTocLine = React.memo(ArticleTocLine);

const ArticleToC = ({ steps, step, active, headingsPositions }) => {
  return (
  <MemoizedArticleTocLine
    steps={steps}
    step={active ? step : -1}
    headingsPositions={headingsPositions}
  />)
}


export default ArticleToC
