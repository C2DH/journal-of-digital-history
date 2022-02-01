import React from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import { Download } from 'react-feather'
import { useTranslation } from 'react-i18next'
import { downloadFile } from '../logic/api/downloadData'
import source from '../data/mock-api/authorGuideline.json'
import StaticPageLoader from './StaticPageLoader'
import Article from '../components/ArticleV2'
import { BootstrapColumLayout } from '../constants'
//
const GuidelinesArticle = ({ data, status, isFake=false}) => {
  const { t } = useTranslation()
  console.debug('[GuidelinesArticle] props:', {status, isFake})
  const memoid = process.env.REACT_APP_NOTEBOOK_GUIDELINES_URL + (isFake ? '-fake' : '')
  return (
    <>
    <Article
      pageBackgroundColor='var(--gray-100)'
      ipynb={data}
      memoid={memoid}
      ignorePublicationStatus
      plainTitle="Guidelines"
    >
      <Container>
        <Row>
          <Col {...BootstrapColumLayout}>
            <a className="btn btn-outline-secondary btn-sm rounded " onClick={(e) => {
              e.preventDefault()
              downloadFile({
                url: '/proxy-githubusercontent/C2DH/template_repo_JDH/main/author_guideline_template.ipynb',
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
    </Article>
    </>
  )
}

const Guidelines = () => {
  return (
    <StaticPageLoader
      url={process.env.REACT_APP_NOTEBOOK_GUIDELINES_URL}
      Component={GuidelinesArticle}
      fakeData={source}
    />
  )
}

export default Guidelines
