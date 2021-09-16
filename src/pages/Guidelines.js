import React, { useState  } from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import { Download } from 'react-feather'
import { useTranslation } from 'react-i18next'
import ArticleText from '../components/Article'
import ArticleNote from '../components/Article/ArticleNote'
import ArticleCellContent from '../components/Article/ArticleCellContent'
import { useIpynbNotebookParagraphs } from '../hooks/ipynb'
import { useCurrentWindowDimensions } from '../hooks/graphics'
import { BootstrapColumLayout, DisplayLayerNarrative } from '../constants'
import { downloadFile } from '../logic/api/downloadData'
import source from '../data/mock-api/authorGuideline.json'


const Guidelines = () => {
  const { t } = useTranslation()
  const [selectedDataHref, setSelectedDataHref] = useState(null)
  const articleTree = useIpynbNotebookParagraphs({
    id: "",
    cells: source.cells,
    metadata: source.metadata
  })
  const { title, abstract } = articleTree.sections

  const { height, width } =  useCurrentWindowDimensions()
  return (
    <>
    <Container className="page">
      <Row>
        <Col {...BootstrapColumLayout}>
          <div className="my-5">
          {title.map((props, i) => (
            <ArticleCellContent hideIdx hideNum {...props} key={i} idx=""/>
          ))}
          </div>
          <h3>Introduction</h3>
          {abstract.map((props, i) => (
            <ArticleCellContent hideIdx hideNum {...props} key={i} idx=""/>
          ))}
        </Col>
      </Row>
      <Row>
        <Col {...BootstrapColumLayout}>
          <a className="btn btn-outline-secondary btn-sm rounded " onClick={(e) => {
            e.preventDefault()
            downloadFile({
              url: '/proxy-githubusercontent/C2DH/jdh-notebook/master/author_guideline_template.ipynb',
              filename: 'author_guideline_template.ipynb'
            })
          }} href="#download">
            <span className="d-flex align-items-center">
            <Download className="me-2" size={16} />
            {t('pages.guidelines.downloadArticleTemplate')}
            </span>
          </a>
        </Col>
      </Row>
    </Container>
      <ArticleText
        className='mt-0'
        memoid={articleTree.id}
        headingsPositions={articleTree.headingsPositions}
        paragraphs={articleTree.paragraphs}
        paragraphsPositions={articleTree.paragraphsPositions}
        onDataHrefClick={(d) => setSelectedDataHref(d)}
        height={height}
        width={width}
        disableSwitchLayer
        anchorPrefix={DisplayLayerNarrative}
      />
      {articleTree.citationsFromMetadata
        ? <ArticleNote articleTree={articleTree} selectedDataHref={selectedDataHref}/>
        : null
      }

    </>
  );
}
export default Guidelines
