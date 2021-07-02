import React from 'react'
import LangLink from '../LangLink'
import {useBoundingClientRect} from '../../hooks/graphics'


const IssueListItem = ({ issue }) => {
  const [{width: size }, ref] = useBoundingClientRect()

  return (
    <div className="IssueListItem" ref={ref}>
      <LangLink to={`/issue/${issue.pid}`}>
        <div className="position-relative" style={{ height: size }}>
          <svg xmlns="http://www.w3.org/2000/svg"
            className="position-absolute"
            width={size} height={size}
            style={{background: 'var(--dark)', top: 0}}
          >
            {Array(Math.round(Math.random() * 100)).fill(0).map((d,j) => (
              <circle
                key={j}
                // cx={100}
                // cy={100}
                cx={size/2 + 5*Math.random()}
                cy={size/2 + 5*Math.random()}
                r={size/3 * Math.random()}
                fill="transparent" stroke="var(--primary)"
                style={{opacity: .15}}
                strokeWidth={7 * Math.random()}
              />
            ))}
          </svg>
        </div>
        <h3 className="d-block mt-3 pb-0">
          {issue.name}
        </h3>
      </LangLink>
      <p dangerouslySetInnerHTML={{__html: issue.description }} />
    </div>
  )
}

export default IssueListItem
