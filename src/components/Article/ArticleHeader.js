import React from 'react'
// import { useTranslation } from 'react-i18next'
import { Container, Row, Col } from 'react-bootstrap'
import ArticleCellContent from './ArticleCellContent'
import {BootstrapColumLayout} from '../../constants'


const ArticleHeader = ({ title=[], abstract=[], contributor=[] }) => {
  // const { t } = useTranslation()

  return (
    <Container className="ArticleHeader">
      <Row>
        <Col {...BootstrapColumLayout}>
          {title.map((paragraph, i) => (
            <ArticleCellContent key={i} {...paragraph} hideIdx hideNum/>
          ))}
        </Col>
      </Row>
      <Row className="mt-5">
        <Col {...BootstrapColumLayout}>
          <div className="ArticleHeader_abstract">
            {abstract.map((paragraph, i) => (
              <ArticleCellContent key={i} {...paragraph} hideIdx hideNum/>
            ))}
          </div>
        </Col>
      </Row>
      <Row className="mt-5" >
      {contributor.map((author,i) => (
        <Col key={i} md={{ offset: i % 2 === 0 ? 2: 0, span: 4}}>
           <ArticleCellContent {...author} hideIdx hideNum/>
        </Col>
      ))}
      </Row>
  </Container>
  )
}

export default ArticleHeader
