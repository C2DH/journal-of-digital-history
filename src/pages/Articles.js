import React, { useRef } from 'react'
import groupBy from 'lodash/groupBy'
import { Container, Row, Col } from 'react-bootstrap'
import { useSpring, config} from 'react-spring'
import { useHistory } from 'react-router'
import StaticPageLoader from './StaticPageLoader'
import IssueArticles from '../components/Issue/IssueArticles'
import Issue from '../components/Issue'
import ArticleFingerprintTooltip from '../components/ArticleV2/ArticleFingerprintTooltip'
import {
  BootstrapColumLayout,
  DisplayLayerCellIdxQueryParam,
  DisplayLayerQueryParam,
  LayerNarrative,
  LayerHermeneutics
} from '../constants'
import { useBoundingClientRect } from '../hooks/graphics'


const ArticlesGrid = ({ data }) => {
  const [{  width }, ref] = useBoundingClientRect()
  const articlesByIssue = groupBy(data, 'issue.pid')
  const issues = Object.keys(articlesByIssue).sort((a,b) => {
    return articlesByIssue[a][0].issue.pid < articlesByIssue[b][0].issue.pid
  })
  const history = useHistory()
  const animatedRef = useRef({ idx: '', length: '', datum:{}});
  const [animatedProps, setAnimatedProps] = useSpring(() => ({
    from: { x: 0, y: 0, id: [0, 0], color: 'red' },
    x : 0, y: 0, opacity:0,
    id: [0, 0],
    color: 'var(--white)',
    backgroundColor: 'var(--secondary)',
    config: config.stiff
  }))

  const onArticleMouseMoveHandler = (e, datum, idx, article, bounds) => {
    if (animatedRef.current.idx !== idx ) {
      animatedRef.current.idx = idx
      animatedRef.current.length = article.fingerprint.cells.length
      animatedRef.current.datum = datum
    }
    const x = Math.min(width - 200, e.clientX - bounds.left)
    const y = e.clientY + 50
    // this will change only animated toltip stuff
    setAnimatedProps.start({
      x,
      y,
      id: [article.abstract.id, idx],
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
  const onArticleMouseOutHandler = () => {
    setAnimatedProps.start({ opacity: 0 })
  }
  const onArticleClickHandler = (e, datum, idx, article) => {
    console.debug('@onArticleClickHandler', datum, idx, article)
    e.stopPropagation()
    // link to specific cell in article
    const url = idx
      ? `/en/article/${article.abstract.pid}?${DisplayLayerCellIdxQueryParam}=${idx}&${DisplayLayerQueryParam}=${datum.isHermeneutic ? LayerHermeneutics : LayerNarrative }`
      : `/en/article/${article.abstract.pid}`
    history.push(url);
  }
  return (
    <Container ref={ref} className="Issue page mt-5">
      {issues.map((issueId) => {
        const issue = articlesByIssue[issueId][0].issue
        return (
          <React.Fragment key={issueId}>
            <Row>
              <Col {...BootstrapColumLayout}>
                <Issue item={issue} />
              </Col>
            </Row>

            <ArticleFingerprintTooltip
              forwardedRef={animatedRef}
              animatedProps={animatedProps} />
            <IssueArticles
              data={articlesByIssue[issueId]}
              onArticleMouseMove={onArticleMouseMoveHandler}
              onArticleClick={onArticleClickHandler}
              onArticleMouseOut={onArticleMouseOutHandler}
              />
          </React.Fragment>
        )
      })}
    </Container>
  )
}

const Articles = () => {
  return (
    <StaticPageLoader
      url="/api/articles?limit=100"
      Component={ArticlesGrid}
    />
  )
}

export default Articles
