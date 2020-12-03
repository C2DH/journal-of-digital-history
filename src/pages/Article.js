import React from 'react'
import { useTranslation } from 'react-i18next'
import ArticleText from '../components/ArticleText'
import ArticleHeader from '../components/ArticleHeader'
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

export default function Article(){
  // const { t } = useTranslation()
  const articleTree = getArticleTreeFromIpynb({
    cells: source.cells, 
    metadata: source.metadata
  })
  console.info(articleTree);
  return (
    <div>
      <ArticleHeader/>
      <ArticleText articleTree={articleTree}/>
      <ArticleBilbiography articleTree={articleTree} />
    </div>
  );
}
