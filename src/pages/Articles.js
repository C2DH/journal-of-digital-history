import React, { useRef, useState, useMemo, useLayoutEffect } from 'react'
import { useTranslation } from 'react-i18next'
import groupBy from 'lodash/groupBy'
import { Container, Row, Col } from 'react-bootstrap'
import { useSpring, config } from 'react-spring'
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
  LayerHermeneutics,
  StatusSuccess,
} from '../constants'
import { useBoundingClientRect } from '../hooks/graphics'
import '../styles/pages/Articles.scss'
import { useQueryParams, withDefault } from 'use-query-params'
import { asEnumParam, asRegexArrayParam } from '../logic/params'
import OrderByDropdown from '../components/OrderByDropdown'
import { sort } from 'd3-array'
import Article from '../models/Article'
import ArticlesFacets from '../components/Articles/ArticlesFacets'

const OrderByQueryParam = 'orderBy'
const FilterByQueryparam = 'f'
const OrderByIssue = 'issue'
const OrderByPublicationDateAsc = 'dateAsc'
const OrderByPublicationDateDesc = 'dateDesc'

const AvailablesOrderByComparators = {
  [OrderByIssue]: () => {},
  [OrderByPublicationDateAsc]: (a, b) => a.publication_date - b.publication_date,
  [OrderByPublicationDateDesc]: (a, b) => b.publication_date - a.publication_date,
}

