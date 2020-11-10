import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Container, Form, Button, Col, Row, Jumbotron,Badge } from 'react-bootstrap'
import ReCAPTCHA from 'react-google-recaptcha'

import { useStore } from '../store'
import { getValidatorResultWithAbstractSchema } from '../logic/validation'
import Author from '../models/Author'
import Dataset from '../models/Dataset'
import FormGroupWrapper from '../components/Forms/FormGroupWrapper'
import FormAuthorContact from '../components/Forms/FormAuthorContact'
import FormAbstractGenericSortableList from '../components/Forms/FormAbstractGenericSortableList'
import { ReCaptchaSiteKey } from '../constants'

console.info('%cRecaptcha', 'font-weight:bold', ReCaptchaSiteKey)

const AbstractSubmissionPreview = ({ results }) => {
  const { t } = useTranslation()
  return (
    <div className="p-3 border-dark">
      <h3>{t('pages.abstractSubmission.preview')}</h3>
      <div  style={{
        maxHeight: '50vh',
        overflow: 'scroll'
      }}>
      {results.map(({ value, isValid, label }, i) => (
        <div key={`result-${i}`} >
          <Badge variant={ isValid ? 'success': 'transparent' } pill>
            {value === null && ' (empty)'}
            {isValid === 'false' && ' (error)'}
          </Badge>{t(label)}
        </div>
      ))}
      </div>
    </div>
  )
}


const AbstractSubmission = (props) => {
  const { t } = useTranslation()
  const [errors, setErrors] = useState([])
  const [ results, setResults ] = useState([
    { id: 'title', value: null, label: 'pages.abstractSubmission.articleTitle' },
    { id: 'abstract', value: null, label: 'pages.abstractSubmission.articleAbstract' },
    { id: 'contact', value: null, label: 'pages.abstractSubmission.articleContact' },
    { id: 'authors', value: null, label: 'pages.abstractSubmission.AuthorsSectionTitle' },
    { id: 'datasets', value: null, label: 'pages.abstractSubmission.DataSectionTitle' }
  ])
  const [authors, setAuthors] = useState([])
  const recaptchaRef = React.useRef();

  useEffect(() => {
    // Update the document title using the browser API
    useStore.setState({ backgroundColor: 'var(--light)' });
  });
  const handleSubmit = async(event) => {
    event.preventDefault();
    const submission = results.reduce((acc, el) => {
      acc[el.id] = el.value
      return acc
    } , {})
    const result = getValidatorResultWithAbstractSchema(submission)
    setErrors(result.errors)
    // console.info('handleSubmit', submission, result.valid)
    if (result.valid) {
      const token = await recaptchaRef.current.executeAsync()
      console.info('%cRecaptcha', 'font-weight:bold', 'token:', token)
    }
  }

  const handleChange = ({ id, value, isValid }) => {
    console.info('changed', id)
    if (id === 'authors') {
      setAuthors(value)
    }
    setResults(results.map((d) => {
      if (d.id === id) {
        return { ...d, value, isValid }
      }
      return { ...d }
    }))
  }
  const handleAddContactAsAuthor = (author) => {
    setAuthors(authors.filter(d => d.id !== author.id).concat([author]))
  }
  const handleRecaptchaChange = (e) => {
    console.info(e)
  }
  
  return (
    <Container className="page mb-5">
      <Row>
        <Col md={{span: 6, offset:2}}>
          <h1 className="my-5">{t('pages.abstractSubmission.title')}</h1>
          <Jumbotron className="pt-4 pb-2 px-4">
            <h3>Call for paper: <b>The Digital Dilemma under the lens of history and historians</b></h3>
            <p>
            This is a simple hero unit, a simple jumbotron-style component for calling
              extra attention to featured content or information.
              <br />
              <Badge pill variant="secondary">Due date: Dec. 2020</Badge>
            </p>
          </Jumbotron>
        </Col>
      </Row>
      <Form noValidate onSubmit={handleSubmit}>
        <Row>
          <Col md={{span: 6, offset:2}}>
            <h3>A title and an abstract</h3>
            <FormGroupWrapper as='textarea' schemaId='#/definitions/title' rows={3}
              label='pages.abstractSubmission.articleTitle'
              ignoreWhenLengthIslessThan={1}
              onChange={({ value, isValid }) => handleChange({ id: 'title', value, isValid })}
            />
            <FormGroupWrapper as='textarea' schemaId='#/definitions/abstract' rows={5}
              label='pages.abstractSubmission.articleAbstract'
              ignoreWhenLengthIslessThan={1}
              onChange={({ value, isValid }) => handleChange({ id: 'abstract', value, isValid })}
            />

            <hr />

            <h3>{t('pages.abstractSubmission.ContactPointSectionTitle')}</h3>
            <FormAuthorContact
              onChange={({ value, isValid }) => handleChange({ id: 'contact', value, isValid })}
              onSelectAsAuthor={handleAddContactAsAuthor}
            />

            <hr />

            <h3>{t('pages.abstractSubmission.AuthorsSectionTitle')}</h3>
            <FormAbstractGenericSortableList
              onChange={({ items, isValid }) => handleChange({
                id: 'authors',
                value: items,
                isValid
              })}
              ItemClass={Author}
              initialItems={authors}
              addNewItemLabel={t('actions.addAuthor')}
              listItemComponentTagName='FormAbstractAuthorsListItem' />

            <hr />

            <h3>{t('pages.abstractSubmission.DataSectionTitle')}</h3>
            <FormAbstractGenericSortableList
              onChange={({ items, isValid }) => handleChange({
                id: 'datasets',
                value: items,
                isValid
              })}
              ItemClass={Dataset}
              addNewItemLabel={t('actions.addDataset')}
              listItemComponentTagName='FormAbstractDatasetsListItem' />
            <hr />
          </Col>
          <Col md={3}>
            <div style={{
              position: 'sticky',
              top: '120px'
            }}>
            <AbstractSubmissionPreview results={results} />
            </div>
          </Col>
        </Row>
        <Row>
          <Col md={{span: 6, offset:2}} className="">
            <Button variant="primary" size="lg" className="px-4" type="submit">
              Submit
            </Button>
            <p dangerouslySetInnerHTML={{__html: t('pages.abstractSubmission.recaptchaDisclaimer')}}/><ReCAPTCHA
              ref={recaptchaRef}
              size="invisible"
              sitekey={ReCaptchaSiteKey}
              onChange={handleRecaptchaChange}
            />
            <pre>{JSON.stringify(errors, null, 2)}</pre>
          </Col>
        </Row>
      </Form>
    </Container>
  )
}

export default AbstractSubmission
