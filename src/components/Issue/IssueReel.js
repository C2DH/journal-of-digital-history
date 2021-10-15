import React from 'react'
import { useTranslation } from 'react-i18next'
import { StatusSuccess } from '../../constants'
import { useGetJSON } from '../../logic/api/fetchData'
import { useSpring, a } from 'react-spring'
import LangLink from '../LangLink'
import '../../styles/components/IssueReel.scss'

const FakeIssues = [
  { name: '...', description: '&nbsp;', pid: 'jdh001' },
  // { name: '...', description: '&nbsp;' },
]

// const transform = to([x, y], (x, y) => `translate(${x}px, ${y}px)`)

const IssueReel = () => {
  const { t } = useTranslation()
  // load published issue
  const { data:issues, error, status, errorCode } = useGetJSON({
    url: `/api/issues?status=PUBLISHED&ordering=-creation_date`,
    delay: 200
  })
  const [{x, y}, api] = useSpring(() => ({ x: 0, y: 0, config: { mass: 10, tension: 550, friction: 140 } }))
  React.useEffect(() => {
    const mouseMoveHandler = ({ clientX, clientY }) => {
      api.start({ x: (clientX - window.innerWidth / 2) / 5, y: (clientY - window.innerHeight / 3) / 5})
    }
    document.addEventListener('mousemove', mouseMoveHandler)
    return function clean() {
      document.removeEventListener('mousemove', mouseMoveHandler)
    }
  })
  if (error) {
    console.warn('Error in getting latest published issue:', errorCode, error)
    return null
  }

  if (!Array.isArray(issues)) {
    return null
  }
  if (!issues.length) {
    return null
  }
  const items = (issues ?? FakeIssues)
  const latestItem = items[0]
  // const isFake = status !== StatusSuccess
  const size = 100
  const margin = 10

  return (
    <div className="IssueReel" style={{transition: 'opacity .5s ease-in', opacity: status === StatusSuccess ? 1 : 0,}}>
      <div className="position-relative border border-dark">
        <a.div className="position-absolute w-100 h-100 bg-primary" style={{
          zIndex: -1,
          x, y
        }}></a.div>
        <div className='IssueReel_cover bg-dark position-absolute' style={{
          left: margin,
          top: margin,
          // borderRadius : size,
          transform: `scale(${status === StatusSuccess ? 1 : .1}`,
          width: size, height: size, backgroundSize: size, backgroundImage: `url(/img/issues/${latestItem.pid}.png)`}}>
        </div>
        <div className="px-3 pb-3" style={{marginLeft: size + margin, marginTop: margin}}>
          <h2 className="m0 p0">{t('HelloWorldTitle')}</h2>
          <h3>{latestItem.name}</h3>
          <br/>
          <LangLink  to={`issue/${latestItem.pid}`}>{t('HelloWorldAvailableHere')}</LangLink>
        </div>
      </div>
    </div>
  )
}

export default IssueReel
