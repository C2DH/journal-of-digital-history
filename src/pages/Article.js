import React, { useMemo, useEffect } from 'react'
import {useParams} from 'react-router-dom'
import {groupBy} from 'lodash'
import { useStore } from '../store'
import { useTranslation } from 'react-i18next'
import { Container, Row, Col } from 'react-bootstrap'
import LangLink from '../components/LangLink'
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
  // ArticleRoute,
  // ArticleHermeneuticsDataRoute
} from '../constants'


const Article = ({ ipynb, url }) => {
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
      {url && (
        <Container>
          <Row>
            <Col {...BootstrapColumLayout}>
              <p className="p-2 bg-gray-300" dangerouslySetInnerHTML={{
                __html: t('pages.article.loadedFromRemoteURL', { url })
              }} />
              <LangLink to='/notebook'>{t('pages.article.tryRemoteURL')}</LangLink>
            </Col>
          </Row>
        </Container>
      )}
      <ArticleText articleTree={articleTree} contents={contents}/>
      {articleTree?.bibliography
        ? (<ArticleBilbiography articleTree={articleTree} />)
        : null
      }
    </div>
  );
}

export default Article