const ArticlesGrid = ({
  data: response = [],
  url,
  issueId,
  status,
  // tag ategories to keep
  categories = ['narrative', 'tool', 'issue'],
}) => {
  const { t } = useTranslation()
  const [{ [OrderByQueryParam]: orderBy }, setQuery] = useQueryParams({
    [OrderByQueryParam]: withDefault(
      asEnumParam(Object.keys(AvailablesOrderByComparators)),
      OrderByIssue,
    ),
    [FilterByQueryparam]: asRegexArrayParam(),
  })

  const [selected, setSelected] = useState(null)
  // pagination api contains results in data

  const [{ width }, ref] = useBoundingClientRect()
  const history = useHistory()
  const animatedRef = useRef({ idx: '', length: '', datum: {} })
  const [animatedProps, setAnimatedProps] = useSpring(() => ({
    from: { x: 0, y: 0, id: '0-0', color: 'red', backgroundColor: 'transparent' },
    x: 0,
    y: 0,
    opacity: 0,
    id: '0-0',
    color: 'var(--white)',
    backgroundColor: 'var(--secondary)',
    config: config.stiff,
  }))
  const data = (response.results || []).map((d, idx) => new Article({ ...d, idx }))
  const articles = sort(data, AvailablesOrderByComparators[orderBy])
  const { articlesByIssue, issues, showFilters } = useMemo(() => {
    if (status !== StatusSuccess) {
      return {
        articlesByIssue: {},
        issues: [],
        sortedItems: [],
        showFilters: false,
      }
    }
    const sortedItems = data.map((item, idx) => ({
      ...item,
      idx,
    }))
    const articlesByIssue = groupBy(sortedItems, 'issue.pid')
    const issues = Object.keys(articlesByIssue).sort((a, b) => {
      return articlesByIssue[a][0].issue.pid < articlesByIssue[b][0].issue.pid
    })
    const showFilters = data.reduce((acc, d) => {
      return acc || d.tags.some((t) => categories.includes(t.category))
    }, false)
    return { articlesByIssue, issues, showFilters }
  }, [url, status])

  const onArticleMouseMoveHandler = (e, datum, idx, article, bounds) => {
    if (!isNaN(idx) && animatedRef.current.idx !== idx) {
      animatedRef.current.idx = idx
      animatedRef.current.length = article.fingerprint.cells.length
      animatedRef.current.datum = datum
    }
    const x = Math.min(width - 250, e.clientX - bounds.left)
    const y = e.clientY + 50
    // this will change only animated toltip stuff
    setAnimatedProps.start({
      x,
      y,
      id: [article.abstract.id || 0, isNaN(idx) ? 0 : idx].join('-'),
      color:
        datum.type === 'code'
          ? 'var(--white)'
          : datum.isHermeneutic
          ? 'var(--secondary)'
          : 'var(--white)',
      backgroundColor:
        datum.type === 'code'
          ? 'var(--accent)'
          : datum.isHermeneutic
          ? 'var(--primary)'
          : 'var(--secondary)',
      opacity: 1,
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
      ? `/en/article/${
          article.abstract.pid
        }?${DisplayLayerCellIdxQueryParam}=${idx}&${DisplayLayerQueryParam}=${
          datum.isHermeneutic ? LayerHermeneutics : LayerNarrative
        }`
      : `/en/article/${article.abstract.pid}`
    history.push(url)
  }

  const onFacetsSelectHandler = (name, indices) => {
    console.debug('[Articles] @onFacetsSelectHandler', name, indices)
    setSelected(indices)
  }

  useLayoutEffect(() => {
    // go to issueId as soon as it's ready.
    if (issueId && status === StatusSuccess) {
      console.debug('[Articles] goto issueId:', issueId)
      const element = document.getElementById('anchor-' + issueId)
      element &&
        element.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
          inline: 'nearest',
        })
    }
  }, [status])

  useLayoutEffect(() => {
    setAnimatedProps.start({ opacity: 0 })
  }, [selected])
  console.debug(
    '[Articles] \n- articles:',
    Array.isArray(articles),
    articles,
    '\n- issueId:',
    issueId,
  )

  return (
    <Container ref={ref} className="Articles Issue page ">
      <ArticleFingerprintTooltip forwardedRef={animatedRef} animatedProps={animatedProps} />
      <Row className="mb-3">
        <Col {...BootstrapColumLayout}>
          <h1 className="mt-5">{t('pages.articles.title')}</h1>
          <div className="d-flex align-items-center mb-2">
            {showFilters && <p className="me-2 mb-0">{t('pages.articles.subheading')}</p>}
            <OrderByDropdown
              selectedValue={orderBy}
              values={Object.keys(AvailablesOrderByComparators).map((value) => ({
                value,
                label: t(`orderBy${value}`),
              }))}
              title={t(`orderBy${orderBy}`)}
              onChange={({ value }) => setQuery({ [OrderByQueryParam]: value })}
            />
          </div>
        </Col>
      </Row>
      {showFilters && (
        <Row className="mb-3">
          <Col md={{ offset: 1, span: 10 }}>
            {status === StatusSuccess && (
              <ArticlesFacets
                items={data}
                onSelect={onFacetsSelectHandler}
                className="Articles_facets"
              />
            )}
          </Col>
        </Row>
      )}

      {orderBy === OrderByIssue &&
        issues.map((id) => {
          const issue = articlesByIssue[id][0].issue
          return (
            <React.Fragment key={id}>
              <Row>
                <Col {...BootstrapColumLayout}>
                  <a className="anchor" id={`anchor-${id}`} />
                  <Issue item={issue} />
                </Col>
              </Row>
              <IssueArticles
                selected={selected}
                data={articlesByIssue[id]}
                onArticleMouseMove={onArticleMouseMoveHandler}
                onArticleClick={onArticleClickHandler}
                onArticleMouseOut={onArticleMouseOutHandler}
              />
            </React.Fragment>
          )
        })}
      {[OrderByPublicationDateAsc, OrderByPublicationDateDesc].includes(orderBy) && (
        <IssueArticles
          selected={selected}
          data={articles}
          onArticleMouseMove={onArticleMouseMoveHandler}
          onArticleClick={onArticleClickHandler}
          onArticleMouseOut={onArticleMouseOutHandler}
          respectOrdering
        />
      )}
    </Container>
  )
}

const Articles = ({
  match: {
    params: { id: issueId },
  },
}) => {
  console.debug('[Articles] issueId', issueId)
  return (
    <StaticPageLoader url="/api/articles?limit=100" Component={ArticlesGrid} issueId={issueId} />
  )
}

export default Articles
