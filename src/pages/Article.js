import React from 'react'
import {groupBy} from 'lodash'
import { useTranslation } from 'react-i18next'
import ArticleText from '../components/Article'
import ArticleHeader from '../components/Article/ArticleHeader'
import source from '../data/mock-ipynb.nbconvert.json'
import { getArticleTreeFromIpynb } from '../logic/ipynb'

import {Container, Col, Row} from 'react-bootstrap'


const ArticleBilbiography = ({ articleTree }) => {
  const { t } = useTranslation()

  return (
    <Container className="mt-5">
      <Row>
        <Col md={{ span: 7, offset: 2 }}>
          <h2>{t('bibliography')}</h2>
          <div dangerouslySetInnerHTML={{
            __html: articleTree.formatBibliograhpy()
          }}/>
        </Col>
      </Row>
    </Container>
  )
}

const Article = ({ ipynb }) => {
  // const { t } = useTranslation()
  const articleTree = getArticleTreeFromIpynb({
    cells: ipynb? ipynb.cells : source.cells,
    metadata: ipynb? ipynb.metadata : source.metadata
  })
  const sections = groupBy(articleTree.paragraphs, ({ metadata }) => metadata?.jdh?.section ?? 'contents')
  const { title, abstract, keywords, contributor, contents } = sections
  return (
    <div className="page mt-5">
      <ArticleHeader {... {title, abstract, keywords, contributor}}/>
      <ArticleText articleTree={articleTree} contents={contents}/>
      <ArticleBilbiography articleTree={articleTree} />
    </div>
  );
}

export default Article
