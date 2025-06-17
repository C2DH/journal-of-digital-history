import React, { useMemo, useLayoutEffect, useState, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { sort } from 'd3-array'
import { useQueryParams, withDefault } from 'use-query-params'
import { asEnumParam, asRegexArrayParam } from '../../logic/params'
import {
  AvailablesOrderByComparators,
  FilterByQueryparam,
  OrderByIssue,
  OrderByPublicationDateAsc,
  OrderByPublicationDateDesc,
  OrderByQueryParam,
  BootstrapColumLayout,
  DisplayLayerCellIdxQueryParam,
  DisplayLayerQueryParam,
  LayerNarrative,
  LayerHermeneutics,
  StatusSuccess,
  ArticleStatusDraft,
  ArticleStatusPublished,
} from '../../constants/globalConstants'
import IssueArticles from '../Issue/IssueArticles'
import OrderByDropdown from '../OrderByDropdown'
import Article from '../../models/Article'
import ArticlesFacets from '../Articles/ArticlesFacets'
import Issue from '../Issue'
import ArticleFingerprintTooltip from '../ArticleV2/ArticleFingerprintTooltip'
import groupBy from 'lodash/groupBy'
import { Container, Row, Col } from 'react-bootstrap'
import { useSpring, config, a } from '@react-spring/web'
import { useNavigate } from 'react-router'
import { useBoundingClientRect } from '../../hooks/graphics'
import { useWindowStore } from '../../store'

const ArticlesGrid = ({
  items = [],
  url,
  issueId,
  issues = [],
  status,
  // tag ategories to keep
  categories = ['narrative', 'tool', 'issue'],
}) => {
  const facetsRef = useRef()
  const timerRef = useRef()
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
  const navigate = useNavigate()
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
  // animation properties to slide up and down the articleFacets block
  const [facetsAnimatedProps, setFacetsAnimatedProps] = useSpring(() => ({
    height: 0,
  }))
  const data = (items || []).map((d, idx) => new Article({ ...d, idx }))
  const articles = sort(data, AvailablesOrderByComparators[orderBy])

 const { articlesByIssue, advanceArticles, showFilters } = useMemo(() => {
    if (status !== StatusSuccess) {
      return {
        articlesByIssue: {},
        advanceArticles: [],
        issues: [],
        sortedItems: [],
        showFilters: false,
      }
    }
    const sortedItems = data.map((item, idx) => ({
      ...item,
      idx,
      selected: selected?.includes(idx),
    }))
    const articlesByIssue = groupBy(sortedItems, 'issue.pid')

    // Advance articles are articles that are in draft issues
    const advanceArticles = data
      .filter((d) => d.issue.status === ArticleStatusDraft)
      .map((d, idx) => ({ ...d, idx, selected: selected?.includes(idx) }))

    const showFilters = data.reduce((acc, d) => {
      return acc || d.tags.some((t) => categories.includes(t.category))
    }, false)
    return { articlesByIssue, advanceArticles, showFilters }
  }, [url, selected, status])

  const onArticleMouseMoveHandler = (e, datum, idx, article, bounds) => {
    if (!isNaN(idx) && animatedRef.current.idx !== idx) {
      animatedRef.current.idx = idx
      animatedRef.current.length = article.fingerprint.cells.length
      animatedRef.current.datum = datum
    }
    const x = bounds.left + Math.min(width - 200, e.clientX - bounds.left)
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
    navigate(url)
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

  useLayoutEffect(() => {
    if (status === StatusSuccess) {
      setFacetsAnimatedProps.start({
        height: facetsRef.current.firstChild.scrollHeight,
        delay: 1000,
      })
      return useWindowStore.subscribe(() => {
        clearTimeout(timerRef.current)
        timerRef.current = setTimeout(() => {
          setFacetsAnimatedProps.start({
            height: facetsRef.current.firstChild.scrollHeight,
            delay: 0,
          })
        }, 0)
      })
    }
  }, [status])

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

      <a.div
        className="row mb-1 position-relative overflow-hidden"
        ref={facetsRef}
        style={facetsAnimatedProps}
      >
        <Col md={{ offset: 1, span: 10 }} className="position-absolute">
          {status === StatusSuccess && (
            <ArticlesFacets
              items={data}
              onShowMore={() => {
                console.info('[ArticlesGrid] @showMore')
                clearTimeout(timerRef.current)
                setTimeout(() => {
                  setFacetsAnimatedProps.start({
                    height: facetsRef.current.firstChild.scrollHeight,
                    delay: 0,
                  })
                }, 0)
              }}
              onSelect={onFacetsSelectHandler}
              className="Articles_facets "
            />
          )}
        </Col>
      </a.div>

      {orderBy === OrderByIssue && (
        <>
          {advanceArticles.length > 0 && (
            <IssueArticles
              selected={selected}
              data={advanceArticles || []}
              onArticleMouseMove={onArticleMouseMoveHandler}
              onArticleClick={onArticleClickHandler}
              onArticleMouseOut={onArticleMouseOutHandler}
              collapsable={true}
            >
              <Issue
                numArticles={advanceArticles.length}
                isInFilterMode={Array.isArray(selected)}
                numSelectedArticles={advanceArticles.filter((d) => d.selected).length}
                item={{
                  name: t('pages.articles.advanceArticles'),
                  description: t('pages.articles.advanceArticlesDescription'),
                  status: ArticleStatusPublished,
                  pid: '',
                }}
                className="py-2 mb-1"
              />
            </IssueArticles>
          )}

          {issues
            .filter((issue) => issue.status === ArticleStatusPublished)
            .map((issue) => {
              const numArticles = articlesByIssue[issue.pid]?.length
              const numSelectedArticles = articlesByIssue[issue.pid]?.filter(
                (d) => d.selected,
              ).length

              return (
                <React.Fragment key={issue.pid}>
                  <a className="anchor" id={`anchor-${issue.pid}`} />

                  <IssueArticles
                    selected={selected}
                    data={articlesByIssue[issue.pid] || []}
                    onArticleMouseMove={onArticleMouseMoveHandler}
                    onArticleClick={onArticleClickHandler}
                    onArticleMouseOut={onArticleMouseOutHandler}
                    collapsable={true}
                  >
                    <Issue
                      numArticles={numArticles}
                      isInFilterMode={Array.isArray(selected)}
                      numSelectedArticles={numSelectedArticles}
                      hasSelectedArticles={!!articlesByIssue[issue.pid]}
                      item={issue}
                      className="py-2 mb-1"
                    />
                  </IssueArticles>
                </React.Fragment>
              )
            })}
        </>
      )}
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

export default ArticlesGrid
