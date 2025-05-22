import React from 'react'
import LangLink from '../LangLink'
import { IsMobile } from '../../constants'
import { useSpring, animated } from 'react-spring'


const IssueListItem = ({ issue={}, isFake=false, ordering=0 }) => {
  const props = useSpring({
    to: { opacity: 1 }, from: { opacity: 0 },
    delay: 100*(ordering + 1),
    reset: isFake
  })

  return (
    <div className="IssueListItem mt-md-5">
      <LangLink to={isFake ? '#' : `/issue/${issue.pid}`} disabled={isFake}>
        <animated.div className={`${IsMobile ? 'half-squared': 'squared'} position-relative border rounded border-dark`} style={{
          backgroundColor: 'var(--dark)',
          overflow: 'hidden',
          ...props
        }}>
          {isFake ? null: <img src={`/img/issues/${issue.pid}.png`} style={{objectFit: 'cover'}} className="position-absolute top-0 w-100 h-100 left-0"/>}
        </animated.div>
        <h3 className="d-block mt-3 pb-0">{issue.name}
        </h3>
        <p>
          <span className="text-muted">{issue.pid}&nbsp;</span>
          <span dangerouslySetInnerHTML={{__html: issue.description }} />
        </p>
      </LangLink>
    </div>
  )
}

export default IssueListItem
