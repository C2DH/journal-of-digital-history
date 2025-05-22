import React, { useLayoutEffect } from 'react'
import { Row, Col } from 'react-bootstrap'
import IssueArticleGridItem from './IssueArticleGridItem'

const BootstrapColumLayout = Object.freeze({
  lg: { span: 4, offset: 0 },
  md: { span: 6, offset: 0 },
})

/**
 * This component is devoted to display a list of Articles
 * using their fingerprint.
 *
 *
 */
const IssueArticles = ({
  data,
  // null or array of data indices
  selected,
  // function (e, datum, idx) { ... }
  onArticleMouseMove,
  // function (e, datum, idx) { ... }
  onArticleClick,

  onArticleMouseOut,

  respectOrdering = false,
  children,
  className = '',
}) => {
  const ref = React.useRef()
  const bboxRef = React.useRef()
  const editorials = []
  const articles = respectOrdering ? data : []

  if (!respectOrdering) {
    for (let i = 0, j = data.length; i < j; i++) {
      console.debug('[IssueArticles] data:', +data[i].publication_date)

      if (data[i].tags.some((t) => t.name === import.meta.env.VITE_TAG_EDITORIAL)) {
        editorials.push(data[i])
      } else {
        articles.push(data[i])
      }
    }
  }
  const onClickHandler = (e, datum, idx, article) => {
    if (typeof onArticleClick === 'function') {
      onArticleClick(e, datum, idx, article)
    }
  }
  const onMouseOutHandler = (e) => {
    if (typeof onArticleMouseOut === 'function') {
      onArticleMouseOut(e)
    }
  }
  // eslint-disable-next-line no-unused-vars
  const onMouseMoveHandler = (e, datum, idx, article) => {
    if (typeof onArticleMouseMove === 'function' && bboxRef.current) {
      onArticleMouseMove(e, datum, idx, article, {
        top: bboxRef.current.top,
        left: bboxRef.current.left,
      })
    }
  }
  const updateBboxRef = () => {
    bboxRef.current = ref.current.getBoundingClientRect()
  }

  useLayoutEffect(() => {
    if (!ref.current) return
    bboxRef.current = ref.current.getBoundingClientRect()
    window.addEventListener('resize', updateBboxRef)
    return () => {
      window.removeEventListener('resize', updateBboxRef)
    }
  }, [ref])
  console.debug('[IssueArticles] rendered')

  return (
    <Row ref={ref} className={`IssueArticles ${className}`}>
      {children}
      {data.length > 0 && <Col sm={{ span: 12 }} className="py-3"></Col>}
      {editorials.map((article, i) => {
        if (Array.isArray(selected) && selected.indexOf(article.idx) === -1) {
          return null
        }
        return (
          <Col key={i} {...BootstrapColumLayout}>
            {/* to rehab tooltip add onMouseMove={onMouseMoveHandler}  */}
            <IssueArticleGridItem
              onMouseMove={(e, datum, idx) => onMouseMoveHandler(e, datum, idx, article)}
              onClick={(e, datum, idx) => onClickHandler(e, datum, idx, article)}
              onMouseOut={onMouseOutHandler}
              article={article}
              isEditorial
            />
          </Col>
        )
      })}
      {articles.map((article, i) => {
        let display = 'block'
        if (Array.isArray(selected) && selected.indexOf(article.idx) === -1) {
          display = 'none'
        }
        return (
          <Col
            key={i + editorials.length}
            {...BootstrapColumLayout}
            style={{
              display,
            }}
          >
            {/* to rehab tooltip add onMouseMove={onMouseMoveHandler}  */}
            <IssueArticleGridItem
              onMouseMove={(e, datum, idx) => onMouseMoveHandler(e, datum, idx, article)}
              onClick={(e, datum, idx) => onClickHandler(e, datum, idx, article)}
              onMouseOut={onMouseOutHandler}
              article={article}
              num={i + 1}
              total={articles.length}
            />
          </Col>
        )
      })}
    </Row>
  )
}

export default IssueArticles
