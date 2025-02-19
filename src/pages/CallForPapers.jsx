import React from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import { Zap } from 'react-feather'
import { useTranslation } from 'react-i18next'
import StaticPageLoader from './StaticPageLoader'
import Article from '../components/ArticleV2'
import LangLink from '../components/LangLink'
import NotebookHelmet from '../components/NotebookHelmet'

import {
  LayerNarrative,
  BootstrapColumLayout,
  StatusSuccess
} from '../constants'


const CallForPapers = ({ match: { params: { permalink }}}) => {
  const { t } = useTranslation()
  // check that permalink is just lowercase characters
  const cfpUrl = [
    import.meta.env.VITE_NOTEBOOK_CFP_BASE_URL,
    permalink,
    `${permalink}.ipynb`
  ].join('/')

  return(
    <StaticPageLoader
      url={cfpUrl}
      Component={({ data, status, url }) => (
        <Article
          pageBackgroundColor='var(--gray-100)'
          ipynb={data}
          memoid={url + status}
          category='pages.article.status.CFP'
          ignorePublicationStatus
          plainTitle="Guidelines"
          layers={[LayerNarrative]}
          ignoreHelmet
          ignoreBinder
        >
          {status === StatusSuccess && (
            <NotebookHelmet metadata={data.metadata} status={status} />
          )}
          <Container>
            <Row>
            <Col {...BootstrapColumLayout} className="d-flex justify-content-right">
              <LangLink to={`submit?cfp=${permalink}`}
                className="btn btn-sm btn-accent d-flex align-items-center rounded mt-3"
              >
                <Zap className="me-2" size={16}/>
                {t('pages.cfp.applyCallForPapers')}
              </LangLink>
            </Col>
            </Row>

          </Container>
        </Article>
      )}
    />
  )
}
export default CallForPapers
