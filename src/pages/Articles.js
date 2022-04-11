import React, { useRef, useState, useMemo, useLayoutEffect } from 'react'
import { useTranslation } from 'react-i18next'
import groupBy from 'lodash/groupBy'
import { Container, Row, Col } from 'react-bootstrap'
import { useSpring, config} from 'react-spring'
import { useHistory } from 'react-router'
import StaticPageLoader from './StaticPageLoader'
import IssueArticles from '../components/Issue/IssueArticles'
import Issue from '../components/Issue'
import Facets from '../components/Facets'
import DimensionGroupListItem from '../components/Facets/DimensionGroupListItem'
import ArticleFingerprintTooltip from '../components/ArticleV2/ArticleFingerprintTooltip'
import {
  BootstrapColumLayout,
  DisplayLayerCellIdxQueryParam,
  DisplayLayerQueryParam,
  LayerNarrative,
  LayerHermeneutics,
  StatusSuccess,
  IsMobile
} from '../constants'
import { useBoundingClientRect } from '../hooks/graphics'
import '../styles/pages/Articles.scss'


const ShowMoreLabel = ({ active, n }) => {
  const { t } = useTranslation()
  if (n === 0) {
    return null
  }
  return (
    <span>{t(active ? 'dimensions.actions.showLess': 'dimensions.actions.showMore', { n })}</span>
  )
}




const ArticlesGrid = ({
  data:response=[],
  url,
  issueId,
  status,
  // tag ategories to keep
  categories=['narrative', 'tool']
}) => {
  const { t } = useTranslation()
  const [selected, setSelected] = useState(null)
  // pagination api contains results in data
  const data = response.results || []
  const [{  width }, ref] = useBoundingClientRect()
  const history = useHistory()
  const animatedRef = useRef({ idx: '', length: '', datum:{}});
  const [animatedProps, setAnimatedProps] = useSpring(() => ({
    from: { x: 0, y: 0, id: '0-0', color: 'red', backgroundColor: 'transparent' },
    x : 0, y: 0, opacity:0,
    id: '0-0',
    color: 'var(--white)',
    backgroundColor: 'var(--secondary)',
    config: config.stiff
  }))

  const { articlesByIssue, issues, showFilters } = useMemo(() => {
    if(status !== StatusSuccess) {
      return {
        articlesByIssue: {},
        issues: [],
        sortedItems: [],
        showFilters: false,
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
    const showFilters = data.reduce((acc, d) => {
      return acc || d.tags.some(t => categories.includes(t.category))
    }, false)
    return { articlesByIssue, issues, showFilters }
  }, [url, status])

  const dimensions = React.useMemo(() => {
    if (status !== StatusSuccess) {
      return []
    }

    const TagListItem = (props) => {
      return (
        <DimensionGroupListItem {...props}>{({ group, name:category }) => {
            const tag = data[group.indices[0]].tags
              .find(t => t.category === category && t.name === group.key)
            return (
              <div className="d-flex align-items-center flex-nowrap" title={tag.data?.info?.summary || group.key}>
                <div>{group.key}</div>
                <div className="badge mx-1">{tag.data.language}</div>
                <div>({group.count})</div>
              </div>
            )
          }}</DimensionGroupListItem>
      )
    }

    return categories.map((category) => ({
      fixed: true,
      name: category,
      thresholdFn: (groups, activeGroups) => {
        if (IsMobile) {
          return 5
        }
        if (activeGroups > 0 ) {
          return 10
        }
        // according to group composition
        const wished = groups.filter((d) => {
          return d.count > 1
        }).length
        return Math.min(10, Math.max(wished, 10))
      },
      fn: (d) => d.tags.filter(t => t.category === category).map(t => t.name),
      sortFn: (a,b) => {
        return a.indices.length === b.indices.length
          ? a.key > b.key
            ? 1 : -1
          : a.indices.length > b.indices.length ? -1 : 1
      },
      isArray: true,
      ListItem: category === 'tool' ? TagListItem : DimensionGroupListItem
    }))
  }, [status])


  const onArticleMouseMoveHandler = (e, datum, idx, article, bounds) => {
    if (!isNaN(idx) && animatedRef.current.idx !== idx ) {
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

  useLayoutEffect(() => {
    // go to issueId as soon as it's ready.
    if (issueId && status === StatusSuccess) {
      console.debug('[Articles] goto issueId:', issueId)
      const element = document.getElementById('anchor-' + issueId)
      element && element.scrollIntoView({
        behavior: "smooth",
        block: "start",
        inline: "nearest"
      })
    }
  }, [status])

  useLayoutEffect(() => {
    setAnimatedProps.start({ opacity: 0 })
  }, [selected])
  console.debug('[Articles] \n- data:', Array.isArray(data), data,'\n- issueId:', issueId)


  return (
    <Container ref={ref} className="Articles Issue page ">
      <ArticleFingerprintTooltip
        forwardedRef={animatedRef}
        animatedProps={animatedProps}
      />
      <Row className="mb-3">
        <Col {...BootstrapColumLayout}>
          <h1 className="mt-5">{t('pages.articles.title')}</h1>
          {showFilters && <p>{t('pages.articles.subheading')}</p>}
        </Col>
      </Row>
      {showFilters && (
        <Row className="mb-3">
          <Col md={{ offset: 1, span: 10 }}>
            <Facets
              dimensions={dimensions}
              items={data}
              onSelect={onFacetsSelectHandler}
              onInit={(args) => console.debug('[Articles_Facets] @init', args)}
              ShowMoreLabel={ShowMoreLabel}
              className="Articles_facets"
            />

        </Col>
      </Row>
      )}

      {issues.map((id) => {
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
    </Container>
  )
}

const Articles = ({ match: { params: { id:issueId }}}) => {
  console.debug('[Articles] issueId', issueId)
  return (
    <StaticPageLoader
      url="/api/articles?limit=100"
      Component={ArticlesGrid}
      issueId={issueId}
    />
  )
}

export default Articles
