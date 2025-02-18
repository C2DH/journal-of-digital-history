import React, { useRef } from 'react'
import { Row, Col } from 'react-bootstrap'
import { useHistory } from 'react-router'
import { useGetJSON } from '../../logic/api/fetchData'
import IssueArticleGridItem from './IssueArticleGridItem'
import { StatusSuccess, DisplayLayerCellIdxQueryParam } from '../../constants'
import { a, useSpring, config} from 'react-spring'
import {useBoundingClientRect} from '../../hooks/graphics'


const IssueArticlesGrid = ({ issue, onError }) => {
  const [{ left }, ref] = useBoundingClientRect()
  const history = useHistory()
  const [animatedTooltipProps, tooltipApi] = useSpring(() => ({
    x : 0, y: 0, opacity:0,
    color: 'var(--white)',
    backgroundColor: 'var(--secondary)',
    config: config.stiff
  }))
  const tooltipText = useRef({ idx: '', text: '', heading: ''});
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
    if (data[i].tags.some((t) => t.name === import.meta.env.VITE__TAG_EDITORIAL)) {
      editorials.push(data[i])
    } else {
      articles.push(data[i])
    }
  }
  // eslint-disable-next-line no-unused-vars
  const onMouseMoveHandler = (e, datum, idx) => {
    if( tooltipText.current.idx !== idx) {
      tooltipText.current.text = datum.firstWords
      tooltipText.current.idx = idx
      tooltipText.current.heading = datum.firstWordsHeading || '?'
      console.info('datum', datum)
    }
    tooltipApi.start({
      x: e.clientX - left +ref.current.parentNode.offsetLeft,
      y: e.clientY - 50,
      color: datum.type === 'code'
        ? 'var(--white)'
        : datum.isHermeneutic
          ? 'var(--secondary)'
          : 'var(--white)',
      backgroundColor: datum.type === 'code'
        ? 'var(--accent)'
        : datum.isHermeneutic
          ? 'var(--primary)'
          : 'var(--secondary)',
      opacity: 1
    })
  }

  const onClickHandler = (e, datum, idx, article) => {
    e.stopPropagation()
    // link to specific cell in article
    const url = idx
      ? `/en/article/${article.abstract.pid}?${DisplayLayerCellIdxQueryParam}=${idx}`
      : `/en/article/${article.abstract.pid}`
    history.push(url);
  }
  const onMouseOutHandler = () => {
    tooltipApi.start({ opacity: 0 })
  }

  return (
    <>
    <a.div className="ArticleFingerprintTooltip position-fixed top-0" style={{
      ...animatedTooltipProps
    }}>
      <a.span>{animatedTooltipProps.x.to(() => String(tooltipText.current.text))}</a.span>
    </a.div>
    <Row ref={ref}>
        {editorials.map((article, i) => (
          <Col key={i} lg={{ span: 4, offset:0}} md={{span:6, offset:0}} >
            {/* to rehab tooltip add onMouseMove={onMouseMoveHandler}  */}
            <IssueArticleGridItem
              onClick={(e, datum, idx) => onClickHandler(e, datum, idx, article)}
              onMouseOut={onMouseOutHandler}
              article={article}
              isEditorial
            />
          </Col>
        ))}
        {articles.map((article, i) => (
          <Col key={i + editorials.length} lg={{ span: 4, offset:0}} onMouseOut={onMouseOutHandler} md={{span:6, offset:0}}>
            {/* to rehab tooltip add onMouseMove={onMouseMoveHandler}  */}
            <IssueArticleGridItem
              onClick={(e, datum, idx) => onClickHandler(e, datum, idx, article)}
              onMouseOut={onMouseOutHandler}
              article={article}
              num={i+1}
              total={articles.length}
            />
          </Col>
        ))}
    </Row>
    </>
  )
}

export default IssueArticlesGrid
