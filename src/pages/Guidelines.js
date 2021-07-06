import React, { useState  } from 'react'
// import { groupBy } from 'lodash'
import { useTranslation } from 'react-i18next'
import { Container, Row, Col } from 'react-bootstrap'
import ArticleCellContent from '../components/Article/ArticleCellContent'
import { getArticleTreeFromIpynb } from '../logic/ipynb'
import { BootstrapColumLayout } from '../constants'
import { useStore } from '../store'
//import ipynb from '../data/mock-api/mock-guidelines.ipynb.json'
import source from '../data/mock-api/authorGuideline.json'
import { downloadFile } from '../logic/api/downloadData'
import { Download } from 'react-feather';
import ArticleText from '../components/Article'
import ArticleHeader from '../components/Article/ArticleHeader'
import ArticleBilbiography from '../components/Article/ArticleBibliography'
import ArticleNote from '../components/Article/ArticleNote'
import { useIpynbNotebookParagraphs } from '../hooks/ipynb'
import { useCurrentWindowDimensions } from '../hooks/graphics'

const Guidelines = () => {
  const { t } = useTranslation()
  const [selectedDataHref, setSelectedDataHref] = useState(null)
  const articleTree = useIpynbNotebookParagraphs({
    id: "",
    cells: source.cells,
    metadata: source.metadata
  })
  const { title, abstract, keywords, contributor, disclaimer = [] } = articleTree.sections

  const { height, width } =  useCurrentWindowDimensions()
  return (
    <div className="page mt-5">
      <ArticleText
        memoid={articleTree.id}
        headingsPositions={articleTree.headingsPositions}
        paragraphs={articleTree.paragraphs}
        paragraphsPositions={articleTree.paragraphsPositions}
        onDataHrefClick={(d) => setSelectedDataHref(d)}
        height={height}
        width={width}
      />
      {articleTree.citationsFromMetadata
        ? <ArticleNote articleTree={articleTree} selectedDataHref={selectedDataHref}/>
        : null
      }
      <Container>
      <Row>
          <Col {...BootstrapColumLayout}>
            <a className="btn btn-primary rounded" onClick={(e) => {
              e.preventDefault()
              downloadFile({
                url: '/proxy-githubusercontent/C2DH/jdh-notebook/master/author_guideline_template.ipynb',
                filename: 'author_guideline_template.ipynb'
              })
            }} href="#download">
              {t('pages.guidelines.downloadArticleTemplate')}
              <Download className="ml-2" size={16} color="var(--dark)"/>
            </a>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
export default Guidelines