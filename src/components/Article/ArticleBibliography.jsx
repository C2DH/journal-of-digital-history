import React, { useState } from 'react'
import { Container, Col, Row } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import {
  BootstrapColumLayout,
  // BootstrapSideColumLayout,
  // BootstrapMainColumLayout
} from '../../constants'
import Facets, { sortFn } from '../Facets'
import Sorting from '../Facets/Sorting'
import Citation from '../Citation'
import '../../styles/components/Article/ArticleBibliography.scss'

const Dimensions = [
  {
    name: 'authors',
    fixed: true,
    fn: (d) => {
      if (Array.isArray(d.author)) {
        return d.author.map((a) => [a.family, a.given].join(', '))
      }
      if (Array.isArray(d.editor)) {
        return d.editor.map((a) => [a.family, a.given].join(', '))
      }

      return []
    },
    sortFn: (a, b) => {
      return a.indices.length === b.indices.length
        ? a.key > b.key
          ? 1
          : -1
        : a.indices.length > b.indices.length
        ? -1
        : 1
    },
    // each group has these props:
    // key: k, count: 0, indices: [], selected: []
    // sortFn: (a,b) => {
    //   return a.count === b.count
    //     ? a.key > b.key
    //       ? 1 : -1
    //     : a.count > b.count ? -1 : 1
    // },
    isArray: true,
  },
  {
    name: 'issued.year',
    fixed: true,
    fn: (d) => {
      if (d.issued instanceof Object) {
        if (isNaN(d.issued.year) && Array.isArray(d.issued['date-parts'])) {
          let year = d.issued['date-parts'][0]
          while (Array.isArray(year) && year.length) {
            year = year[0]
          }
          return year
        }
        return d.issued.year
      }
      return 0
    },
    sortFn: (a, b) => {
      return a.key > b.key ? -1 : 1
    },
  },
]

const ArticleBilbiography = ({
  articleTree,
  noAnchor = false,
  className = 'mt-5',
  dimensions = Dimensions,
}) => {
  const { t } = useTranslation()
  const [selected, setSelected] = useState(null)
  const [stats, setStats] = useState(null)
  const [sortBy, setSortBy] = useState('authors')
  const [sortDirection, setSortDirection] = useState(1)

  // const [selected, setSelected] = useState([])]
  console.debug('[ArticleBilbiography] articleTree', articleTree)
  if (!articleTree.bibliography) {
    return null
  }
  const onFacetsInitHandler = (facets) => {
    console.debug('[ArticleBilbiography] @onFacetsInitHandler', facets)
    setStats(facets)
  }
  const onFacetSelectHandler = (name, indices) => {
    console.debug('[ArticleBilbiography] @onFacetClickHandler', name, indices)
    // values and value
    setSelected(indices)
  }

  const items = articleTree.bibliography?.data || []

  const replaceUrlsWithLink = (text) =>
    text.replace(
      /(https?:\/\/[0-9a-zA-Z-./_:?=]+)([^0-9a-zA-Z-./]+)/g,
      (m, link, r) => `<a href="${link}" target="_blank">${link}</a>${r}`,
    )

  const sortedItems = items
    .map((item, idx) => ({
      ...item,
      idx,
    }))
    .sort(
      sortFn({
        by: sortBy,
        direction: sortDirection,
        dimensions,
      }),
    )

  return (
    <>
      <Container className={`ArticleBilbiography ${className}`}>
        <Row>
          <Col {...BootstrapColumLayout}>
            {noAnchor ? null : <div id="bibliography" className="anchor" />}
            <h2>{t('bibliography')}</h2>
            <p>{t('bibliographySummary', stats)}</p>
          </Col>
        </Row>
      </Container>
      <Container className={`ArticleBilbiography_references`}>
        <Row>
          <Col {...BootstrapColumLayout}>
            <Facets
              className="ArticleBilbiography_facet"
              memoid={articleTree.id}
              items={items}
              onInit={onFacetsInitHandler}
              onSelect={onFacetSelectHandler}
              dimensions={dimensions}
            />
            <Sorting
              className="ArticleBilbiography_Sorting"
              options={dimensions.map(({ name }) => ({
                label: t(`dimensions.sorting.values.${name}`),
                value: name,
              }))}
              currentOption={sortBy}
              optionsLabel={t('dimensions.sorting.options')}
              currentDirection={sortDirection}
              directionsLabel={t('dimensions.sorting.directions')}
              onChange={(e) => {
                if (e.option.value !== sortBy) {
                  setSortBy(e.option.value)
                } else if (e.direction.value !== sortDirection) {
                  setSortDirection(e.direction.value)
                }
              }}
            />
            {sortedItems.map((item) => {
              // <pre key={i}>{item.title} {JSON.stringify(item.author, null, 2)}</pre>
              if (Array.isArray(selected) && selected.indexOf(item.idx) === -1) {
                return null
              }
              return <Citation key={item.idx} bibjson={item} replaceFn={replaceUrlsWithLink} />
            })}
          </Col>
        </Row>
      </Container>
    </>
  )
}

export default ArticleBilbiography
