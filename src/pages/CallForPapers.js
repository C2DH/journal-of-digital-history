import React from 'react'
import { Container, Row, Col, Button } from 'react-bootstrap'
import { Zap } from 'react-feather'
import { useTranslation } from 'react-i18next'
import StaticPageLoader from './StaticPageLoader'
import Article from '../components/ArticleV2'
import LangLink from '../components/LangLink'
import {
  LayerNarrative,
  BootstrapColumLayout
} from '../constants'


const CallForPapers = ({ match: { params: { permalink }}}) => {
  const { t } = useTranslation()
  // check that permalink is just lowercase characters
  const cfpUrl = [
    process.env.REACT_APP_NOTEBOOK_CFP_BASE_URL,
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
          ignorePublicationStatus
          plainTitle="Guidelines"
          layers={[LayerNarrative]}
        >
          <Container>
            <Row>
            <Col {...BootstrapColumLayout}>
              <LangLink to={`submit?cfp=${permalink}`}>
              <Button
                variant="outline-secondary"
                size="md"
                className="d-flex align-items-center rounded mt-3"
              >
                <Zap className="me-2" size={16}/>
                {t('pages.cfp.applyCallForPapers')}
              </Button>
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
