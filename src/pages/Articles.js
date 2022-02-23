import React, { useRef, useState, useMemo } from 'react'
import groupBy from 'lodash/groupBy'
import { Container, Row, Col } from 'react-bootstrap'
import { useSpring, config} from 'react-spring'
import { useHistory } from 'react-router'
import StaticPageLoader from './StaticPageLoader'
import IssueArticles from '../components/Issue/IssueArticles'
import Issue from '../components/Issue'
import Facets from '../components/Facets'
import ArticleFingerprintTooltip from '../components/ArticleV2/ArticleFingerprintTooltip'
import {
  BootstrapColumLayout,
  DisplayLayerCellIdxQueryParam,
  DisplayLayerQueryParam,
  LayerNarrative,
  LayerHermeneutics,
  StatusSuccess
} from '../constants'
import { useBoundingClientRect } from '../hooks/graphics'
import '../styles/pages/Articles.scss'

const ArticlesGrid = ({
  data,
  url,
  status
}) => {
  const [selected, setSelected] = useState(null)

  const [{  width }, ref] = useBoundingClientRect()
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

  const { articlesByIssue, issues } = useMemo(() => {
    if(status !== StatusSuccess) {
      return {
        articlesByIssue: {},
        issues: [],
        sortedItems: []
      }
    }
    const sortedItems = data.map((item, idx) => ({
      ...item,
      idx
    }))
    const articlesByIssue = groupBy(sortedItems, 'issue.pid')
    const issues = Object.keys(articlesByIssue).sort((a,b) => {
      return articlesByIssue[a][0].issue.pid < articlesByIssue[b][0].issue.pid
    })
    return { articlesByIssue, issues }
  }, [url, status])

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
      id: [article.abstract.id || -1, idx ?? -1],
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

  const onFacetsSelectHandler = (name, indices) => {
    console.debug('[Articles] @onSelect', name, indices)
    setSelected(indices)
  }
  console.debug('[Articles] data:', data)
  return (
    <Container ref={ref} className="Articles Issue page">
      <Row className="mb-3 border-bottom border-accent">
        <Col {...BootstrapColumLayout}>
        <Facets
          dimensions={['narrative', 'hermeneutic', 'tool'].map((category) => ({
            fixed: true,
            name: category,
            fn: (d) => d.tags.filter(t => t.category === category).map(t => t.name),
            sortFn: (a,b) => {
              return a.indices.length === b.indices.length
                ? a.key > b.key
                  ? 1 : -1
                : a.indices.length > b.indices.length ? -1 : 1
            },
            isArray: true
          }))}
          items={data}
          onSelect={onFacetsSelectHandler}
          onInit={(args) => console.debug('[Articles]', args)}
          className="Articles_facets"
        />
        </Col>
      </Row>
      <ArticleFingerprintTooltip
        forwardedRef={animatedRef}
        animatedProps={animatedProps}
      />
      {issues.map((issueId) => {
        const issue = articlesByIssue[issueId][0].issue
        return (
          <React.Fragment key={issueId}>
            <Row>
              <Col {...BootstrapColumLayout}>
                <Issue item={issue} />
              </Col>
            </Row>
            <IssueArticles
              selected={selected}
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
