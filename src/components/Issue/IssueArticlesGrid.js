import React, { useRef } from 'react'
import { Row, Col } from 'react-bootstrap'
import { useGetJSON } from '../../logic/api/fetchData'
import IssueArticleGridItem from './IssueArticleGridItem'
import { StatusSuccess } from '../../constants'
import { a, useSpring, config} from 'react-spring'
import {useBoundingClientRect} from '../../hooks/graphics'


const IssueArticlesGrid = ({ issue, onError }) => {
  const [{ left }, ref] = useBoundingClientRect()
  const [animatedProps, api] = useSpring(() => ({ x : 0, y: 0, opacity:1, config: config.stiff }))
  const tooltipText = useRef('');
  // console.info('IssueArticlesGrid', articles)
  const { data, error, status, errorCode } = useGetJSON({
    url: `/api/articles/?pid=${issue.pid}`
  })
  if (typeof onError === 'function' && error) {
    console.error('IssueArticlesGrid loading error:', errorCode, error)
  }
  if (status !== StatusSuccess ) {
    return null
  }

  const editorials = []
  const articles = []

  for (let i=0,j=data.length; i < j; i++) {
    if (data[i].tags.some((t) => t.name === process.env.REACT_APP_TAG_EDITORIAL)) {
      editorials.push(data[i])
    } else {
      articles.push(data[i])
    }
  }
  const handleMouseMove = (e, datum) => {
    api.start({ x: e.clientX - left, y: e.clientY - 50, opacity: 1 })
    tooltipText.current = (datum.firstWords || datum.countChars) + ' ...'
  }
  const handleMouseOut = () => {
    api.start({ opacity: 0 })
  }
  return (
    <>
    <a.div className="position-fixed top-0" style={{
      zIndex:1000,
      backgroundColor: 'var(--secondary)',
      color: 'white',
      borderRadius: 2,
      padding: '0 var(--spacer-2)',
      pointerEvents: 'none',
      ...animatedProps
    }}>
      <a.span>{animatedProps.x.to(() => String(tooltipText.current))}</a.span>
    </a.div>
    <Row ref={ref} >
        {editorials.map((article, i) => (
          <Col key={i} lg={{ span: 4, offset:0}} md={{span:6, offset:0}} >
            <IssueArticleGridItem onMouseOut={handleMouseOut} onMouseMove={handleMouseMove} article={article} isEditorial />
          </Col>
        ))}
        {articles.map((article, i) => (
          <Col key={i + editorials.length} lg={{ span: 4, offset:0}} onMouseOut={handleMouseOut} md={{span:6, offset:0}}>
            <IssueArticleGridItem onMouseOut={handleMouseOut} onMouseMove={handleMouseMove} article={article} num={i+1} total={articles.length}/>
          </Col>
        ))}
    </Row>
    </>
  )
}

export default IssueArticlesGrid
