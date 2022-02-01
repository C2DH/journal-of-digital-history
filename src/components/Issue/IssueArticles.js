import React from 'react'
import { Row, Col} from 'react-bootstrap'
import IssueArticleGridItem from './IssueArticleGridItem'
import {useBoundingClientRect} from '../../hooks/graphics'

const BootstrapColumLayout = Object.freeze({
  lg: {span: 4, offset:0},
  md: {span:6, offset:0}
})

/**
 * This component is devoted to display a list of Articles
 * using their fingerprint.
 *
 *
 */
const IssueArticles = ({
  data,
  // function (e, datum, idx) { ... }
  onArticleMouseMove,
  // function (e, datum, idx) { ... }
  onArticleClick,

  onArticleMouseOut
 }) => {
  const [{ top, left }, ref] = useBoundingClientRect()
  const editorials = []
  const articles = []

  for (let i=0,j=data.length; i < j; i++) {
    if (data[i].tags.some((t) => t.name === process.env.REACT_APP_TAG_EDITORIAL)) {
      editorials.push(data[i])
    } else {
      articles.push(data[i])
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
  const onMouseMoveHandler = (e) => {
    if (typeof onArticleMouseMove === 'function') {
      onArticleMouseMove(e, { top, left })
    }
  }
  return (
    <Row ref={ref}>
      {editorials.map((article, i) => (
        <Col key={i} {...BootstrapColumLayout} >
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
        <Col key={i + editorials.length} {...BootstrapColumLayout}>
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
  )
}

export default IssueArticles
