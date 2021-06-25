import React from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import { useQueryParams, StringParam, NumberParam } from 'use-query-params'
import {
  DisplayLayerQueryParam,
  DisplayLayerCellIdxQueryParam,
  DisplayLayerNarrative, DisplayLayerHermeneutics,
  BootstrapColumLayout,
} from '../../constants'
import { Cpu } from 'react-feather'

/**
 * ArticleCellShadow is the component to display the trigger to go to the target layer.
 *
 * @param {String} displayLayer - layer where the component is visible
 * @param {String} targetLayer - the target layer
 * @param {Number} idx - index numbr of the cell, sort of identifier. Used to scrollto
 * @param {ArticleHeading} heading - if the cell contains an heading, this is the instance.
 */
const ArticleCellShadow = ({
  displayLayer=DisplayLayerNarrative,
  targetLayer=DisplayLayerHermeneutics,
  idx=-1,
  heading=null,
  content=''
 }) => {
  const [, setQuery] = useQueryParams({
    [DisplayLayerQueryParam]: StringParam,
    [DisplayLayerCellIdxQueryParam]: NumberParam
  })
  const clickHandler = () => {
    setQuery({ layer: targetLayer, idx })
  }
  if (!heading) {
    return null
  }
  return (
    <Container className="my-5">
      <Row>
        <Col {...BootstrapColumLayout}>
          <div dangerouslySetInnerHTML={{
            __html: content
          }} />
          <button
            className="btn btn-outline-secondary btn-sm"
            onClick={clickHandler}
          >
            <span className="mr-2">read more ...</span> <Cpu size="16"/>
          </button>
        </Col>
      </Row>
    </Container>
  )
}

export default ArticleCellShadow
