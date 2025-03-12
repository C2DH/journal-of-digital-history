import React, { useEffect } from 'react'
import { Container, Row, Col, Button } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import AbstractSubmission from '../models/AbstractSubmission'
import { useStore } from '../store'


const AbstractSubmitted = () => {
  const { t } = useTranslation()
  const abstract = useStore((state) => state.abstractSubmitted);
  const temporaryAbstract = useStore((state) => state.temporaryAbstractSubmission);
  const setAbstractSubmitted = useStore((state) => state.setAbstractSubmitted);

  const abstractSubmitted = abstract instanceof AbstractSubmission
    ? abstract
    : new AbstractSubmission(abstract)

  useEffect(() => {
    const temporaryAbstractSubmitted = new AbstractSubmission(temporaryAbstract)
    console.info('temporaryAbstractSubmitted isEmpty:', temporaryAbstractSubmitted.isEmpty())
    if(!temporaryAbstractSubmitted.isEmpty()) {
      setAbstractSubmitted({...temporaryAbstract})
    }
  }, [temporaryAbstract, setAbstractSubmitted])

  const downloadableSubmissionFilename = [
    (new Date()).toISOString().split('T').shift(),
    'submission.json'
  ].join('-')

  return (
    <>
      <Container className="page">
        <Row>
          <Col md={{offset: 2, span:8}}>
            <h1 className="my-5">{t('pages.abstractSubmitted.title')}</h1>
            <h2>{t('pages.abstractSubmitted.subheading')}</h2>
            <hr />
            <p>{t('visibleOnlyByYou')}</p>
          </Col>
        </Row>
        <Row className="pt-4">
          <Col md={{offset: 2, span:8}}>
            <h3>{t('pages.abstractSubmission.articleTitle')}</h3>
            <blockquote className="code">{abstractSubmitted.title}</blockquote>
            <h3>{t('pages.abstractSubmission.articleAbstract')}</h3>
            <blockquote className="code">{abstractSubmitted.abstract}</blockquote>
          </Col>
        </Row>
        <Row className="pt-4">
          <Col md={{offset: 2, span:8}}>
            <h3>{t('pages.abstractSubmission.articleContact')}</h3>
            <blockquote className="code monospace">
              <pre>{JSON.stringify(abstractSubmitted.contact, null, 2)}</pre>
            </blockquote>
          </Col>
        </Row>
        <Row className="pt-4">
          <Col md={{offset: 2, span:8}}>
            <h3>{t('pages.abstractSubmission.AuthorsSectionTitle')} ({abstractSubmitted.authors.length})</h3>
          </Col>
          {abstractSubmitted.authors.map((author,i) => (
            <Col key={i} md={{ offset: i % 2 === 0 ? 2: 0, span: 4}}>
              <blockquote className="code monospace">
                <pre>{JSON.stringify(author, null, 2)} {i % 2}</pre>
              </blockquote>
            </Col>
          ))}
        </Row>
        <Row className="pt-4">
          <Col md={{offset: 2, span:8}}>
            <h3>{t('pages.abstractSubmission.DataSectionTitle')} ({abstractSubmitted.datasets.length})</h3>
          </Col>
          {abstractSubmitted.datasets.map((dataset,i) => (
            <Col key={i} md={{ offset: i % 2 === 0 ? 2: 0, span: 4}}>
              <blockquote className="code monospace">
                <pre>{JSON.stringify(dataset, null, 2)}</pre>
              </blockquote>
            </Col>
          ))}
        </Row>
        <Row className="pt-4">
          <Col md={{offset: 2, span:8}}>
            <p dangerouslySetInnerHTML={{__html: t('pages.abstractSubmitted.moreInfo')}} />
            <Button variant="outline-dark"
              size="sm"
              href={`data:text/json;charset=utf-8,${encodeURIComponent(
                JSON.stringify(abstractSubmitted, null, 2)
              )}`}
              download={downloadableSubmissionFilename}
            >
              {t('actions.downloadAsJSON')} ↓
            </Button>
          </Col>
        </Row>
      </Container>
    </>
  )
}

export default AbstractSubmitted
