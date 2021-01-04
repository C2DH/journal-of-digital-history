import React from 'react'
// import { useTranslation } from 'react-i18next'
import { Container, Row, Col } from 'react-bootstrap'
import ArticleCell from './ArticleCell'
import {BootstrapColumLayout} from '../../constants'
import styles from './ArticleText.module.scss'


const ArticleHeader = ({ title=[], abstract=[], contributor=[] }) => {
  // const { t } = useTranslation()

  return (
    <Container >
      <Row>
        <Col {...BootstrapColumLayout}>
          {title.map((paragraph, i) => (
            <ArticleCell key={i} {...paragraph} hideIdx/>
          ))}
        </Col>
      </Row>
      <Row className="mt-5">
        <Col {...BootstrapColumLayout}>
        {abstract.map((paragraph, i) => (
          <ArticleCell key={i} {...paragraph} className={styles.AbstractArticleCell} hideIdx/>
        ))}
        </Col>
      </Row>
      <Row className="mt-5">
      {contributor.map((author,i) => (
        <Col key={i} md={{ offset: i % 2 === 0 ? 2: 0, span: 4}}>
           <ArticleCell {...author} className={styles.AuthorArticleCell} hideIdx/>
        </Col>
      ))}
      </Row>
  </Container>
  )
}

export default ArticleHeader
