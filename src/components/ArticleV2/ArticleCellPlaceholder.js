import React from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import { BootstrapColumLayout } from '../../constants'
import ArticleCellContent from '../Article/ArticleCellContent'
import ArticleCellSourceCode from '../Article/ArticleCellSourceCode'
import {ArrowDown} from 'react-feather'


const ArticleCellPlaceholder = ({
  type='code',
  layer,
  // whenever the placeholder stands for more than one paragraphs
  nums=[],
  content='',
  idx,
  headingLevel=0,
  // isFigure=false
  onNumClick
}) => {
  const paragraphNumbers = nums.length === 1
    ? nums[0]
    : (
      <span>
        {nums[0]}
        <br/>
        <ArrowDown size={15}/>
        <br/>
        {nums[nums.length -1]}
      </span>
    )
  const onNumClickHandler = (e) => {
    onNumClick(e, {layer, idx})
  }
  return (
    <Container>
      <Row>
        <Col className="ArticleCellPlaceholder" {... BootstrapColumLayout}>
          {type === 'markdown'
            ? (
              <ArticleCellContent
                headingLevel={headingLevel}
                layer={layer}
                content={content}
                idx={idx}
                num={paragraphNumbers}
                onNumClick={onNumClickHandler}
              />
            )
            : (
              <ArticleCellSourceCode
                visible
                content={content}
                language="python"
                num={paragraphNumbers}
                onNumClick={onNumClick}
              />
            )
          }
        </Col>
      </Row>
    </Container>
  )
}

export default ArticleCellPlaceholder
