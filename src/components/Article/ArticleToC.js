import React from 'react'
import { useHistory } from 'react-router-dom'

const ArticleToc = ({ steps, progress, step }) => {
  const history = useHistory()
  const handleClick = (id) => {
    const anchor = document.getElementById(`P${id}`)
    history.push(`#P${id}`)
    if (anchor) {
      const rect = anchor.getBoundingClientRect()
      window.scrollTo(0, window.scrollY + rect.top)
    }
  }

  return (
    <div className="position-fixed" style={{
      right: 0,
      top: 30,
      width: 30,
    }}>
    {steps.filter(d => !d.hidden).map((d,i) => {
      const levelClassName = `ArticleToc_Level_${d.level}`
      const typeClassName = `ArticleToc_Type_${d.type}`
      return (
        <div onClick={() => handleClick(d.idx) }className={`my-1 position-relative ${levelClassName} ${typeClassName}`} key={i} style={{
          backgroundColor: i < step
            ? 'var(--secondary)'
            : i === step
              ? 'var(--primary)'
              : 'transparent',
          border: '1px solid',

        }}>
          <div className="position-absolute" style={{left: -15, top:0, lineHeight: '5px'}}>
            {i===step && <span>&rarr;</span>}
            {!!d.references.length && <div className="position-absolute ArticleToc_References" style={{left: 25, top:0}} />}
          </div>
        </div>
      )
    })}
    </div>
  )

}

export default ArticleToc
