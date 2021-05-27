import React from 'react'
import { useTranslation } from 'react-i18next'
import { Container, Row, Col } from 'react-bootstrap'
import { useGetJSON } from '../logic/api/fetchData'
import { BootstrapColumLayout } from '../constants'
import LangLink from '../components/LangLink'

const Issues = ({ match: { params: { issueId }}}) => {
  const { t } = useTranslation()
  const { data:issues, error, status } = useGetJSON({ url: `/mock-api/issues.json`, delay: 2000 })
  console.info('Issues status', status, 'error', error)

  return (
    <Container className="Issues page mt-5">
      <Row>
        <Col {...BootstrapColumLayout}>
          <h1>{t('pages.issues.title')}</h1>
          <h2>{t('pages.issues.introduction')}</h2>
        </Col>
      </Row>

      <Row>
        {issues ? issues.map((issue, i) => (
          <Col key={i} md={{span:4, offset: i % 2 === 0 ? 2 : 0}}>
            <svg xmlns="http://www.w3.org/2000/svg" width="200" height="200">
              {Array(Math.round(Math.random() * 20)).fill(0).map(d => (
                <circle
                  cx={100}
                  cy={100}
                  // cx={100 + 5*Math.random()}
                  // cy={100 + 5*Math.random()}
                  r={80 * Math.random()}
                  fill="transparent" stroke="#000"
                  stroke-width={5 * Math.random()}
                />
              ))}
            </svg>
            <h3 className="d-block"><LangLink to={`/issue/${issue.id}`}>{issue.name}</LangLink></h3>
            <p dangerouslySetInnerHTML={{__html: issue.description }} />
          </Col>
        )): null}
      </Row>
      <Row>
        {error ? <pre>{JSON.stringify(error, null, 2)}</pre>: null}
      </Row>
    </Container>
  )
}

export default Issues
