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
  // const [{width: size }, ref] = useBoundingClientRect()
  // useEffect()
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

// const PreviousIssueListItem = ({ issue={}, isFake=false }) => {
//   const [{width: size }, ref] = useBoundingClientRect()
//
//   return (
//     <div className="IssueListItem mt-5" ref={ref}>
//       <LangLink to={isFake ? '#' : `/issue/${issue.pid}`}>
//         <div className="squared  position-relative" style={{
//           backgroundColor: 'var(--dark)',
//           overflow: 'hidden'
//         }}>
//           {isFake ? null : (
//             <svg xmlns="http://www.w3.org/2000/svg"
//               className="position-absolute grow animate-transform"
//               width={size} height={size}
//               style={{background: 'var(--dark)', top: 0 }}
//             >
//               {Array(Math.round(Math.random() * 100)).fill(0).map((d,j) => (
//                 <circle
//                   key={j}
//                   // cx={100}
//                   // cy={100}
//                   cx={size/2 + 5*Math.random()}
//                   cy={size/2 + 5*Math.random()}
//                   r={size/3 * Math.random()}
//                   fill="transparent" stroke="var(--primary)"
//                   style={{opacity: .15}}
//                   strokeWidth={7 * Math.random()}
//                 />
//               ))}
//             </svg>
//           )}
//         </div>
//         <h3 className="d-block mt-3 pb-0">
//           {issue.name}
//         </h3>
//       </LangLink>
//       <p dangerouslySetInnerHTML={{__html: issue.description }} />
//     </div>
//   )
// }

export default IssueListItem
