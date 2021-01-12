import React, { useMemo, useEffect } from 'react'
import {useParams} from 'react-router-dom'
import {groupBy} from 'lodash'
import { useStore } from '../store'
import {useTranslation} from 'react-i18next'
import { Container, Row, Col, Nav } from 'react-bootstrap'
import LangNavLink from '../components/LangNavLink'
import ArticleText from '../components/Article'
import ArticleHeader from '../components/Article/ArticleHeader'
import ArticleBilbiography from '../components/Article/ArticleBibliography'
import source from '../data/mock-ipynb.nbconvert.json'
import { getArticleTreeFromIpynb } from '../logic/ipynb'
import {
  LayerNarrative, LayerNarrativeData,
  LayerHermeneutics, LayerHermeneuticsData,
  LayerData,
  BootstrapColumLayout,
  ArticleRoute,
  ArticleHermeneuticsDataRoute
} from '../constants'


const Article = ({ ipynb}) => {
  const { layer } = useParams() // hermeneutics, hermeneutics+data, narrative
  const { t } = useTranslation()
  const articleTree = useMemo(() => getArticleTreeFromIpynb({
    cells: ipynb? ipynb.cells : source.cells,
    metadata: ipynb? ipynb.metadata : source.metadata
  }), [ipynb])
  const sections = groupBy(articleTree.paragraphs, ({ metadata }) => metadata?.jdh?.section ?? 'paragraphs')
  const { title, abstract, keywords, contributor, paragraphs } = sections

  let contents = []
  let backgroundColor = 'var(--gray-100)'
  if (layer === LayerHermeneutics) {
    contents = paragraphs.filter(({ layer }) => layer === LayerHermeneutics)
    backgroundColor = 'var(--gray-300)'
  } else if (layer === LayerHermeneuticsData) {
    contents = paragraphs.filter(({ layer }) => [
      LayerHermeneutics, LayerHermeneuticsData, LayerData
    ].includes(layer))
    backgroundColor = 'var(--gray-200)'
  } else {
    // layer param not specified, default for "narrative" and "data"
    contents = paragraphs.filter(({ layer }) => [
      LayerNarrative, LayerNarrativeData, LayerData
    ].includes(layer))
  }

  useEffect(() => {
    useStore.setState({ backgroundColor });
  })

  return (
    <div className="page mt-5">
      <ArticleHeader {... {title, abstract, keywords, contributor}}/>
      <Container className="mt-5" style={{position: 'sticky', top: 5, zIndex: 100 }}>
        <Row>
          <Col {...BootstrapColumLayout} >
            <Nav variant="pills" className="justify-content-center">
              <Nav.Item>
                <LangNavLink to={ArticleRoute.to} exact>{t(ArticleRoute.label)}</LangNavLink>
              </Nav.Item>
              <Nav.Item>
                <LangNavLink to={ArticleHermeneuticsDataRoute.to} exact>{t(ArticleHermeneuticsDataRoute.label)}</LangNavLink>
              </Nav.Item>
            </Nav>
          </Col>
        </Row>
      </Container>
      <ArticleText articleTree={articleTree} contents={contents}/>
      <ArticleBilbiography articleTree={articleTree} />
    </div>
  );
}

export default Article
